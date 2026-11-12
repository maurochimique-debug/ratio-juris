# Auditoria de correspondência entre questões OAB e outras bancas

Status: **sem correspondências homologadas**. Não declarar que uma questão OAB caiu em CEBRASPE, FCC ou VUNESP sem comparação documental verificada.

## Processo de cruzamento
1. Importar PDFs oficiais da OAB e provas/gabaritos de CEBRASPE, FCC, VUNESP, quando a origem e os direitos de uso permitirem. Registrar banca, concurso, órgão, ano, edição, tipo de caderno, nº da questão, URL, hash SHA-256 do arquivo e versão do gabarito.
2. Extrair enunciado e alternativas com rastreabilidade de página; em extração duvidosa, exigir conferência humana do PDF oficial.
3. Padronizar espaços, acentuação e diferenças de layout somente para indexação; preservar a transcrição integral original, pois a troca de uma palavra jurídica pode alterar a resposta.
4. Detectar candidatas a coincidência exata por hash de texto canônico; detectar semelhantes por análise textual e de conceitos, com limiar configurável.
5. Classificar, por revisão humana e referências documentais: (a) idêntica; (b) essencialmente semelhante; (c) mesmo tema/dispositivo legal, mas questão distinta; (d) sem relação demonstrada.
6. Auditar cada correspondência usando enlaces aos dois PDFs, páginas, números, correções, artigos aplicáveis e revisão datada.
7. Publicar cards somente após aprovação: «Esta questão aborda matéria também cobrada na prova X», nunca «esta questão caiu na banca Y» sem identidade comprovada.

## Modelo de registro de verificação
- origem_questao_oab, origem_questao_banca, classificacao, justificativa, hashes, urls, paginas, verificador, verificado_em, publicado
- Não expor gabarito de outra banca como gabarito OAB.
- Não preencher com perguntas/alternativas inventadas ou com conteúdo de material protegido sem autorização.
- Primeira etapa recomendada: indexar cadernos e gabaritos de CEBRASPE, FCC e VUNESP, que estão apenas referenciados documentalmente na aplicação atual.

## Observação atual
Os cards de outras bancas atualmente exibem documentos para consulta, sem enunciados e gabaritos individualmente auditados para permitir treino eletrônico. A ausência de botões de respostas nesses cards é uma limitação real do acervo, não mero defeito visual.