import postgres from 'postgres';
import { ensureAppRole } from './app-role.ts';
import { requireEnv } from './env.ts';
import { runMigrations } from './migrate.ts';

// Roda com o dono do banco: aplica as migrations e garante o papel sem bypass de RLS com que
// o app conecta (ADR 0005). O app nunca recebe estas credenciais.
const url = requireEnv('MIGRATION_DATABASE_URL');
const appPassword = requireEnv('APP_DB_PASSWORD');

await runMigrations(url);

const sql = postgres(url, { max: 1, onnotice: () => {} });
try {
  await ensureAppRole(sql, { role: 'entre_nos_app', password: appPassword });
  const rows = await sql<{ n: number }[]>`select count(*)::int as n from drizzle.__drizzle_migrations`;
  console.log(`migrations no histórico: ${rows[0]?.n}`);
} finally {
  await sql.end();
}
