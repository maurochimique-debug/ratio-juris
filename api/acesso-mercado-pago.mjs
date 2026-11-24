import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

const plans = {
  mensal: { cents: 9900, title: 'Ratio Juris – 30 dias' },
  anual: { cents: 37000, title: 'Ratio Juris – 12 meses' },
}

async function request(url, headers, options = {}) {
  const response = await fetch(url, { ...options, headers, signal: AbortSignal.timeout(10000) })
  if (!response.ok) throw new Error('Falha HTTP ' + response.status)
  return response.json()
}

const json = { 'Content-Type': 'application/json' }
const db = (path, options) => request(process.env.RJ_SUPABASE_URL + '/rest/v1/' + path, {
  ...json, apikey: process.env.RJ_SUPABASE_SERVICE_KEY,
  Authorization: 'Bearer ' + process.env.RJ_SUPABASE_SERVICE_KEY,
  Prefer: 'return=representation',
}, options)
const mp = (path, options) => request('https://api.mercadopago.com' + path, {
  ...json, Authorization: 'Bearer ' + process.env.RJ_MP_TEST_TOKEN,
}, options)
const post = body => ({ method: 'POST', body: JSON.stringify(body) })

function signed(req, url) {
  const signature = Object.fromEntries((req.headers['x-signature'] ?? '').split(',').map(part => part.trim().split('=')))
  const id = url.searchParams.get('data.id')
  const requestId = req.headers['x-request-id']
  if (!/^\d+$/.test(id ?? '') || !requestId || !/^\d+$/.test(signature.ts ?? '') ||
      !/^[a-f0-9]{64}$/i.test(signature.v1 ?? '')) return false
  const expected = createHmac('sha256', process.env.RJ_MP_WEBHOOK_SECRET)
    .update(`id:${id};request-id:${requestId};ts:${signature.ts};`).digest()
  return timingSafeEqual(expected, Buffer.from(signature.v1, 'hex'))
}

export default async function handler(req, res) {
  const { RJ_SUPABASE_URL, RJ_SUPABASE_SERVICE_KEY, RJ_SUPABASE_PUBLIC_KEY, RJ_MP_TEST_TOKEN,
    RJ_MP_WEBHOOK_SECRET, RJ_CHECKOUT_ORIGIN, RJ_MP_SELLER_ID } = process.env
  if (process.env.VERCEL_ENV === 'production' || !RJ_SUPABASE_URL || !RJ_SUPABASE_SERVICE_KEY ||
      !RJ_SUPABASE_PUBLIC_KEY || !RJ_MP_TEST_TOKEN || !RJ_MP_WEBHOOK_SECRET ||
      !RJ_CHECKOUT_ORIGIN || !RJ_MP_SELLER_ID) return res.status(503).json({ error: 'Homologação indisponível' })

  res.setHeader('Cache-Control', 'no-store')
  const url = new URL(req.url, RJ_CHECKOUT_ORIGIN)
  try {
    if (req.method === 'POST' && url.searchParams.get('action') === 'webhook') {
      if (!signed(req, url)) return res.status(401).json({ error: 'Assinatura inválida' })
      if (req.body?.type !== 'payment') return res.status(200).json({ ok: true })
      const payment = await mp('/v1/payments/' + url.searchParams.get('data.id'))
      if (payment.live_mode !== false || String(payment.collector_id) !== RJ_MP_SELLER_ID ||
          payment.currency_id !== 'BRL' || !/^[a-f0-9-]{36}$/i.test(payment.external_reference ?? '')) {
        return res.status(200).json({ ok: true })
      }
      await db('rpc/rj_apply_payment', post({
        order_id: payment.external_reference, payment_id: String(payment.id),
        cents: Math.round(payment.transaction_amount * 100), payment_status: payment.status,
        approved_at: payment.date_approved ?? null, updated_at: payment.date_last_updated,
      }))
      return res.status(200).json({ ok: true })
    }

    if (!['GET', 'POST'].includes(req.method)) return res.status(405).end()
    const authorization = req.headers.authorization
    if (!authorization?.startsWith('Bearer ')) return res.status(401).end()
    let user
    try {
      user = await request(RJ_SUPABASE_URL + '/auth/v1/user', { apikey: RJ_SUPABASE_PUBLIC_KEY, Authorization: authorization })
    } catch {
      return res.status(401).end()
    }
    if (req.method === 'GET') {
      const rows = await db('rj_orders?select=plan,access_until&user_id=eq.' + user.id +
        '&status=eq.approved&access_until=gt.' + encodeURIComponent(new Date().toISOString()) +
        '&order=access_until.desc&limit=1')
      return res.status(200).json({ access: rows[0] ?? null })
    }

    const plan = req.body?.plan
    if (typeof plan !== 'string' || !Object.hasOwn(plans, plan)) return res.status(400).end()
    const id = randomUUID()
    const { cents, title } = plans[plan]
    await db('rj_orders', post({ id, user_id: user.id, plan, amount_cents: cents }))
    const checkout = await mp('/checkout/preferences', post({
      items: [{ id: plan, title, quantity: 1, unit_price: cents / 100, currency_id: 'BRL' }],
      external_reference: id,
      notification_url: new URL('/api/acesso-mercado-pago?action=webhook', RJ_CHECKOUT_ORIGIN).toString(),
    }))
    if (!checkout.sandbox_init_point) throw new Error('Checkout de teste indisponível')
    return res.status(201).json({ url: checkout.sandbox_init_point })
  } catch {
    return res.status(502).json({ error: 'Falha temporária na integração' })
  }
}
