-- RATIO JURIS — PROPOSTA de licença pessoal v1; NÃO EXECUTAR sem backend próprio.
-- Não aplicar no projeto Supabase compartilhado com outros produtos.
-- A compra deve ser comprovada por webhook assinado do provedor de pagamentos.
begin;
create schema if not exists ratio_juris;
create table if not exists ratio_juris.licencas (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id),
 plano text not null check (plano in ('15_dias','30_dias','90_dias','anual')),
 situacao text not null default 'pendente' check (situacao in ('pendente','ativa','verificacao','suspensa','expirada','reembolsada')),
 paid_from timestamptz,
 paid_until timestamptz,
 provider text not null,
 provider_purchase_id text not null,
 provider_customer_id text,
 verified_at timestamptz,
 suspended_reason_code text,
 suspended_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique (provider,provider_purchase_id),
 check (paid_until is null or paid_from is null or paid_until>paid_from)
);
create table if not exists ratio_juris.dispositivos_licenciados (
 id uuid primary key default gen_random_uuid(),
 licenca_id uuid not null references ratio_juris.licencas(id) on delete cascade,
 user_id uuid not null references auth.users(id),
 device_token_hash char(64) not null,
 first_seen_at timestamptz not null default now(),
 last_seen_at timestamptz not null default now(),
 revoked_at timestamptz,
 revoked_reason text,
 unique (licenca_id,device_token_hash)
);
create table if not exists ratio_juris.sessoes_licenciadas (
 id uuid primary key default gen_random_uuid(),
 licenca_id uuid not null references ratio_juris.licencas(id) on delete cascade,
 user_id uuid not null references auth.users(id),
 dispositivo_id uuid not null references ratio_juris.dispositivos_licenciados(id),
 token_digest char(64) not null unique,
 issued_at timestamptz not null default now(),
 expires_at timestamptz not null,
 revoked_at timestamptz,
 check (expires_at>issued_at)
);
create table if not exists ratio_juris.eventos_seguranca (
 id bigint generated always as identity primary key,
 licenca_id uuid references ratio_juris.licencas(id),
 user_id uuid references auth.users(id),
 event_type text not null check (event_type in ('new_device','device_limit','concurrent_sessions','suspicious_access','reverify_success','reverify_failure','manual_suspension','appeal_approved','payment_revoked')),
 outcome text not null check (outcome in ('allowed','challenge','restricted','review','revoked')),
 metadata jsonb not null default '{}'::jsonb,
 occurred_at timestamptz not null default now()
);
create index if not exists ratio_juris_licencas_usuario on ratio_juris.licencas(user_id,situacao,paid_until);
create index if not exists ratio_juris_dispositivos_ativos on ratio_juris.dispositivos_licenciados(licenca_id) where revoked_at is null;
create index if not exists ratio_juris_sessoes_ativas on ratio_juris.sessoes_licenciadas(licenca_id,expires_at) where revoked_at is null;
create index if not exists ratio_juris_eventos_tempo on ratio_juris.eventos_seguranca(licenca_id,occurred_at desc);
alter table ratio_juris.licencas enable row level security;
alter table ratio_juris.dispositivos_licenciados enable row level security;
alter table ratio_juris.sessoes_licenciadas enable row level security;
alter table ratio_juris.eventos_seguranca enable row level security;
revoke all on schema ratio_juris from public,anon,authenticated;
revoke all on all tables in schema ratio_juris from public,anon,authenticated;
revoke all on all sequences in schema ratio_juris from public,anon,authenticated;
-- Sem autorização direta do cliente: acesso via API server-side autenticada.
-- A API valida assinatura da compra, JWT do usuário, ownership, situação,
-- validade, sessão, revogação e limites de dispositivo antes de liberar conteúdo pago.
commit;