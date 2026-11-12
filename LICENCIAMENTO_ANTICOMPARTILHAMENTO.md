# Controle de licenças pessoais — RATIO JURIS 2026
**Status: especificação preparada, não ativada em produção.**
A interface atual distribui HTML/JS estático; ocultar botão ou usar localStorage
não protege conteúdo premium. Não anunciar proteção efetiva até ativar backend.

## Fluxo de compra
1. Criar conta com e-mail verificado; opcionalmente MFA. O titular é auth.users.id, nunca um campo editável pelo navegador.
2. Checkout com identificador de conta não manipulável, pedido idempotente e duração do plano.
3. Webhook de pagamento assinado e validado pelo servidor. Só ele ativa, renova, expira ou revoga a licença. Rastrear reembolso/chargeback e eventos duplicados.
4. Cada chamada a conteúdo premium verifica no servidor a licença ativa, validade e sessão não revogada. Nunca confiar no status enviado pelo frontend.
5. Tokens curtos e renováveis; encerramento de todas as sessões em revogação confirmada.

## Política recomendada
- Licença pessoal e intransferível, vinculada ao usuário pagante.
- Permitir até dois dispositivos registrados do titular; uma sessão premium ativa por vez (limites configuráveis após testes e termos publicados).
- Novo dispositivo acima do limite: restringir apenas a nova ativação e oferecer “Gerenciar dispositivos” e revalidação por e-mail/MFA.
- Acesso simultâneo incompatível e repetido, uso sistemático de credenciais por terceiros ou confirmação documental: contestação/reauth; se comprovado compartilhamento ou fraude, revogação imediata das sessões premium e suspensão da licença.
- **Não bloquear definitivamente somente por VPN, IP, viagem, troca de celular ou erro de geolocalização.**
- Alertar o comprador, apresentar motivo compreensível, canal de contestação e opção de recuperação.
- Guardar apenas dados necessários, aplicar retenção limitada e controles de privacidade conforme LGPD.
- Vincular políticas a Termos de Uso e Política de Privacidade revisados por advogado.

## Condições para ativar
- Projeto de autenticação/banco exclusivo do RATIO JURIS, distinto da plataforma de idiomas.
- Gateway de pagamento escolhido e webhooks testados em ambiente sandbox.
- Endpoints autenticados de status, ativação, revogação, reconciliação e gerenciamento de dispositivos.
- Conteúdo premium servido somente após autorização no backend. PDFs públicos da OAB e legislação pública não devem ser erroneamente descritos como conteúdo protegido pelo licenciamento.
- Testes automatizados: compra nova, renovação, expiração, reembolso, aparelho novo, dois aparelhos legítimos, excesso de sessões, recuperação de conta, queda de conexão, replay de webhook e revogação.
- Auditoria e teste em computador, Android e iOS antes do lançamento.

## Notas de segurança
Nunca expor segredo do gateway, chave de assinatura, chaves Supabase service_role, webhook secrets ou tokens de sessão em JS estático. Assinatura verificada server-side, rate limiting e trilhas de auditoria sem registrar senhas. O SQL proposto é apenas esquema: não cria sozinho sistema de cobrança ou bloqueio.
