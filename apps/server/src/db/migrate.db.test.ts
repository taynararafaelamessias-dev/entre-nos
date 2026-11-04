import { randomBytes } from 'node:crypto';
import { readdirSync } from 'node:fs';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ensureAppRole } from './app-role.ts';
import { migrationsFolder, runMigrations } from './migrate.ts';

const baseUrl = process.env.MIGRATION_DATABASE_URL;
if (!baseUrl) {
  throw new Error(
    'MIGRATION_DATABASE_URL não definida: suba o banco (docker compose up -d --wait db) e exporte as variáveis do .env.',
  );
}

const hex = (n: number) => randomBytes(n).toString('hex');

const dbName = `entre_nos_test_${hex(6)}`;
const urlFor = (user?: { name: string; password: string }) => {
  const url = new URL(baseUrl);
  url.pathname = `/${dbName}`;
  if (user) {
    url.username = user.name;
    url.password = user.password;
  }
  return url.toString();
};
const testUrl = urlFor();

const admin = postgres(baseUrl, { max: 1, onnotice: () => {} });
const appRole = `entre_nos_app_t_${hex(6)}`;

async function withSql<T>(url: string, fn: (sql: postgres.Sql) => Promise<T>): Promise<T> {
  const sql = postgres(url, { max: 1, onnotice: () => {} });
  try {
    return await fn(sql);
  } finally {
    await sql.end();
  }
}

async function historyCount(): Promise<number> {
  return withSql(testUrl, async (sql) => {
    const rows = await sql<{ n: number }[]>`select count(*)::int as n from drizzle.__drizzle_migrations`;
    return rows[0]?.n ?? -1;
  });
}

async function tableList(): Promise<string[]> {
  return withSql(testUrl, async (sql) => {
    const rows = await sql<{ t: string }[]>`
      select table_schema || '.' || table_name as t
      from information_schema.tables
      where table_schema not in ('pg_catalog', 'information_schema')
      order by 1`;
    return rows.map((r) => r.t);
  });
}

beforeAll(async () => {
  await admin.unsafe(`create database "${dbName}"`);
});

afterAll(async () => {
  const [exists] = await admin`select 1 from pg_roles where rolname = ${appRole}`;
  if (exists) {
    await withSql(testUrl, (sql) => sql.unsafe(`drop owned by "${appRole}"`).then(() => undefined));
  }
  await admin.unsafe(`drop database if exists "${dbName}" with (force)`);
  await admin.unsafe(`drop role if exists "${appRole}"`);
  await admin.end();
});

describe('runMigrations', () => {
  it('aplica as migrations e é idempotente', async () => {
    const files = readdirSync(migrationsFolder).filter((f) => f.endsWith('.sql')).length;
    expect(files).toBeGreaterThan(0);

    await runMigrations(testUrl);
    expect(await historyCount()).toBe(files);
    const tablesAfterFirst = await tableList();

    await runMigrations(testUrl);
    expect(await historyCount()).toBe(files);
    expect(await tableList()).toEqual(tablesAfterFirst);
  });
});

describe('ensureAppRole', () => {
  it('cria um papel sem superuser nem bypass de RLS, que não cria nem possui tabelas, e é idempotente', async () => {
    const firstPassword = hex(24);
    const password = hex(24);

    await withSql(testUrl, async (sql) => {
      // uma tabela que já existe antes do papel, e outra criada depois (default privileges)
      await sql`create table public.antes (id int)`;
      await ensureAppRole(sql, { role: appRole, password: firstPassword });
      await ensureAppRole(sql, { role: appRole, password });
      await sql`create table public.depois (id int)`;
    });

    const attrs = await admin<{ rolsuper: boolean; rolbypassrls: boolean; rolcreatedb: boolean; rolcreaterole: boolean; rolcanlogin: boolean }[]>`
      select rolsuper, rolbypassrls, rolcreatedb, rolcreaterole, rolcanlogin
      from pg_roles where rolname = ${appRole}`;
    expect(attrs).toEqual([
      { rolsuper: false, rolbypassrls: false, rolcreatedb: false, rolcreaterole: false, rolcanlogin: true },
    ]);

    await withSql(urlFor({ name: appRole, password }), async (sql) => {
      const [me] = await sql<{ rolsuper: boolean; rolbypassrls: boolean }[]>`
        select rolsuper, rolbypassrls from pg_roles where rolname = current_user`;
      expect(me).toEqual({ rolsuper: false, rolbypassrls: false });

      await expect(sql`create table public.x ()`).rejects.toThrow(/permission denied/);

      await sql`insert into public.antes values (1)`;
      await sql`insert into public.depois values (2)`;
      const rows = await sql<{ n: number }[]>`
        select (select count(*) from public.antes)::int + (select count(*) from public.depois)::int as n`;
      expect(rows[0]?.n).toBe(2);

      const owned = await sql<{ n: number }[]>`
        select count(*)::int as n from pg_class c
        join pg_roles r on r.oid = c.relowner where r.rolname = current_user`;
      expect(owned[0]?.n).toBe(0);
    });

    // a senha antiga deixou de valer
    await expect(
      withSql(urlFor({ name: appRole, password: firstPassword }), (sql) => sql`select 1`),
    ).rejects.toThrow(/password authentication failed/);
  });
});
