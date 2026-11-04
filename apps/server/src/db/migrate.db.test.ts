import { randomBytes } from 'node:crypto';
import { readdirSync } from 'node:fs';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { migrationsFolder, runMigrations } from './migrate.ts';

const baseUrl = process.env.DATABASE_URL;
if (!baseUrl) {
  throw new Error(
    'DATABASE_URL não definida: suba o banco (docker compose up -d --wait db) e exporte DATABASE_URL.',
  );
}

const dbName = `entre_nos_test_${randomBytes(6).toString('hex')}`;
const testUrl = (() => {
  const url = new URL(baseUrl);
  url.pathname = `/${dbName}`;
  return url.toString();
})();

const admin = postgres(baseUrl, { max: 1 });

async function historyCount(): Promise<number> {
  const sql = postgres(testUrl, { max: 1 });
  try {
    const rows = await sql<{ n: number }[]>`select count(*)::int as n from drizzle.__drizzle_migrations`;
    return rows[0]?.n ?? -1;
  } finally {
    await sql.end();
  }
}

async function tableList(): Promise<string[]> {
  const sql = postgres(testUrl, { max: 1 });
  try {
    const rows = await sql<{ t: string }[]>`
      select table_schema || '.' || table_name as t
      from information_schema.tables
      where table_schema not in ('pg_catalog', 'information_schema')
      order by 1`;
    return rows.map((r) => r.t);
  } finally {
    await sql.end();
  }
}

beforeAll(async () => {
  await admin.unsafe(`create database "${dbName}"`);
});

afterAll(async () => {
  await admin.unsafe(`drop database if exists "${dbName}" with (force)`);
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
