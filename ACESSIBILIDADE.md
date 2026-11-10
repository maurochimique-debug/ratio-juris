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
