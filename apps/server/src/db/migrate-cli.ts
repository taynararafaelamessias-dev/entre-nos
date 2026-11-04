import postgres from 'postgres';
import { runMigrations } from './migrate.ts';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL não definida.');
  process.exit(1);
}

await runMigrations(url);

const sql = postgres(url, { max: 1 });
try {
  const rows = await sql<{ n: number }[]>`select count(*)::int as n from drizzle.__drizzle_migrations`;
  console.log(`migrations no histórico: ${rows[0]?.n}`);
} finally {
  await sql.end();
}
