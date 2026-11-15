# Entre Nós

App de casais (PT/ES): app nativo Expo para iOS e Android, servidor próprio como API tipada (ADRs 0011, 0014).

- `apps/mobile` — o app (Expo, expo-router); fala com o servidor pelo cliente oRPC tipado
- `apps/server` — o servidor: Hono + oRPC em `/api/v1`, `/health`, Postgres via Drizzle
- `packages/contracts` — contratos da API (zod + oRPC), compartilhados por app e servidor
- `packages/i18n` — dicionário PT/ES e escolha do idioma inicial

Servidor: copie `.env.example` para `.env`, preencha, e rode `docker compose up -d`
(ou `pnpm db:migrate` e `pnpm --filter @entre-nos/server dev` com o Postgres de pé).

App: `EXPO_PUBLIC_SERVER_URL=http://<ip-do-servidor-na-rede>:3000 pnpm --filter @entre-nos/mobile ios`
(ou `android`). `EXPO_PUBLIC_SERVER_URL` é o endereço do servidor que o app usa.

Checagens: `pnpm lint && pnpm typecheck && pnpm test` (`pnpm test:db` precisa do Postgres).
