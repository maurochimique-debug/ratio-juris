-- RATIO JURIS: modelo de acesso comercial (PROPOSTA NÃO EXECUTADA)
-- Exclusivo de futura instância Supabase dedicada ao RATIO JURIS.
-- Sem GRANT e sem políticas públicas: acesso negado por padrão via RLS.
begin;
create extension if not exists pgcrypto;
create table if not exists public.rj_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nome text not null check(length(trim(nome)) between 2 and 160),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create table if not exists public.rj_plans (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique check(codigo ~ '^[a-z0-9_-]{3,40}$'),
  nome text not null,
  preco_centavos integer not null check(preco_centavos >= 0),
  moeda char(3) not null default 'BRL',
  duracao_dias integer not null check(duracao_dias > 0),
  funcionalidades jsonb not null default '{}'::jsonb,
  ativo boolean not null default false,
  criado_em timestamptz not null default now()
);
create table if not exists public.rj_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.rj_plans(id),
  status text not null check(status in
    ('pending','trialing','active','past_due','canceled','expired','refunded')),
  inicio_em timestamptz not null,
  termina_em timestamptz not null,
  provedor text,
  id_assinatura_provedor text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  check(termina_em > inicio_em),
  unique(provedor,id_assinatura_provedor)
);
create index if not exists rj_subscriptions_user_window
  on public.rj_subscriptions(user_id,status,termina_em desc);
create table if not exists public.rj_payment_events (
  id uuid primary key default gen_random_uuid(),
  provedor text not null,
  evento_externo text not null,
  assinatura_id uuid references public.rj_subscriptions(id),
  tipo text not null,
  recebido_em timestamptz not null default now(),
  processado_em timestamptz,
  resultado text not null default 'pending'
    check(resultado in ('pending','processed','ignored','failed')),
  unique(provedor,evento_externo)
);
create table if not exists public.rj_access_audit (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  recurso text not null,
  decisao text not null check(decisao in ('allow','deny')),
  motivo text not null,
  criado_em timestamptz not null default now()
);
alter table public.rj_profiles enable row level security;
alter table public.rj_plans enable row level security;
alter table public.rj_subscriptions enable row level security;
alter table public.rj_payment_events enable row level security;
alter table public.rj_access_audit enable row level security;
-- Sem políticas nem grants client-side nesta fase.
-- Aplicação futura exige grants mínimos e políticas testadas por usuário,
-- com verificação de assinatura em endpoint autenticado no servidor.
commit;
