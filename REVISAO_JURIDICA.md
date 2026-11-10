# RatioJuris — 41º Exame oficial e auditoria do código original (10/11/2026)

## Acervo oficial importado

A plataforma passou a ter **sete edições com correção interna**: 41º, 42º, 43º, 44º, 45º, 46º e 47º EOU, cada uma com **80 questões distintas**, o que perfaz **560 questões oficiais distintas**. Os quatro tipos de caderno de um mesmo Exame contêm as mesmas questões em ordens diferentes, e por isso **não quadruplicam o total do banco**.

Os Exames 40º a 10º permanecem como páginas históricas oficiais catalogadas, **sem gabaritos importados para correção na versão atual**. O número de **6.000 questões oficiais não é comprovado** pelo material integrado e não é divulgado como disponível na interface.

### 41º Exame da OAB — validação documental

- Prova objetiva: **28 de julho de 2024**
- Gabarito definitivo divulgado em **14 de agosto de 2024**
- PDF com os **quatro gabaritos definitivos e 80 linhas de correspondência**: https://s.oab.org.br/arquivos/2024/08/84fbe13b-0efb-4b50-b729-aaba9edd95e5.pdf
- Comunicado oficial: https://www.oab.org.br/util/print/62490?print=Noticia
- Caderno Tipo 1 (Branco): https://s.oab.org.br/arquivos/2024/07/19c7a9d4-0c6f-420c-90e2-113d66ded881.pdf
- Caderno Tipo 2 (Verde): https://s.oab.org.br/arquivos/2024/07/df1893ce-865b-4e7f-a15f-76f21964280f.pdf
- Caderno Tipo 3 (Amarelo): https://s.oab.org.br/arquivos/2024/07/f5c23a40-5b20-44a5-b0f4-dc44d1d67034.pdf
- Caderno Tipo 4 (Azul): https://s.oab.org.br/arquivos/2024/07/cba6ee4b-2e34-4341-9b8d-d0c0f83cb12e.pdf

As quatro sequências de **80 respostas** foram conferidas contra os gabaritos oficiais. A tabela de correspondência foi verificada por **240 comparações sem divergências**. Não há questões anuladas nos gabaritos definitivos apresentados. O simulador, o card de estatísticas e a folha de correção usam a edição correta e têm armazenamento individual por exame/caderno.

## Auditoria do arquivo de código-fonte compartilhado pelo usuário

O código HTML anterior fornecido para aperfeiçoamento contém a função `gerarBancoEstendido()`, que multiplica um conjunto pequeno de exemplos trocando o número do Exame e o nome da banca. Essas multiplicações **não representam questões oficiais distintas**. O arquivo também continha afirmações incorretas sobre precedentes e promessas de acessibilidade ainda não implementadas.

Esse gerador artificial foi **deliberadamente excluído** da versão atual. Não foi reutilizado para ampliar o acervo, não foram criadas novas perguntas e não há representação enganosa de FGV, CEBRASPE, VUNESP ou FCC.

## Revalidação

**41/41 testes de lógica DOM simulados aprovados** para o 41º EOU: quatro cadernos, PDFs oficiais, correspondência, 80/80, estatísticas, navegação até a questão 80, persistência e preservação dos Exames 42º–47º. As 172 verificações funcionais e 14 verificações do leitor local de PDF da etapa anterior também permanecem registradas.

Pendências: testes reais em navegador e diferentes aparelhos, autenticação sob Vercel SSO, validação de extração em PDFs com colunas, NVDA/VoiceOver/TalkBack e atualização jurídico-editorial individual. A leitura do PDF usa recurso do navegador e texto extraído do documento selecionado pelo usuário, não questionário fictício.

---

# RatioJuris — Correção integral do simulador oficial e do leitor acessível (10/11/2026)

## Regra de procedência — sem inventar questões

Esta versão oferece navegação e correção **exclusivamente vinculadas a documentos oficiais da OAB/FGV**. O usuário escolhe exame, tipo e número da questão, abre o PDF do caderno original, marca A–D e pode corrigir a prova pelo gabarito definitivo da mesma edição e caderno. Não são fabricados enunciados ou alternativas e não há importação de prova de banca diferente sem fonte real.

**Acervo efetivamente integrado:** provas 42º–47º (seis edições × 80 = **480 questões de exame distintas**, em quatro versões de caderno por exame). Os arquivos do 41º ao 10º continuam somente catalogados como links, **sem correção interna**. A primeira fase OAB/FGV do 47º ao 10º, mesmo que todas as 38 edições fossem verificadas, equivaleria a 3.040 questões distintas (38 × 80), e não a 6.000. Outras bancas ainda não possuem questões oficiais importadas; não inflar contagens com cadernos equivalentes.

## Simulador oficial funcional

- Card "Simulador de questões oficiais" ligado à base importada, **80 questões por exame/tipo**.
- Navegação por questão anterior/próxima e seleção direta pelo número, sem loop ou repetição forçada no final. A posição selecionada é armazenada por edição/caderno.
- Alternativas A/B/C/D representam as **letras das alternativas do PDF original**, não textos novos; a banca é citada explicitamente. O arquivo oficial fica disponível para abrir e consultar.
- A alternativa marcada é salva no mesmo histórico da folha de respostas completa, com sincronização bidirecional. Corrigir exibe acerto ou erro segundo gabarito **somente após a ação de correção**.
- Questões anuladas não exigem resposta e rendem ponto automático conforme o gabarito de cada caderno.
- Card de acertos e erros restaurado ao **estilo compacto original**, com total respondido, em branco, anulações e aproveitamento associados a cada prova.
- Removidos os trechos especificados pelo usuário, mantido exatamente "Acervo de questões • Legislação Atualizada".
- Links do Modo Gabinete para artigos no Planalto preservados com fallback para a lei completa.

## Leitor acessível do PDF original

Foi adicionado `leitor-pdf-oficial.js`, com leitura local de PDF escolhido pelo usuário usando **Mozilla PDF.js versão 6.4.299** via CDN (https://cdnjs.com/libraries/pdf.js/6.4.299). A biblioteca é carregada sob demanda; o PDF é lido por `File.arrayBuffer()`, sem envio do arquivo a backend. O leitor apresenta texto extraído por página com região acessível para leitores de tela e permite procurar aproximadamente a questão selecionada e reproduzir seu texto por síntese de voz do navegador.

Limitações técnicas declaradas: páginas digitalizadas exclusivamente como imagem podem não conter texto extraível (não foi implementado OCR); layout em colunas pode alterar a ordem das frases; o texto original deve ser conferido no PDF; o arquivo carregado localmente **não é autenticado como oficial** pelo aplicativo e deve ter sido baixado pelo usuário da fonte da banca. A qualidade/compatibilidade da voz depende de navegador, sistema e vozes instaladas. A leitura em voz foi ajustada para segmentos controlados, com possibilidade de pausar e parar sem retomar automaticamente uma fila cancelada.

## Testes e limites de homologação

- **172/172 testes simulados de integração**: 6 exames × 4 cadernos, respostas, correção, estatísticas, anulações, persistência de posição, sincronização com folha e bloqueio de edições sem gabarito.
- **14/14 testes de PDF local (com biblioteca simulada)**: seleção, leitura, páginas, extração de texto, localização aproximada de questão, saída por voz, limpeza e falhas de arquivo.
- **Auditoria estática de HTML/JS**: sem IDs duplicados, botões clicáveis com funções existentes, sem referências ausentes a IDs de controles e JavaScript compilável.
- Estes testes **não constituem teste de navegador real nem certificação de WCAG**. Faltam teste ponta a ponta autenticado sob Vercel SSO, validação em NVDA, VoiceOver e TalkBack e prova de funcionamento com PDFs reais em diferentes navegadores.
- A integração do PDF.js depende de conexão à CDN, embora **o próprio PDF permaneça local**; não afirmar suporte offline.

---

# Importação do 42º Exame FGV/OAB — 10/11/2026

## Documentos e retificação oficial

- Prova objetiva em **01/12/2024**, gabarito definitivo divulgado em **18/12/2024**
- Usada a **versão atualizada depois do reprocessamento da FGV**, em vez da primeira publicação que apresentou inconsistência no processamento da pontuação
- PDF oficial definitivo atualizado, com quatro gabaritos e tabela de correspondência: https://s.oab.org.br/arquivos/2024/12/f7a7e51f-5468-402d-b594-c09a0e499b9f.pdf
- Comunicado oficial de inconsistências e reprocessamento: https://www.oab.org.br/noticia/62825/fgv-esclarece-inconsistencias-no-gabarito-do-42-exame-de-ordem-unificado
- Notícia sobre resultado retificado: https://www.oab.org.br/noticia/62826/42-eou-veja-o-resultado-preliminar-atualizado-da-prova-objetiva

## Cadernos de prova oficiais

1. Tipo 1 Branca: https://s.oab.org.br/arquivos/2024/12/6588c7e0-3c87-4efd-a0f5-ebef5dfcbb74.pdf
2. Tipo 2 Verde: https://s.oab.org.br/arquivos/2024/12/8c7a49ec-1f62-417a-b45a-9c9dc958019d.pdf
3. Tipo 3 Amarela: https://s.oab.org.br/arquivos/2024/12/20701071-ee55-45d2-809e-3d5d981221c1.pdf
4. Tipo 4 Azul: https://s.oab.org.br/arquivos/2024/12/f3a737bc-fa2f-44ef-b01c-617e1623118b.pdf

## Validação da anulação

A **questão 43 do caderno Tipo 1** foi anulada. Correspondentes:
- Tipo 1: Q43
- Tipo 2: Q44
- Tipo 3: Q43
- Tipo 4: Q44

A atribuição de ponto é automática, inclusive para resposta em branco, conforme gabarito definitivo e comunicado FGV/OAB. As **320 respostas e 80 linhas de correspondência** foram transcritas do PDF definitivo e verificadas por **240 comparações entre os quatro cadernos, sem divergências**.

## Situação do banco jurídico

**Seis edições OAB possuem correção eletrônica:** 47º, 46º, 45º, 44º, 43º e 42º, correspondendo a **480 questões de exame distintas**, cada qual com quatro versões de caderno. Do 41º ao 10º, permanecem links oficiais no catálogo, **sem correção interna** até verificação de documentos. Não declarar como disponíveis 6.000 questões sem importação real.

Os enunciados originais não foram reproduzidos; consultar o PDF oficial da banca. O gabarito histórico não implica que comentários sobre lei/jurisprudência tenham sido atualizados. O Modo Gabinete e o card de estatísticas foram preservados.

**32/32 verificações de lógica simulada aprovadas**, incluindo a correção dos 4 tipos do 42º, aplicação da anulação, 80/80 e prova em branco, preservação do 43º–47º, persistência e bloqueio do 41º não importado. A homologação visual E2E e de leitores de tela continua pendente.

---

# RatioJuris — Importação oficial do 44º e 43º EOU (10/11/2026)

O projeto passou a registrar **cinco Exames da OAB com correção eletrônica**: 47º, 46º, 45º, 44º e 43º. Cada prova possui quatro cadernos e respectivo gabarito definitivo com 80 posições, preservado como registro histórico. Enunciados e alternativas continuam nos PDFs originais da banca, sem transcrição ou criação de perguntas fictícias.

## 44º Exame

- Data da prova: **17/08/2025**; gabarito definitivo publicado em **03/09/2025**
- Gabarito definitivo no domínio oficial da OAB: https://s.oab.org.br/arquivos/2025/09/b6fb7503-e2cf-4e9b-8b0a-9b822df591fe.pdf
- Portal oficial de divulgação: https://www.oab.org.br/util/print/63382?print=Noticia
- Cadernos oficiais Tipos 1 a 4, respectivamente:
  - https://s.oab.org.br/arquivos/2025/08/fda2cc49-fbbd-4893-9b75-0f61c177cd5d.pdf
  - https://s.oab.org.br/arquivos/2025/08/5c87b5a1-5cb9-4250-9481-6ba64f818c9f.pdf
  - https://s.oab.org.br/arquivos/2025/08/f573455a-d068-4dd0-90b7-8bb13606174d.pdf
  - https://s.oab.org.br/arquivos/2025/08/b3b68be6-cbb9-411a-9bb7-3c06230d2b16.pdf

As quatro sequências oficiais de 80 respostas foram conferidas com o PDF definitivo. **Não há anulações** no gabarito definitivo. O PDF publicado do gabarito contém apenas as quatro folhas de respostas, **sem tabela de equivalência entre questões dos cadernos**; por isso o sistema não inventa tal tabela, nem atribui disciplinas individualizadas por suposição. Cada caderno é corrigido diretamente com sua sequência oficial.

## 43º Exame

- Data da prova: **27/04/2025**; gabarito definitivo divulgado em **14/05/2025**
- PDF oficial com quatro gabaritos e **tabela de correspondência** (páginas 1 e 2): https://s.oab.org.br/arquivos/2025/05/2d003602-840e-4ef2-9a4a-004144a35268.pdf
- Portal oficial: https://www.oab.org.br/noticia/63088/confira-o-gabarito-definitivo-e-o-resultado-preliminar-da-1-fase-do-43-eou
- Cadernos oficiais Tipos 1 a 4, respectivamente:
  - https://s.oab.org.br/arquivos/2025/04/145104f9-1301-453d-9079-3d5af4f8e60a.pdf
  - https://s.oab.org.br/arquivos/2025/04/a7b60f68-32b5-44a8-9fea-41d9c4f2ccbc.pdf
  - https://s.oab.org.br/arquivos/2025/04/f357a8e2-04de-4c73-be4f-8bf1230fc835.pdf
  - https://s.oab.org.br/arquivos/2025/04/bbd4fe5e-27d3-4523-bb18-27ebe7353d3f.pdf

**Duas anulações por caderno**, conforme documento definitivo:

| Tipo | Questões anuladas |
| --- | --- |
| 1 (Branca) | 1 e 74 |
| 2 (Verde) | 4 e 73 |
| 3 (Amarela) | 6 e 71 |
| 4 (Azul) | 2 e 72 |

A correspondência oficial foi registrada e confrontada por **240 comparações de gabarito entre os quatro tipos, sem divergências**. Uma questão anulada recebe pontuação automaticamente, inclusive quando ficou em branco. Essa regra também se reflete no card de estatísticas de respostas.

## Controle editorial

- Os resultados são históricos, **não demonstram que a legislação/jurisprudência atual confirma cada alternativa**.
- A interface não reproduz questões de banco autoral e não cria enunciados.
- O 42º ao 10º permanecem apenas no catálogo de páginas oficiais FGV/OAB, sem correção local.
- **134/134 testes de lógica DOM simulada aprovados**, abrangendo cinco exames, 20 cadernos, persistência, pontuação, anulações e bloqueio de exames não importados.
- Homologação E2E visual/navegador real e revisão com tecnologias assistivas ainda pendentes por causa da proteção SSO.
- Próximo exame da fila: 42º, sujeito a validação de documentos oficiais.

---

# Atualização — 10/11/2026: estatísticas oficiais, 45º EOU e links de artigos do Planalto

## Modo Gabinete — localização do artigo escolhido

O Gabinete permite selecionar **legislação federal oficial** (Constituição, CC, CPC, CPP, CP, CTN, CLT, CDC, ECA, LINDB, Estatuto da OAB, Lei 14.133/2021 e Lei 9.784/1999), informar **número do artigo** (por exemplo: `366`, `20`, `28-A`) e gerar um link direcionado à **página oficial do Planalto**, usando fragmento de localização de texto do navegador:

- Código Civil, art. 366: `https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm#:~:text=Art.%20366.`
- LINDB, art. 20: `https://www.planalto.gov.br/ccivil_03/decreto-lei/del4657compilado.htm#:~:text=Art.%2020.`

A função aceita buscas livres como `art. 366 CC` ou `art. 20 LINDB`, além de manter consultas cadastradas ao STF e STJ. As URLs das normas são de lista autorizada; números de artigo são validados e o texto pesquisado é adicionado à interface via `textContent`, não HTML executável.

**Limite operacional importante:** o Planalto não disponibiliza âncora HTML estável para todos os artigos; o fragmento de texto é interpretado pelo navegador (principalmente Chromium). Em navegadores sem suporte, em caso de bloqueio ou redação diferente da que consta do fragmento, o aplicativo oferece o link geral do diploma e orientação de localizar o dispositivo com Ctrl+F/Busca na página. Não há garantia universal de rolagem exata.

## Novo card de desempenho de provas oficiais

O card da folha de respostas informa:
- Quantidade de respostas marcadas e em branco, independentemente de correção;
- **Acertos e erros** efetivamente marcados, liberados somente após a correção da prova;
- Pontos de anulação concedidos pelo gabarito definitivo e aproveitamento percentual de **pontos totais / 80**;
- Separação por **exame e tipo de caderno** no navegador; ao alterar uma resposta o resultado fica pendente de nova correção.

Questões não respondidas **não** são consideradas erros; questões oficialmente anuladas podem gerar pontuação automática. Não se fornece resultado de exame sem gabarito importado.

## 45º Exame de Ordem integrado

O 45º EOU (prova objetiva de **21/12/2025**, gabarito definitivo de **19/01/2026**) passa a ter folha local para **quatro tipos de caderno com 80 respostas**, diferenciada dos 46º e 47º Exames. Os gabaritos foram confrontados entre os quatro tipos e tabela de correspondência oficial sem inconsistências.

Gabarito oficial: https://s.oab.org.br/arquivos/2026/01/183549bb-ee34-4ac4-aefb-5962d96acca0.pdf

O registro **não** reproduz enunciados integrais da FGV/OAB, não incorpora comentários jurídicos individuais do 45º, e não atribui ao gabarito histórico validade jurídica atual automática. Do 44º ao 10º EOU permanecem links oficiais no catálogo, sem correção interna homologada.

O texto de apresentação principal do usuário foi mantido. Na seção do arquivo foi usado exatamente o título solicitado: **Qual Banca Você Quer Treinar Agora? (Acervo Especial)**, removendo a descrição longa anterior. Nenhuma alegação não verificada de 6.000 questões foi adicionada ao site.

## Testes

**62/62 testes simulados de lógica aprovados**: três exames, quatro tipos de caderno por exame, gabaritos, nota máxima, respostas incorretas, em branco, pontuação da anulação, persistência das estatísticas, exames não importados e direcionamento por artigo. Testes E2E reais de navegador/visual e SSO permanecem pendentes.

---

# Política obrigatória de questões oficiais — 10 de novembro de 2026

A pedido do responsável pelo RatioJuris, **somente questões comprovadamente pertencentes a provas de bancas examinadoras** poderão integrar a plataforma. É **proibido** criar questões autorais, sintéticas, reformuladas ou atribuídas ficticiamente a FGV, CEBRASPE, VUNESP ou FCC como se fossem provas dessas organizações.

## Correção executada

- **Removido da interface e do repositório:** o Super Simulador de 66 questões autorais e seu arquivo `questoes-autorais-2026.js`, incluindo todo o mecanismo de sorteio e armazenamento de histórico dessas questões.
- **Mantidos:** o catálogo de 38 Exames da OAB (47º ao 10º), gabaritos definitivos e folhas eletrônicas de correção para **46º e 47º**, com 80 posições e quatro cadernos cada, a documentação de comentários do 47º e o Modo Gabinete.
- **FGV/OAB:** 46º e 47º possuem suporte de correção com caderno PDF original e gabarito definitivo. Edições **45º a 10º** continuam apenas como links no catálogo, sem banco de correção local na versão de produção desta alteração.
- **CEBRASPE, VUNESP e FCC:** aparecem como **em preparação**, sem qualquer questão exibida como oficial ou interativa antes da importação de fontes verdadeiras.
- **Acessibilidade:** suporte a contraste, zoom, teclado, leitura por voz de progresso/resultados e comunicação alternativa preservados. Como os enunciados integrais não estão no HTML, a leitura deles depende do PDF oficial e de sua acessibilidade intrínseca.
- **Integridade:** o texto de apresentação fornecido pelo usuário foi preservado integralmente, sem alteração.

## Requisitos mínimos antes de importar cada questão

Para incorporar **qualquer** questão de banca, exigir prova real e identificável (banca, edital/cargo, ano, caderno, questão, PDF original ou URL oficial), gabarito oficial definitivo (incluindo retificações/anulações), referência jurídica atual com data de conferência e controle de direitos de reprodução do enunciado. Na ausência de permissão de reprodução, apresentar **link para o PDF oficial e folha eletrônica de respostas** em vez de copiar o texto da questão.

O banco deve manter separados **gabarito histórico** e **comentário editorial sobre legislação/jurisprudência atual**, não alterar o histórico por modificações posteriores e nunca inventar alternativas, datas, precedentes ou procedência.

## Verificação

**20/20 testes funcionais simulados aprovados:** código sem questão autoral ou módulo sintético, 46º com 4 × 80 posições e notas máximas 80/80, 47º preservado com anulação oficial e 80/80, exame sem importação desabilitado, Modo Gabinete e painel de acessibilidade preservados. Testes E2E visuais em navegador protegido por SSO ainda pendentes.

---

## Acessibilidade visual e comunicação alternativa — 10/11/2026

O RatioJuris passou a disponibilizar um botão Acessibilidade no cabeçalho, inclusive em telas móveis. O painel oferece ajuste de fonte (100, 125, 150%), alto contraste, foco por teclado, salto para simulador, leitura nativa por voz do enunciado, alternativas, explicação e progresso/resultados dos Exames OAB 46º e 47º.

Para pessoas com dificuldade de fala, disponibiliza campo escrito e frases prontas com reprodução vocal opcional. Texto não é transmitido a backend e áudio não inicia automaticamente. Preferências de texto e contraste ficam locais no navegador.

Os controles foram testados em **25 cenários DOM simulados**. Isso não representa certificação WCAG 2.2 AA; requer testes com NVDA, VoiceOver, TalkBack, zoom de 200%, contraste e navegação por teclado em dispositivos reais.

A leitura do enunciado integral das provas oficiais da OAB depende de seus PDFs originais: o site não republica o texto integral. Recursos de voz dependem do suporte do navegador e vozes instaladas. A proteção SSO da Vercel permanece em vigor.

Consulte `ACESSIBILIDADE.md` para documentação dos controles e limitações.

---

## Atualização de 10/11/2026 — 46º EOU corrigível e banco autoral sem repetição

### 46º Exame de Ordem — fontes oficiais

A 1ª fase do 46º EOU ocorreu em **03/05/2026**. Em **20/05/2026**, a OAB divulgou o **gabarito definitivo** de cada um dos quatro cadernos. Os PDFs, as 320 respostas (4 × 80) e a tabela de correspondência estão integrados no `oab-data.js` (seção `exam46`). As correspondências dos quatro tipos foram conferidas contra as respostas oficiais, sem divergências.

- **Gabarito definitivo:** https://s.oab.org.br/arquivos/2026/05/0662d6ed-01a3-4ee5-905f-a6704d72992b.pdf
- **Publicação oficial do gabarito em 20/05/2026:** https://www.oab.org.br/noticia/64200/confira-o-gabarito-definitivo-e-o-resultado-preliminar-da-prova-objetiva-do-46-eou
- **Caderno Tipo 1 (Branca):** https://s.oab.org.br/arquivos/2026/05/b5f2a4bd-8885-4f42-909f-a2ecac329dab.pdf
- **Caderno Tipo 2 (Verde):** https://s.oab.org.br/arquivos/2026/05/9e37bd12-07a3-4cdb-aef9-09bb663721c5.pdf
- **Caderno Tipo 3 (Amarela):** https://s.oab.org.br/arquivos/2026/05/c58cbc52-71d3-4991-a415-97c0b31c959e.pdf
- **Caderno Tipo 4 (Azul):** https://s.oab.org.br/arquivos/2026/05/44ac1fe4-5f00-43c8-a7c8-647c978a9012.pdf

O 46º Exame agora possui **folha de respostas e cálculo de acertos local**, com armazenamento por tipo em chaves `ratio_oab46_tipo1` a `tipo4`, independentes do 47º. Não foi identificada questão anulada nos gabaritos definitivos desse exame; por isso o sistema não atribui ponto automático. O resultado é histórico e não implica avaliação da legislação atualmente vigente.

**Não concluído:** o 46º ainda não conta com **80 comentários jurídicos individualizados**, nem republicação de enunciados (que devem ser consultados no PDF oficial). O projeto preserva 79 comentários e uma questão anulada do **47º Exame**; o 45º ao 10º permanecem apenas no catálogo de links.

### Ampliação do Super Simulador autoral

Foram adicionadas **12 questões autorais inéditas no estilo FGV**, IDs `RJ-FGV-038` a `RJ-FGV-049`, cobrindo Ética, Constitucional, Civil, Processo Civil, Tributário, Penal, Trabalho, Consumidor e ECA. Estes itens **não são questões oficiais da FGV nem da OAB**, mas exercícios originais elaborados sobre dispositivos legais com links de consulta.

| Banco de treino autoral | Antes | Adicionadas | Total |
|---|---:|---:|---:|
| FGV | 42 | 12 | **54** |
| CEBRASPE | 4 | 0 | 4 |
| VUNESP | 4 | 0 | 4 |
| FCC | 4 | 0 | 4 |
| **Total** | **54** | **12** | **66** |

O algoritmo de seleção sem reposição mantém histórico por banca; as 12 novas questões podem aparecer como inéditas para usuários que já esgotaram as 42 anteriores. Reinício é manual, jamais automático.

### Testes e limites

- 31/31 testes automatizados em ambiente DOM simulado aprovados: gabaritos dos quatro tipos do 46º, PDFs por tipo, acerto máximo 80/80, nota zero sem respostas, limpeza seletiva, armazenamento independente, preservação do 47º, exaustão sem repetição das 54 FGV e integridade de provas ainda não importadas.
- Os textos legais foram selecionados em consulta aos portais oficiais até 10/11/2026, mas **não há auditoria integral de jurisprudência, homologação jurídica formal ou monitoramento contínuo de alterações legislativas**.
- Homologação visual E2E de navegador autenticado permanece pendente devido à proteção SSO configurada no projeto.
- Comentários de preparação são educacionais, e não substituem exame de alterações normativas e precedentes específicos.

---

## Ampliação do Super Simulador autoral — 09/11/2026

### Problema e solução

O banco inicial apresentava apenas 8 questões autorais distintas no Super Simulador (FGV: 5; CEBRASPE: 1; VUNESP: 1; FCC: 1). A prevenção de repetição foi implantada anteriormente, mas o banco se esgotava rapidamente.

**Este lote acrescenta 46 questões autorais inéditas** no arquivo `questoes-autorais-2026.js`, preservando as oito anteriores. Totais atuais:

| Banca (estilo de questão) | Antes | Novas | Total |
|---|---:|---:|---:|
| FGV (ênfase OAB) | 5 | 37 | **42** |
| CEBRASPE | 1 | 3 | **4** |
| VUNESP | 1 | 3 | **4** |
| FCC | 1 | 3 | **4** |
| **Total** | **8** | **46** | **54** |

As 42 questões FGV abrangem **18 disciplinas** de direito; CEBRASPE utiliza o formato de julgamento Certo/Errado. Todos os 46 novos registros têm identificador estável, alternativas distintas, único gabarito, comentário, referência a dispositivo jurídico e ligação HTTPS com fonte legislativa federal oficial.

**Integridade e autoria:** não são questões oficiais FGV/OAB, CEBRASPE, VUNESP ou FCC, nem transcrições de provas. São exercícios autorais preparados no estilo das bancas a partir de legislação. Não rotular como "questões da prova", "históricas oficiais" ou "gabarito da banca". O histórico oficial do **47º EOU (80 posições, com 79 comentários jurídicos e uma questão anulada)** está em módulo distinto; exames 46º a 10º seguem catalogados, sem importação integral.

**Lógica:** as 54 questões participam do algoritmo de sorteio sem reposição já desenvolvido. As questões registradas como vistas permanecem bloqueadas por banca, inclusive em mudança de matéria ou recarregamento do mesmo navegador. Reinício manual permite reestudo.

**Fontes legislativas:** Constituição, Estatuto da Advocacia, CC, CPC, CP, CPP, CLT, CTN, CDC, ECA, LINDB, Lei 9.784/1999, Lei 14.133/2021, Lei 11.101/2005 e Lei 8.213/1991, com links individuais na base. Referências consultadas em 09/11/2026. Atualização legal contínua automática e auditoria jurisprudencial exaustiva **não estão implementadas**.

**Verificação inicial:** 22/22 testes automatizados simulados passaram, incluindo 42 sorteios distintos FGV, 4 por banca adicional, persistência de histórico, reinício apenas da banca selecionada, ausência de enunciados duplicados, gabaritos definidos e integridade do módulo OAB. Homologação visual em navegador protegido por SSO ainda pendente.

---

## Correção de repetição no Super Simulador — 09/11/2026

A questão de repetição ocorria no **Super Simulador autoral**: havia apenas 8 enunciados independentes, sendo 5 da FGV, 1 da CEBRASPE, 1 da VUNESP e 1 da FCC. O sorteio anterior excluía apenas a questão imediatamente anterior, causando repetição rápida.

**Comportamento corrigido:**
- A seleção de enunciados é feita **sem reposição**; a questão exibida é registrada como vista.
- O histórico de questões vistas é salvo em `localStorage` por banca, compartilhado entre seus filtros de disciplina. A troca de banca, o filtro e a atualização da página não reiniciam o histórico.
- Quando não há mais inéditas no filtro, o aplicativo exibe **BANCO CONCLUÍDO**. O botão "Próxima questão" fica desabilitado; não há repetição automática após completar o ciclo.
- "Reiniciar questões desta banca" limpa apenas o histórico da banca selecionada, por ação expressa do aluno; as estatísticas acumuladas de acertos e erros não são apagadas.
- Foi retirado o reinício automático do placar a cada 30 respostas.
- O app mostra contagem de questões vistas e inéditas por filtro. A navegação para outra matéria pode apresentar banco esgotado quando todas as questões daquela matéria já foram vistas.
- O módulo oficial do 47º EOU (80 registros, quatro cadernos e gabaritos) **é separado** do Super Simulador e mantém sua folha de respostas sem alterações.

**Limitações:** O bloqueio de repetição não cria novas questões. As outras bancas continuam com uma questão autoral, e a FGV com cinco, até ampliação de conteúdo. Como o histórico está no navegador, seu uso em outros aparelhos/perfis não é sincronizado. Não houve homologação visual E2E sob autenticação SSO. Foram aprovados 22 testes simulados em 09/11/2026, incluindo exaustão, ausência de repetição, armazenamento, reinício explícito, mudança de filtro e pontuação.

---

## Conclusão editorial do 47º EOU — 09/11/2026 — Questões 61–80

**Banco completo para o 47º Exame na plataforma RatioJuris:** são 80 registros por caderno, sendo **79 comentários autorais individualizados e 1 questão oficialmente anulada** (nº 47 do Tipo 1; equivalentes nº 48 no Tipo 2, nº 49 no Tipo 3 e nº 50 no Tipo 4). Os enunciados e alternativas integrais continuam disponíveis nos **PDFs oficiais da OAB/FGV**, não são reproduzidos integralmente no código.

### Lote incorporado 61–80

- **Penal, 61–62:** limite da medida de segurança com base na **Súmula 527/STJ**; distinção entre calúnia e injúria (CP, arts. 138 e 140)
- **Processo Penal, 63–68:** perda de metade da fiança quebrada (CPP, arts. 341 e 343); competência federal (CF, art. 109); ação penal pública (CPP, arts. 24/29); embargos infringentes (CPP, art. 609, parágrafo único); ANPP (CPP, art. 28-A); comunhão da prova
- **Previdenciário, 69–70:** acidente de qualquer natureza e dispensa de carência no benefício por incapacidade temporária (Lei 8.213, art. 26, II); RGPS obrigatório por atividade remunerada concomitante ao cargo público com RPPS (Lei 8.213, art. 12, § 1º)
- **Trabalho, 71–75:** banco de horas individual escrito até seis meses (CLT, art. 59, § 5º); equiparação (art. 461); proteção da gestante (CLT, art. 391-A/ADCT 10 II b e Súmula 244/TST); descontos (art. 462, § 1º); suspensão superior a trinta dias (art. 474)
- **Processo do Trabalho, 76–80:** homologação extrajudicial (CLT, arts. 855-B a 855-E); competência da JT (CF, art. 114); preparo recursal (CLT, arts. 789 e 899, sujeito aos limites atualizados); recurso adesivo (Súmula 283/TST); ação de cumprimento (CLT, art. 872, parágrafo único)

### Verificação, limites e governança

- **Gabarito histórico imutável:** confrontado com a folha definitiva da OAB/FGV de 23/09/2026 e com a tabela de correspondência Tipo 1–4
- **Precedentes identificados:** 13 questões com pelo menos um vínculo documental; isso não significa revisão exaustiva ou confirmação de ausência de alteração posterior
- **Revisão de legislação:** fundamentos comparados às compilações oficiais disponíveis em 09/11/2026, com notas específicas para possíveis alterações posteriores às provas
- **Os exames 46º a 10º** continuam apenas **catalogados** com fontes externas — não foram importados nem revisados como questões integrais
- **A plataforma não possui monitoramento de atualização legislativa automática**, validação visual E2E completa nem homologação editorial por advogado identificado
- **Retorno de usuário:** manter aviso de que a referência legal e jurisprudencial é material educacional e não substitui análise individual do ordenamento

### Fontes

- Caderno Tipo 1: https://s.oab.org.br/arquivos/2026/09/7d502f11-d906-4378-bd43-27e0c854b981.pdf
- Gabarito definitivo e correlação entre cadernos: https://s.oab.org.br/arquivos/2026/09/572dc8e2-78a0-4e37-b6de-20709e2c59ab.pdf
- Súmula 527/STJ: https://scon.stj.jus.br/SCON/sumstj/toc.jsp?livre=%40num%3D527
- Lei 8.213/91 compilada: https://www2.camara.leg.br/legin/fed/lei/1991/lei-8213-24-julho-1991-363650-normaatualizada-pl.html
- CLT compilada: https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm
- Código de Processo Penal: https://www.planalto.gov.br/ccivil_03/decreto-lei/del3689.htm

---

## Revisão jurídico-editorial — 09/11/2026 — Questões 41–60

A base do **47º EOU** agora possui **60 registros**: 59 comentários com fundamentos jurídicos/doutrinários e a questão 47 (Tipo 1) identificada como **ANULADA**. Os quatro cadernos são relacionados pela correspondência oficial; o gabarito definitivo histórico não é alterado.

### Áreas incorporadas nesta etapa

- Direito Civil (41–42): uso não autorizado de imagem e Súmula 403/STJ; multiparentalidade e Tema 622/STF
- ECA (43–44): convivência de criança com genitor privado de liberdade; impossibilidade de reparar o dano (arts. 19, §4º, e 116)
- Consumidor (45–46): boa-fé/adimplemento substancial, sujeito a pressupostos; vício de quantidade (art. 19 CDC)
- Empresarial (47–50): questão 47 anulada; sociedade simples; transformação de sociedade e renúncia à retirada; juros na falência
- Processo Civil (51–56): prova possessória, parcelamento inadequado no cumprimento de sentença, consignação, preparo de recurso do advogado, ação declaratória e cumprimento por cálculos
- Penal (57–60): escusa absolutória, arrependimento posterior, incomunicabilidade da reincidência e substituição de pena

### Alterações legislativas recentes verificadas

- **Lei 15.397/2026** modificou penas patrimoniais e a disciplina do furto no Código Penal, relevante para ler os itens 57 e 59 em sua redação vigente. Ela não revogou as regras da escusa absolutória e do concurso de pessoas analisadas aqui.
- **Lei 15.450/2026** prevê modificação futura do ECA, art. 14, com vigência 180 dias após a publicação. Em **09/11/2026** a alteração ainda não está vigente, e não interfere nas regras dos arts. 19, §4º, e 116 usadas nos itens 43 e 44.
- O **CPC compilado** deve ser consultado em sua versão atual, especialmente arts. 99, 509, 561 e 916; não alterar o gabarito histórico sem comunicado oficial da banca.

### Limitações

- Os registros não reproduzem os enunciados integrais da FGV: consultar o PDF oficial.
- Os links para STJ, STF e legislação incluem precedentes selecionados; **não há homologação de revisão jurisprudencial exaustiva**.
- A questão 47 é identificada como anulada, **sem explicação de uma alternativa correta inexistente**.
- Restam as questões **61 a 80** do 47º EOU; os 46º–10º continuam catalogados sem correção local completa.
- Testes de interface em browser autenticado e acessibilidade pública continuam pendentes.

---

## Avanço: questões 21–40 do 47º EOU (09/11/2026)

- **40/80 comentários históricos**: os comentários novos cobrem Direito Internacional (21–22), Financeiro (23–24), Tributário (25–29), Administrativo (30–34), Ambiental (35–36) e Civil/LGPD (37–40).
- **Conferência de gabarito**: cada uma das 40 respostas do Tipo 1 coincide com o gabarito definitivo da OAB; a correspondência de numeração para os quatro tipos deve ser testada antes de publicar.
- **Tema 1.348/STF (Q26)**: decisão de mérito em 19/10/2026, posterior à prova, sobre ITBI e integralização de capital; conferir novas publicações e o eventual inteiro teor do acórdão.
- **Lei 15.190/2025 (Q35)**: Lei Geral do Licenciamento Ambiental, alterada pela Lei 15.300/2025; a questão histórica de EIA está marcada como **sensível a mudanças normativas**; manter distinção entre resposta de prova e enquadramento jurídico atual.
- **Precedentes específicos relacionados**: Q26 STF Temas 796 e 1.348; Q35 STF ADI 1086 e ADI 6618; Q36 STF RE 548181; Q37 STJ Súmula 596. Os links identificam a fonte e o alcance do precedente; não se afirma revisão jurisprudencial exaustiva de todos os itens.
- **Status**: 40 questões faltantes (41–80); arquivos dos exames 46º–10º continuam catalogados, sem revisão completa.
- **Direitos autorais**: enunciados da OAB não foram copiados para o código. O usuário deve consultar o PDF oficial.

Os campos `situacao`, `revisaoJurisprudencia` e `observacoes` comunicam ressalvas específicas. Atualização jurídica automática contínua **não implementada**.

---

## Avanço de revisão: 9 de novembro de 2026

Foram acrescentadas **20 notas autorais fundamentadas** para o 47º Exame (Tipo 1, questões 1–20), com correspondência aos Tipos 2–4, sem republicar os enunciados completos. Os gabaritos definitivos históricos são preservados. Questões 1–8: Ética; 9–10: Filosofia; 11–16: Constitucional; 17–18: Direitos Humanos; 19–20: Eleitoral.

- **Revisão de base legal ou doutrinária:** 20/80, com referência específica e data.
- **Jurisprudência:** 2 precedentes relacionados e documentados (STF ADPF 130, caráter ilustrativo da Q13; TSE AgR-REspe 35932, prazo para representação da Q20). Isso **não** corresponde a uma revisão jurisprudencial exaustiva.
- **Questões restantes do 47º:** 60/80 ainda aguardam comentário individual.
- **Exames 46º ao 10º:** catalogados com links oficiais, sem importação individual.
- **Bancas CEBRASPE, VUNESP e FCC:** apenas questões autorais iniciais, sem corpus oficial completo.
- **Controle editorial:** `oab47-comentarios.js` guarda gabarito histórico, artigo, comentário, fonte, situação de revisão e precedentes quando verificados.

Os testes automatizados simulam a interface e o mapeamento; não substituem homologação em navegador ou revisão jurídica por profissional habilitado.

---

# RatioJuris — Política de integridade do banco jurídico

Atualizado em: **09/11/2026**. O conteúdo a seguir documenta o **estado efetivamente implantado**, não uma validação jurídica concluída.

## Situação por acervo

| Categoria | Estado | Tratamento |
|---|---|---|
| FGV/OAB 47º, 1ª fase | Quatro gabaritos definitivos (80 posições cada), correspondência entre tipos e anuladas validados contra o PDF oficial | Disponível para corrigir respostas com o caderno oficial aberto |
| FGV/OAB 46º a 10º | 37 páginas históricas oficiais catalogadas | Referência externa; questões e gabaritos ainda não transcritos para correção interna |
| FGV — treino autoral | 5 questões com artigos e links de consulta | Não são questões oficiais |
| CEBRASPE — treino autoral | 1 item de CERTO/ERRADO com fundamento constitucional | Não é questão oficial |
| VUNESP — treino autoral | 1 questão de múltipla escolha sobre CC 366 | Não é questão oficial |
| FCC — treino autoral | 1 questão de múltipla escolha sobre Súmula 473/STF | Não é questão oficial |

**Não equiparar** posição no gabarito a questão completa comentada.

## Fonte primária: 47º Exame

- Portal de arquivo FGV: https://oab.fgv.br/home.aspx?key=650
- Gabarito definitivo (todos os tipos e tabela de correspondência): https://s.oab.org.br/arquivos/2026/09/572dc8e2-78a0-4e37-b6de-20709e2c59ab.pdf
- OAB: comunicado de anulação da Q47 da prova Tipo 1, equivalentes Q48/T2, Q49/T3, Q50/T4: https://www.oab.org.br/util/print/64629?print=Noticia
- Provas oficiais são referenciadas em oab-data.js. Respeitar direitos autorais antes de importar textos integrais.

## Padrão mínimo para um registro de questão comentada

**Não publicar como atualizada** antes de preencher e validar, por questão:

```json
{
  "exam": 47,
  "board": "FGV",
  "booklet": 1,
  "questionNumber": 1,
  "canonicalQuestionId": "OAB47-1",
  "officialQuestionPdf": "URL comprovada em fonte oficial",
  "historicalAnswer": "A",
  "historicalAnswerStatus": "DEFINITIVO|ANULADA",
  "discipline": "Ética Profissional",
  "questionTextLicense": "direito de reprodução verificado",
  "legalGrounds": [
    {
      "article": "dispositivo específico",
      "officialUrl": "URL oficial",
      "versionCheckedAt": null
    }
  ],
  "caseLaw": [
    {
      "court": "STF|STJ|TST|TSE",
      "precedentId": "identificador do julgado",
      "officialUrl": "URL específica",
      "judgmentDate": null,
      "statusAsOfReview": "PENDENTE"
    }
  ],
  "historicalVsCurrentComment": null,
  "lastLegalReviewAt": null,
  "reviewer": null,
  "reviewStatus": "PENDENTE"
}
```

## Portais prioritários

- Legislação e consolidações: https://www.planalto.gov.br/ccivil_03/
- Jurisprudência STF: https://jurisprudencia.stf.jus.br/
- Jurisprudência STJ: https://scon.stj.jus.br/SCON/
- Tribunal Superior Eleitoral: https://www.tse.jus.br/jurisprudencia
- Tribunal Superior do Trabalho: https://www.tst.jus.br/jurisprudencia
- Legislação e provimentos OAB: https://www.oab.org.br/

## Regras de revisão

1. Preservar o gabarito histórico definitivo, inclusive anulações; não substituí-lo por entendimento atual sem aviso.
2. Comparar a data do exame à lei vigente então e à lei atualmente consolidada.
3. Procurar decisões posteriores, temas repetitivos, repercussão geral e eventuais overrulings; incluir número do processo e link para inteiro teor, quando cabível.
4. Classificar cada questão como **vigente**, **alterada**, **superada**, **anulada** ou **pendente**; registrar autoria da revisão e data.
5. Em caso de mudança normativa ou jurisprudencial, separar expressamente "**gabarito da época**" de "**entendimento atual**".
6. Revisões periódicas e gatilhos por alteração legislativa são recomendados, mas **não há mecanismo de atualização jurídica automática implementado**.
7. Nunca usar perguntas copiadas, metadados fictícios, links genéricos de jurisprudência como se fossem julgados específicos ou nomes de bancas como falsa autoria.

## Próximo lote de importação

Priorização: 47º (revisões individuais de 80 itens e direitos de uso dos cadernos) → 46º → 45º → ... → 10º. Para as bancas CEBRASPE, VUNESP e FCC, selecionar cadernos reais de concursos jurídicos, confirmar edital, banca e gabarito definitivo, antes de incorporá-los como **questões oficiais**.

A revisão individual de todas as questões históricas **ainda não foi realizada**. O catálogo de links oficiais não corresponde a um acervo completo de questões revisadas.
