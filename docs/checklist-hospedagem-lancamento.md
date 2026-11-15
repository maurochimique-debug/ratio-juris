# RATIO JURIS — Checklist de hospedagem e lançamento comercial

Auditoria do ambiente em 15/11/2026. Documento operacional, não representa homologação final.

## Ambiente auditado
- Projeto de produção Vercel: `ratio_juris`.
- Git conectado: `maurochimique-debug/ratio-juris`, branch `main`.
- Endereço existente e verificado: https://ratiojuris.vercel.app/
- Domínio personalizado: **não configurado**; dependerá da escolha e comprovação de controle do domínio.
- Último deploy consultado: `24227a92299920a63b04f15744df994ccd209160`, estado READY.
- Proteção do projeto: SSO habilitado para `all_except_custom_domains`. Confirmar publicamente o acesso aos endereços relevantes em cada ambiente antes da homologação.
- Erros de runtime no painel da Vercel nas últimas 24 h: não identificados no relatório consultado (isso não equivale a teste fim a fim).
- `vercel.json` possui redirecionamentos de rotas legadas e cabeçalhos `X-Content-Type-Options` e `Referrer-Policy`.
- Ícone e manifest PWA cadastrados; validar instalação no Android em aparelho real.

## Etapa A — estabilização técnica
- [x] Manter deploys automatizados via Git para produção.
- [x] Domínio Vercel verificado.
- [x] Cabeçalhos básicos `nosniff` e `Referrer-Policy`.
- [ ] Validar abertura pública sem autenticação da Vercel no domínio que será divulgado.
- [ ] Executar smoke test Android, tablet e desktop após cada mudança: login piloto, simulador, PDFs, artigos, ConJur.
- [ ] Confirmar automações GitHub Actions efetivamente executadas (não apenas existência dos arquivos).
- [ ] Inspecionar falhas de recuperação legislativa, verificando respostas 429/502/504 e disponibilidade das fontes; nunca inventar artigos.
- [ ] Confirmar acessibilidade, leitura assistida e persistência das estatísticas.
- [ ] Documentar backup, recuperação e rollback do deploy de produção.
- [ ] Definir monitoramento externo de disponibilidade, alertas e política de logs sem dados sensíveis.

## Etapa B — domínio e marca
- [ ] Escolher e validar domínio próprio.
- [ ] Comprovar controle/posse e configurar DNS + certificado TLS via Vercel.
- [ ] Configurar domínio canônico e redirecionamento de URLs legadas, evitando alterar o domínio Vercel antes da validação.
- [ ] Validar HTTPS, links internos e externos, manifest PWA, favicon, compartilhamento e indexação.
- [ ] Publicar páginas de Termos de Uso, Política de Privacidade, Contato e informações de titularidade adequadas à LGPD.

## Etapa C — autenticação e assinatura
- [ ] Criar e associar provedor/backend dedicado ao RATIO JURIS; não reutilizar o Supabase de outros projetos.
- [ ] Cadastrar usuários com confirmação de e-mail, recuperação de senha, limite de sessões e logs auditáveis.
- [ ] Configurar planos e valores **somente após aprovação comercial**.
- [ ] Integrar checkout com provedor escolhido, webhooks assinados, eventos idempotentes e tratamento de estornos.
- [ ] Implementar autorização do lado do servidor para cada endpoint e ativo protegido, sem confiar em esconder botões.
- [ ] Testar login, logout, expiração, plano vigente, vencido, recusado, cancelado, renovação, estorno e conta administrativa.
- [ ] Preparar plano de reversão e suporte ao cliente, com retenção/exclusão LGPD.
- [ ] **Não ativar paywall** antes da homologação de ponta a ponta.

## Etapa D — lançamento
- [ ] Congelar versão, rodar testes e revisar conteúdo jurídico/licenças dos documentos oficiais.
- [ ] Publicar no domínio definitivo apenas após validação de acesso e aceitação final.
- [ ] Monitorar erros, disponibilidade, pagamentos e atendimento após ativação.

## Regra de preservação
Alterações de hospedagem não devem modificar o layout e a experiência Android aprovados. Não prometer 100% de recuperação de textos legislativos sem monitoramento efetivo das fontes oficiais.
