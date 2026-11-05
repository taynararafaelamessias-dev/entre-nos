import { readFileSync, writeFileSync } from 'node:fs';
import postgres from 'postgres';
import { ensureAppRole } from '../db/app-role.ts';
import { requireEnv } from '../db/env.ts';
import { diffSnapshots, markRestorePoint, takeSnapshot, type DbSnapshot } from './restore-check.ts';

// Roda com o dono do banco, no serviço de backup (ADR 0003): `mark` cria o ponto de
// restauração na origem e guarda o snapshot; `verify` compara o banco restaurado com ele e
// confere que o papel do app continua sem bypass de RLS (ADR 0005).
const APP_ROLE = 'entre_nos_app';
const [cmd, ...args] = process.argv.slice(2);

function usage(): never {
  console.error(
    'uso: restore-check-cli.ts mark <nome> <arquivo>   (SOURCE_DATABASE_URL)\n' +
      '     restore-check-cli.ts verify <arquivo>        (RESTORED_DATABASE_URL, APP_DB_PASSWORD)',
  );
  process.exit(2);
}

async function withSql<T>(url: string, fn: (sql: postgres.Sql) => Promise<T>): Promise<T> {
  const sql = postgres(url, { max: 1, onnotice: () => {} });
  try {
    return await fn(sql);
  } finally {
    await sql.end();
  }
}

async function mark(name: string, file: string): Promise<void> {
  const url = requireEnv('SOURCE_DATABASE_URL');
  const snapshot = await withSql(url, (sql) => markRestorePoint(sql, name));
  writeFileSync(file, JSON.stringify(snapshot));
  console.log(`ponto de restauração ${name} marcado`);
}

async function verify(file: string): Promise<number> {
  const url = requireEnv('RESTORED_DATABASE_URL');
  const password = requireEnv('APP_DB_PASSWORD');
  const source = JSON.parse(readFileSync(file, 'utf8')) as DbSnapshot;

  const restored = await withSql(url, (sql) => takeSnapshot(sql));
  const diff = diffSnapshots(source, restored);
  for (const line of diff) console.error(line);
  if (diff.length > 0) return 1;

  await withSql(url, (sql) => ensureAppRole(sql, { role: APP_ROLE, password }));
  const appUrl = new URL(url);
  appUrl.username = APP_ROLE;
  appUrl.password = password;
  const me = await withSql(appUrl.toString(), async (sql) => {
    const [row] = await sql<{ rolsuper: boolean; rolbypassrls: boolean }[]>`
      select rolsuper, rolbypassrls from pg_roles where rolname = current_user`;
    return row;
  });
  if (!me || me.rolsuper !== false || me.rolbypassrls !== false) {
    console.error(`${APP_ROLE} com superuser ou bypass de RLS no banco restaurado.`);
    return 1;
  }

  const tables = Object.keys(restored.tables).length;
  const rows = Object.values(restored.tables).reduce((a, b) => a + b, 0);
  console.log(
    `restore-check OK: ${tables} tabelas, ${rows} linhas, ${restored.policies} políticas, ${APP_ROLE} sem bypass`,
  );
  return 0;
}

if (cmd === 'mark' && args.length === 2) {
  await mark(args[0]!, args[1]!);
} else if (cmd === 'verify' && args.length === 1) {
  process.exitCode = await verify(args[0]!);
} else {
  usage();
}
