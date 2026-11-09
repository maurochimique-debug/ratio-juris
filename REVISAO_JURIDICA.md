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
