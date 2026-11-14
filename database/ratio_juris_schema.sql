-- RATIO JURIS / PostgreSQL (proposta ainda não executada)
-- Executar apenas em um projeto dedicado, NUNCA na base da PITRYA.
-- Não importa questões, não concede acesso público e não publica conteúdo não homologado.
begin;
create extension if not exists pgcrypto;
create table if not exists public.rj_bancas (
 id uuid primary key default gen_random_uuid(),
 sigla text not null unique, nome text not null, sitio_oficial text);
create table if not exists public.rj_provas (
 id uuid primary key default gen_random_uuid(),
 banca_id uuid not null references public.rj_bancas(id),
 codigo text not null, titulo text not null,
 edicao integer, ano integer, data_prova date, cargo text, etapa text,
 url_edital text, unique(banca_id,codigo));
create table if not exists public.rj_cadernos (
 id uuid primary key default gen_random_uuid(),
 prova_id uuid not null references public.rj_provas(id),
 tipo text not null, cor text, url_pdf_oficial text not null,
 sha256_pdf char(64), paginas integer check(paginas is null or paginas>0),
 verificado_em timestamptz, unique(prova_id,tipo));
create table if not exists public.rj_lotes_importacao (
 id uuid primary key default gen_random_uuid(),
 origem text not null, metodo text not null
 check(metodo in ('extracao_pdf','transcricao_conferida','importacao_oficial')),
 status text not null default 'rascunho'
 check(status in ('rascunho','em_revisao','homologado','rejeitado')),
 hash_arquivo char(64), observacoes text, criado_em timestamptz not null default now(),
 homologado_em timestamptz);
create table if not exists public.rj_questoes (
 id uuid primary key default gen_random_uuid(),
 caderno_id uuid not null references public.rj_cadernos(id),
 numero integer not null check(numero between 1 and 200),
 enunciado text not null check(length(trim(enunciado))>0),
 pagina_inicial integer check(pagina_inicial is null or pagina_inicial>0),
 pagina_final integer check(pagina_final is null or pagina_final>0),
 lote_id uuid references public.rj_lotes_importacao(id),
 status text not null default 'pendente'
 check(status in ('pendente','revisao','homologada','rejeitada')),
 fonte_url text not null, hash_texto char(64),
 revisado_em timestamptz, criado_em timestamptz not null default now(),
 unique(caderno_id,numero),
 check(pagina_final is null or pagina_inicial is null or pagina_final>=pagina_inicial));
create table if not exists public.rj_alternativas (
 id uuid primary key default gen_random_uuid(),
 questao_id uuid not null references public.rj_questoes(id),
 letra char(1) not null check(letra in ('A','B','C','D','E')),
 texto text not null check(length(trim(texto))>0), unique(questao_id,letra));
create table if not exists public.rj_gabaritos (
 id uuid primary key default gen_random_uuid(),
 questao_id uuid not null unique references public.rj_questoes(id),
 resultado text not null check(resultado in ('A','B','C','D','E','ANULADA','SEM_GABARITO')),
 natureza text not null check(natureza in ('preliminar','definitivo','retificado','pendente')),
 url_documento_oficial text not null,
 status text not null default 'pendente'
 check(status in ('pendente','revisao','homologado','rejeitado')),
 verificado_em timestamptz, observacoes text, criado_em timestamptz not null default now());
create table if not exists public.rj_fundamentacoes (
 id uuid primary key default gen_random_uuid(),
 questao_id uuid not null references public.rj_questoes(id),
 texto text not null, tipo text not null
 check(tipo in ('legislacao','jurisprudencia','doutrina','comentario')),
 fonte_url text not null, diploma_legal text, artigo text,
 situacao text not null default 'rascunho'
 check(situacao in ('rascunho','revisao','homologada','desatualizada')),
 verificado_em timestamptz);
create index if not exists rj_questoes_acervo on public.rj_questoes(caderno_id,status,numero);
create index if not exists rj_fundamentacoes_questao on public.rj_fundamentacoes(questao_id,situacao);
alter table public.rj_bancas enable row level security;
alter table public.rj_provas enable row level security;
alter table public.rj_cadernos enable row level security;
alter table public.rj_lotes_importacao enable row level security;
alter table public.rj_questoes enable row level security;
alter table public.rj_alternativas enable row level security;
alter table public.rj_gabaritos enable row level security;
alter table public.rj_fundamentacoes enable row level security;
-- Sem políticas RLS: nenhuma leitura/escrita pública até configurar a API autenticada.
commit;