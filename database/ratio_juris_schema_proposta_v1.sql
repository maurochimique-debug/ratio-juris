-- RATIO JURIS | Projeto de schema v1 (NAO APLICADO EM PRODUCAO)
-- Exclusivamente questoes oficiais, sem geracao sintetica. Requer revisao tecnica e juridica.
-- Instalacao futura em projeto PostgreSQL/Supabase exclusivo do RATIO JURIS.
-- Nunca executar este arquivo no banco de outro produto.
begin;

create schema if not exists ratio_juris;

create table if not exists ratio_juris.fontes_oficiais (
  id bigint generated always as identity primary key,
  organizacao text not null,
  tipo_exame text not null,
  numero_exame integer,
  ano integer,
  etapa text not null default 'primeira_fase',
  url_prova text not null check (url_prova ~ '^https://'),
  url_gabarito text check (url_gabarito is null or url_gabarito ~ '^https://'),
  sha256_documento char(64),
  consulta_em timestamptz,
  direitos_reproducao text not null default 'pendente'
    check (direitos_reproducao in ('pendente','autorizado','apenas_link','bloqueado')),
  observacao_direitos text,
  created_at timestamptz not null default now()
);

create table if not exists ratio_juris.questoes (
  id bigint generated always as identity primary key,
  fonte_id bigint not null references ratio_juris.fontes_oficiais(id),
  chave_canonica text not null unique,
  enunciado text,
  disciplina text,
  assunto text,
  dificuldade text check (dificuldade in ('facil','media','dificil') or dificuldade is null),
  status_verificacao text not null default 'pendente'
    check (status_verificacao in ('pendente','revisao','verificada','rejeitada')),
  revisao_legal text not null default 'pendente'
    check (revisao_legal in ('pendente','atual','alterada','revogada','controversa')),
  revisada_em date,
  liberada_para_publicacao boolean not null default false,
  checksum_conteudo char(64),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint publicacao_auditada check (
    not liberada_para_publicacao or
    (status_verificacao='verificada' and enunciado is not null and length(trim(enunciado)) > 30)
  )
);

create table if not exists ratio_juris.alternativas (
  questao_id bigint not null references ratio_juris.questoes(id) on delete cascade,
  letra char(1) not null check (letra in ('A','B','C','D','E')),
  texto text not null check (length(trim(texto)) > 0),
  primary key (questao_id,letra)
);

-- Um mesmo enunciado pode aparecer em cadernos de cores distintas:
-- a correspondencia e o gabarito sao por caderno e nunca inferidos.
create table if not exists ratio_juris.ocorrencias_de_prova (
  id bigint generated always as identity primary key,
  questao_id bigint not null references ratio_juris.questoes(id) on delete cascade,
  fonte_id bigint not null references ratio_juris.fontes_oficiais(id),
  tipo_caderno text not null,
  numero_questao integer not null check (numero_questao > 0),
  letra_gabarito char(1) check (letra_gabarito in ('A','B','C','D','E')),
  anulada boolean not null default false,
  gabarito_verificado boolean not null default false,
  url_gabarito_especifico text check (
    url_gabarito_especifico is null or url_gabarito_especifico ~ '^https://'
  ),
  unique(fonte_id,tipo_caderno,numero_questao),
  unique(questao_id,fonte_id,tipo_caderno),
  check (not (anulada and letra_gabarito is not null))
);

create table if not exists ratio_juris.comentarios_editoriais (
  id bigint generated always as identity primary key,
  questao_id bigint not null references ratio_juris.questoes(id) on delete cascade,
  explicacao text not null,
  por_que_outras_erradas text,
  artigo_legal text,
  url_legislacao text check (url_legislacao is null or url_legislacao ~ '^https://'),
  redacao_legal_consultada_em date,
  responsavel_revisao text,
  status_revisao text not null default 'rascunho'
    check (status_revisao in ('rascunho','em_revisao','aprovado','desatualizado')),
  revisado_em date,
  created_at timestamptz not null default now(),
  unique(questao_id,id)
);

create table if not exists ratio_juris.jurisprudencia (
  id bigint generated always as identity primary key,
  questao_id bigint not null references ratio_juris.questoes(id) on delete cascade,
  tribunal text not null,
  numero_processo text,
  tese_pertinente text,
  url_fonte_oficial text not null check (url_fonte_oficial ~ '^https://'),
  julgado_em date,
  conferido_em date,
  status_verificacao text not null default 'pendente'
    check (status_verificacao in ('pendente','verificado','superado'))
);

create table if not exists ratio_juris.respostas_alunos (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  ocorrencia_id bigint not null references ratio_juris.ocorrencias_de_prova(id),
  resposta char(1) check (resposta in ('A','B','C','D','E')),
  respondida_em timestamptz not null default now(),
  unique (user_id,ocorrencia_id)
);

create index if not exists rj_questoes_fonte on ratio_juris.questoes(fonte_id);
create index if not exists rj_questoes_disciplina_assunto on ratio_juris.questoes(disciplina,assunto);
create index if not exists rj_questoes_publicadas on ratio_juris.questoes(id)
  where liberada_para_publicacao=true;
create index if not exists rj_jurisprudencia_questao on ratio_juris.jurisprudencia(questao_id);
create index if not exists rj_respostas_usuario on ratio_juris.respostas_alunos(user_id);

-- Defesa em profundidade: nenhuma tabela e exposta automaticamente.
alter table ratio_juris.fontes_oficiais enable row level security;
alter table ratio_juris.questoes enable row level security;
alter table ratio_juris.alternativas enable row level security;
alter table ratio_juris.ocorrencias_de_prova enable row level security;
alter table ratio_juris.comentarios_editoriais enable row level security;
alter table ratio_juris.jurisprudencia enable row level security;
alter table ratio_juris.respostas_alunos enable row level security;
revoke all on schema ratio_juris from public, anon, authenticated;
revoke all on all tables in schema ratio_juris from public, anon, authenticated;
revoke all on all sequences in schema ratio_juris from public, anon, authenticated;

-- Sem politicas liberais: a futura API deve validar publicacao, permissao de
-- reproducao e gabarito no backend; respostas individuais exigem auth.uid().
-- Nao se registram linhas sinteticas/demonstrativas como conteudo oficial.
commit;
