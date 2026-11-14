# RATIO JURIS — Controle de acesso por assinatura (requisito para lançamento)

**Estado:** especificação aprovada como direção de produto; NÃO ativar bloqueio no site de demonstração até a homologação de cadastro, cobrança, recuperação e administração.

## Experiência do usuário
1. Em cada nova sessão de uso, solicitar autenticação (e-mail e senha ou método seguro equivalente); não solicitar CPF ou dados pessoais desnecessários apenas para entrar.
2. Cadastro individual com nome, e-mail validado, senha forte, aceite dos termos e política de privacidade. Recuperação de senha disponível.
3. Após autenticar, consultar no **servidor** o plano, período de vigência e estado da assinatura.
4. Somente `active` ou `trialing` autorizado pelo plano permite acessar simulador, banco de questões, IA e recursos premium. `pending`, `expired`, `canceled`, `past_due` e ausência de plano exibem contratação ou renovação, não liberam funções pagas.
5. Contas administrativas possuem permissão distinta e auditável, sem criar isenção universal.
6. Não bloquear recuperação de senha, cadastro, termos, política de privacidade, contratação, autenticação e atendimento ao usuário.
7. Pagamento deve ser confirmado por webhook assinado do provedor, com tratamento idempotente; nunca ativar o plano por redirect do navegador ou callback não autenticado.
8. Renovação, cancelamento, estorno e chargeback devem atualizar a autorização no servidor.
9. Autorizar cada endpoint de conteúdo protegido e de IA no backend. **Apenas esconder cards no HTML não protege PDFs, gabaritos, URLs públicas ou scripts estáticos.** Migrar ativos proprietários para backend autorizado; cadernos oficiais públicos continuam acessíveis em seus portais de origem e não podem ser tratados como exclusivos.
10. Limitar sessões simultâneas e aplicar controles contra compartilhamento de conta, com revogação de sessões e auditoria, sem prometer prevenção absoluta de prints ou redistribuição.

## Modelo de dados sugerido
- `rj_profiles`: user_id (UUID autenticado), nome, criado_em.
- `rj_plans`: id, nome, preço, moeda, periodicidade, permissões, ativo.
- `rj_subscriptions`: id, user_id, plan_id, status, inicio, validade, provider, provider_subscription_id, atualizado_em.
- `rj_payment_events`: provider, event_id único, assinatura, tipo, processado_em; impedir repetição de webhook.
- `rj_access_audit`: user_id, operação, resultado, data; mínimo necessário e retenção definida.
- Proteção com RLS em todas as tabelas expostas. Autorização e papéis administrativos no backend, não em metadados editáveis pelo usuário.

## Situação encontrada em 14/11/2026
- `ratio-auth.js` é sessão piloto de IA, em memória. NÃO cobre o restante do simulador.
- `/api/assistente-juridico` já possui autenticação de piloto, mas não é um sistema de assinatura comercial completo.
- A página oferece **planos propostos** de R$ 99/mês e R$ 370/ano, com compra desabilitada. Valores não devem ser ativados sem aprovação comercial final.
- Nenhuma cobrança automática deve ser criada nesta fase.
- A única conexão Supabase listada nesta conversa pertence a `language-learning-platform`; não utilizar no RATIO JURIS.

## Critérios de homologação antes de habilitar paywall
- Testar cadastro, confirmação de e-mail, login, logout, esquecimento de senha, expiração da sessão.
- Testar pagamento aceito, pendente, recusado, duplicado, estorno, cancelamento e renovação.
- Testar acesso direto a todas as rotas da API, PDFs e dados com sessão ausente, inválida e expirada.
- Testar permissões de planos distintos, administração e isolamento entre usuários.
- Testar Android, tablet e desktop sem comprometer leitura acessível.
- Verificar LGPD, política de privacidade, termos, suporte, logs, retenção e exclusão.
- **Só então** publicar a ativação da exigência de assinatura em produção, após plano de reversão.

## Condição de conclusão
Login obrigatório + plano vigente + servidor verificando autorização em toda ação protegida. Nenhum usuário sem plano contratado deve conseguir usar as ferramentas premium.
