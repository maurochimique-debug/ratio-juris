create table public.rj_orders (
  id uuid primary key,
  user_id uuid not null references auth.users(id),
  plan text not null check (plan in ('mensal','anual')),
  amount_cents integer not null,
  status text not null default 'pending',
  provider_payment_id text unique,
  provider_updated_at timestamptz,
  access_until timestamptz,
  created_at timestamptz not null default now(),
  check ((plan = 'mensal' and amount_cents = 9900) or (plan = 'anual' and amount_cents = 37000))
);

alter table public.rj_orders enable row level security;
revoke all on public.rj_orders from anon, authenticated;
grant select, insert on public.rj_orders to service_role;
create index rj_orders_active on public.rj_orders (user_id, access_until desc) where status = 'approved';

create function public.rj_apply_payment(
  order_id uuid, payment_id text, cents integer, payment_status text,
  approved_at timestamptz, updated_at timestamptz
) returns void language plpgsql security definer set search_path = '' as $$
begin
  if updated_at is null or payment_status is null then
    raise exception 'Dados incompletos do pagamento';
  end if;
  if payment_status not in ('approved','refunded','charged_back','cancelled','rejected') then
    return;
  end if;
  if payment_status = 'approved' and approved_at is null then
    raise exception 'Aprovação sem data';
  end if;

  update public.rj_orders as orders
     set status = payment_status,
         provider_payment_id = payment_id,
         provider_updated_at = updated_at,
         access_until = case when payment_status = 'approved' then
           case when orders.plan = 'mensal' then approved_at + interval '720 hours'
                else ((approved_at at time zone 'America/Sao_Paulo') + interval '12 months')
                     at time zone 'America/Sao_Paulo' end
           else null end
   where orders.id = order_id
     and orders.amount_cents = cents
     and (orders.provider_payment_id is null or orders.provider_payment_id = payment_id)
     and (orders.provider_updated_at is null or orders.provider_updated_at < updated_at)
     and (orders.provider_payment_id is not null or payment_status in ('approved','refunded','charged_back'));
end;
$$;

revoke all on function public.rj_apply_payment(uuid,text,integer,text,timestamptz,timestamptz) from public, anon, authenticated;
grant execute on function public.rj_apply_payment(uuid,text,integer,text,timestamptz,timestamptz) to service_role;
