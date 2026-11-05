import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { createApi } from './http/api.ts';
import { createApp } from './http/app.ts';
import { createDatabase } from './db/client.ts';
import { requireEnv } from './db/env.ts';
import { createAuth } from './modules/auth/auth.ts';
import { escolherEnvio } from './modules/auth/email/enviar-email.ts';

// Conecta com o papel do app, sem bypass de RLS; as migrations rodam antes, com o dono
// (serviço `migrate` no compose, ou `pnpm db:migrate`).
const database = createDatabase(requireEnv('DATABASE_URL'));

const auth = createAuth({
  db: database.db,
  baseURL: requireEnv('APP_URL'),
  secret: requireEnv('BETTER_AUTH_SECRET'),
  enviarEmail: escolherEnvio(process.env),
});

const app = createApp({
  pingDatabase: database.ping,
  api: createApi({ auth, db: database.db }),
  webDistDir: process.env.WEB_DIST_DIR ?? fileURLToPath(new URL('../../web/dist', import.meta.url)),
});

const port = Number(process.env.PORT ?? 3000);
const server = serve({ fetch: app.fetch, port });
console.log(`servidor em :${port}`);

function shutdown() {
  server.close(() => {
    void database.close().finally(() => process.exit(0));
  });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
