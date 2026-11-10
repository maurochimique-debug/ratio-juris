## 40º EOU — navegação acessível e pontuação (10/11/2026)

O 40º Exame fica disponível no simulador oficial com navegação por questões, marcação de respostas e leitura do resultado por voz. **Duas questões anuladas por caderno** rendem pontuação automática: Tipo 1 Q5/Q46; Tipo 2 Q7/Q45; Tipo 3 Q6/Q45; Tipo 4 Q2/Q46. O link para o comunicado de anulação de maio aparece ao lado do PDF de gabarito definitivo de abril. O leitor local de PDF mantém suas limitações técnicas já documentadas.

## 41º Exame e acessibilidade (10/11/2026)

A navegação pelo **41º Exame** utiliza o mesmo simulador oficial acessível dos 42º–47º. O caderno e o gabarito definitivo são vinculados por tipo de prova; o histórico e as estatísticas ficam armazenados separadamente para evitar conflito entre edições. A leitura do enunciado original depende de extração do PDF oficial escolhido pelo aluno (não há texto inventado no código).

# Atualização — simulador de prova oficial acessível (10/11/2026)

Esta versão oferece controles A–D por teclado, navegação anterior/próxima e escolha direta de questão numerada com rótulos acessíveis. O usuário pode abrir o PDF oficial e selecionar uma cópia no dispositivo para tentar extrair texto por página, localizar a questão e **ouvir seu texto em pt-BR**. Nenhuma alternativa original é inventada. O leitor opera no dispositivo via PDF.js 6.4.299 carregado por CDN; não transmite o arquivo a servidor de prova nem mantém o texto em armazenamento persistente.

A voz sintetizada foi dividida em blocos curtos para reduzir interrupções em dispositivos móveis. A pessoa pode parar ou pausar a leitura. OCR de páginas só em imagem, transcrição de áudio e tradução em Libras ainda não foram implementados. A validação com NVDA/TalkBack/VoiceOver e navegadores reais permanece pendente.

Testes automatizados: **172 de integração DOM e 14 do PDF local com módulo simulado**, sem substituir homologação visual acessível.

---

# RatioJuris — Recursos de acessibilidade

Versão implementada: **10 de novembro de 2026**.

## Escopo efetivamente desenvolvido

### 1. Apoio para baixa visão e cegueira

- Botão **Acessibilidade** visível no cabeçalho, inclusive em dispositivos móveis (ícone com nome acessível a leitores de tela).
- Painel operável por teclado, com `aria-controls`, `aria-expanded`, foco no painel ao abrir, retorno do foco ao botão ao fechar e fechamento pela tecla **Esc**.
- Link **Pular para as provas oficiais** exibido ao receber foco pelo teclado.
- Sinalização de foco com contorno perceptível e respeito à configuração do sistema para redução de movimento.
- Ajuste manual do texto entre **100%, 125% e 150%**, com preferência salva localmente.
- Alternância de **alto contraste**, com preferência salva localmente. Não afirmar conformidade universal de contraste sem inspeção visual de todas as telas.
- Opções para ouvir **progresso/resultado da folha da OAB (46º ou 47º)**, usando a API de síntese de voz **do navegador**, com velocidade ajustável, pausa, retomada e interrupção.
- Avisos de status em área `role=status`/`aria-live=polite`, e rótulos acessíveis para a folha de respostas dos exames oficiais.

### 2. Comunicação alternativa para pessoas com dificuldade de fala

- Quatro frases editáveis prontas: pedir ajuda, solicitar repetição, responder por escrito e pedir mais tempo.
- Campo editável para compor mensagens sem necessidade de fala ou de microfone.
- Reprodução opcional do texto por síntese de voz do dispositivo.
- A mensagem **não é enviada para um servidor**, e o áudio **não é iniciado automaticamente**. Mensagens não são salvas no armazenamento persistente.
- Se a síntese de voz não estiver disponível, o texto permanece disponível no próprio campo.

### Compatibilidade e limites

- A voz depende das vozes instaladas e do suporte a Web Speech API; sua qualidade e disponibilidade diferem entre Chrome, Edge, Safari, Firefox e sistemas operacionais.
- Não foi instalado serviço de voz externo nem ferramenta de identificação ou monitoramento de condições de deficiência.
- Não se afirma que há transcrição ou legendas em tempo real, geração de voz por inteligência artificial, reconhecimento de voz, tradução automática para Libras, leitores Braille integrados ou conformidade WCAG 2.2 AA certificada.
- Alto contraste e fontes ampliadas precisam de teste visual e navegação com zoom até 200% em dispositivos reais.
- É necessária homologação com **NVDA no Windows, VoiceOver no iOS/macOS, TalkBack no Android**, navegação 100% por teclado e inspeção de contraste/zoom.
- Os controles foram adicionados sem alterar as respostas, os gabaritos oficiais do 46º/47º Exame, o banco autoral ou o bloqueio de repetição.
- O projeto Vercel permanece com **proteção SSO**, portanto testes E2E em produção podem exigir autenticação.

### Verificações já executadas

**25 de 25 testes simulados** (22 controles gerais e 3 testes da leitura da OAB), incluindo painel aberto/fechado, Esc e retorno de foco, leitura TTS, leitura de alternativas e explicação, pausa/retomada/parada, seleção de frases de comunicação, funcionamento sem TTS e persistência de contraste/fonte. Esses testes verificam lógica DOM em ambiente simulado e **não substituem** homologação em navegador e por usuários de tecnologias assistivas.

Referência: **W3C Web Content Accessibility Guidelines (WCAG) 2.2**, https://www.w3.org/TR/WCAG22/ .

## Política de questões exclusivamente oficiais — 10/11/2026

O Super Simulador de questões autorais e seus dados foram retirados da interface pública. Apenas gabaritos e cadernos oficiais da OAB/FGV (46º e 47º Exames) estão importados para correção local. Os demais exames permanecem catalogados; outras bancas (CEBRASPE, VUNESP, FCC) não aparecem como portadoras de questões ainda não importadas.

A leitura de enunciados e alternativas depende do PDF oficial em seu leitor de documentos, que deve ser avaliado quanto à acessibilidade. O próprio RatioJuris pode ler o progresso e o resultado da folha da OAB, mas não possui texto integral de enunciados no HTML. Não declarar leitura de enunciados pelo painel quando a fonte está apenas no PDF externo.

## Estatísticas acessíveis — 10/11/2026

O card do resultado possui rótulos e valores em texto e uma mensagem com `role=status`/`aria-live=polite`. A leitura por voz do progresso/resultado foi ajustada para o **45º, 46º e 47º Exames**. Os erros e acertos são revelados somente quando o usuário corrige a prova; as respostas em branco não são erros. Homologação com leitores de tela em ambiente real ainda pendente.

## Acesso aos resultados do 43º e 44º Exames (10/11/2026)

A leitura por voz do progresso e das estatísticas cobre agora os exames **43º, 44º, 45º, 46º e 47º** da OAB. O 43º possui duas questões anuladas por tipo, com atribuição automática de pontos. Os textos originais continuam nos PDFs da OAB/FGV, cuja acessibilidade depende do documento e do leitor usado. Testes NVDA, TalkBack e VoiceOver com tecnologia real permanecem pendentes.

## 42º EOU — leitura de resultado (10/11/2026)

O painel de acessibilidade pode ler o resultado e as estatísticas do 42º Exame, além dos 43º–47º. A questão anulada Q43/T1 (equivalentes Q44/T2, Q43/T3, Q44/T4) concede ponto automático. Os enunciados integrais permanecem no PDF oficial, dependentes do leitor de documentos.
