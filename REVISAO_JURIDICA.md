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
