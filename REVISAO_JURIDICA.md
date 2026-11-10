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
