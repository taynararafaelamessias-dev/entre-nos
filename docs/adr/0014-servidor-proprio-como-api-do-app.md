---
status: accepted
---
# Servidor próprio como API tipada do app, no mesmo monorepo

O backend é redesenhado em volta do app nativo, mas mantém os princípios dos ADRs 0002 e 0005:
Postgres próprio, regras de negócio num servidor TypeScript, RLS como segunda camada. Com app de
loja, versões antigas continuam nos aparelhos por meses sem atualizar, então toda regra tem que
morar no servidor, e um backend pronto (Supabase, Firebase, Convex) só trocaria esse controle por
dependência de fornecedor. O servidor deixa de servir front-end e vira a API do app. Decidido em
2026-11-15. Substitui o ADR 0004.

## Consequences
- Monorepo pnpm: `apps/mobile` (Expo), `apps/server` e, depois, `apps/gerenciador` (web interno).
  `packages/` só com o que é de fato compartilhado: contratos, i18n.
- A API é tipada de ponta a ponta a partir dos contratos compartilhados, para o app nunca chamar o
  servidor com um formato que ele não aceita. A API tem versão e convive com versões antigas do app,
  e o servidor pode exigir uma versão mínima.
- O tempo real das salas e do Conversar roda por WebSocket dentro do mesmo processo. Notificações
  push saem pelo serviço de push do Expo, com texto neutro na tela bloqueada. Arquivos ficam num
  bucket S3-compatível (R2).
- Hospedagem segue o ADR 0003: m4mini durante a construção, VPS antes do primeiro envio às lojas.
- O app guarda dados em cache no aparelho, para abrir rápido e mostrar o que já tem sem rede.
