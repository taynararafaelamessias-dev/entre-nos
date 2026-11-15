---
status: accepted
---
# oRPC, contract-first, como API tipada do app

O ADR 0014 pede uma API tipada de ponta a ponta a partir dos contratos compartilhados. Escolhemos
oRPC 1.16 com contrato primeiro, e não tRPC: o tRPC tipa o cliente com `import type { AppRouter }`
vindo do servidor, e o app não pode importar o servidor. No oRPC o cliente é tipado por
`ContractRouterClient<typeof contract>`, com o contrato em `packages/contracts`. Provado num projeto
de teste (oRPC 1.16.2, TS 6.0.3, Hono 4): uma rota desconhecida e um campo errado na resposta não
compilam. Decidido em 2026-11-15.

## Versions
oRPC 1.16.2 (a 2.0 está em beta), tRPC 11.28.3, Expo SDK 58. O Expo SDK 56+ traz o `fetch` global
com streaming que o oRPC precisa. Conferido em 2026-11-15 (npm e context7).

## Consequences
- O contrato e o `API_PREFIX` moram em `packages/contracts`; o servidor o implementa em
  `apps/server/src/http/router.ts` e o app o consome só por `ApiClient`.
- `/api/v1` é a versão de API do ADR 0014: uma quebra abre `/api/v2`, e os apps antigos seguem em
  `/api/v1`.
- Toda rota declara `.input` e `.output` (`z.void()` quando não recebe nada): sem `.input`, o oRPC
  aceita qualquer entrada.
- `/health` fica fora do contrato, para o healthcheck do Docker.
- A migração para o oRPC 2 é uma decisão posterior.
