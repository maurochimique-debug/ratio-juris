# RATIO JURIS — Plano de importação auditada de provas oficiais

## Fonte de verdade
A versão publicada do simulador permanece intocada nesta etapa.
O catálogo atual `oab-data.js` armazena metadados e sequências de gabaritos, mas
**não comprova que enunciados e alternativas estejam integralmente importados ou homologados**.
A primeira importação deve começar pelo **47º Exame OAB**, por tipo de caderno,
e só depois avançar até o 10º. Não gerar perguntas ou justificativas por IA.

## Pipeline de ingestão
1. Baixar o PDF *da URL da OAB/FGV já cadastrada* e guardar URL, bytes, hash SHA-256,
   data e tipo/cor; rejeitar HTML/edital/resposta inválida.
2. Extrair texto e coordenadas por página; tratar colunas e questões entre páginas;
   marcar blocos ambíguos para revisão manual.
3. Exigir exatamente 80 questões por caderno OAB, enunciado e quatro alternativas
   A/B/C/D; rejeitar mistura entre cadernos e letras ausentes/duplicadas.
4. Vincular o gabarito **por exame e tipo** com documento oficial, natureza
   (definitivo/preliminar/retificado), anulações e retificações.
5. Conferir visualmente texto, página e alternativa contra o PDF. Uma questão só
   muda para status `homologada` depois da conferência documental.
6. Inserir em lote de staging e publicar somente dados homologados; fazer
   rollback por lote em caso de erro.

## Requisitos do banco
Esquema proposto: `database/ratio_juris_schema.sql`.
É SQL de referência **não executado**; conectar a um projeto PostgreSQL/Supabase
exclusivo do RATIO JURIS antes de criar tabelas. RLS fica habilitado sem políticas
públicas por padrão. Não instalar no projeto de idiomas existente.

## Critérios de aceite
- Nenhuma questão/alternativa inventada, duplicada no mesmo caderno, ou sem URL original.
- A/B/C/D e enunciado completos; nomes de banca/exame/tipo/cor corretos.
- Questões anuladas não apresentam alternativa correta inventada.
- Gabaritos preliminares não são promovidos a definitivos sem evidência.
- Textos de legislação/jurisprudência possuem fonte e data de revisão e não são
  inferidos apenas da letra do gabarito.
- Testes de desempenho e navegação Android/desktop antes da troca do leitor atual.

## Compatibilidade
Para o simulador OAB, expor futuramente apenas perguntas `homologadas` e chaves
`homologadas`, protegidas por autenticação e autorização. A ausência de conteúdo
homologado preserva o leitor de PDF atual como fallback, sem interromper o treino.
