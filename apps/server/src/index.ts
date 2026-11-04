import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { createApp } from './http/app.ts';
import { createDatabase } from './db/client.ts';
import { runMigrations } from './db/migrate.ts';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL não definida.');
  process.exit(1);
}

await runMigrations(url);
const database = createDatabase(url);

const app = createApp({
  pingDatabase: database.ping,
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
