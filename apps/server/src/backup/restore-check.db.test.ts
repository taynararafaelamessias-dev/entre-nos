import { randomBytes } from 'node:crypto';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { checkAppRole, diffSnapshots, markRestorePoint, takeSnapshot } from './restore-check.ts';

const baseUrl = process.env.MIGRATION_DATABASE_URL;
if (!baseUrl) {
  throw new Error(
    'MIGRATION_DATABASE_URL não definida: suba o banco (docker compose up -d --wait db) e exporte as variáveis do .env.',
  );
}

const hex = (n: number) => randomBytes(n).toString('hex');

const dbName = `entre_nos_test_${hex(6)}`;
const testUrl = (() => {
  const url = new URL(baseUrl);
  url.pathname = `/${dbName}`;
  return url.toString();
})();

const admin = postgres(baseUrl, { max: 1, onnotice: () => {} });
let sql: postgres.Sql;

beforeAll(async () => {
  await admin.unsafe(`create database "${dbName}"`);
  sql = postgres(testUrl, { max: 1, onnotice: () => {} });
  await sql`create schema t`;
  await sql`create table t.a (id int primary key)`;
  await sql`insert into t.a values (1), (2), (3)`;
  await sql`alter table t.a enable row level security`;
  await sql`create policy p on t.a using (true)`;
});

afterAll(async () => {
  await sql?.end();
  await admin.unsafe(`drop database if exists "${dbName}" with (force)`);
  await admin.end();
});

describe('takeSnapshot / markRestorePoint', () => {
  it('conta linhas, políticas e tabelas com RLS; o ponto de restauração devolve o mesmo snapshot', async () => {
    const before = await takeSnapshot(sql);
    expect(before.tables['t.a']).toBe(3);
    expect(before.policies).toBe(1);
    expect(before.rlsTables).toContain('t.a');

    const marked = await markRestorePoint(sql, `teste_${hex(6)}`);
    expect(marked).toEqual(before);

    await sql`insert into t.a values (4)`;
    const after = await takeSnapshot(sql);
    const diff = diffSnapshots(before, after);
    expect(diff).toHaveLength(1);
    expect(diff[0]).toMatch(/t\.a/);
  });
});

describe('checkAppRole', () => {
  it('aponta bypass de RLS no papel do app; sem bypass ou ausente → nenhuma linha', async () => {
    const role = `t_role_${hex(6)}`;
    try {
      expect(await checkAppRole(admin, role)).toEqual([]);
      await admin.unsafe(`create role "${role}" bypassrls`);
      const lines = await checkAppRole(admin, role);
      expect(lines).toHaveLength(1);
      expect(lines[0]).toMatch(/bypass/);
      await admin.unsafe(`alter role "${role}" nobypassrls`);
      expect(await checkAppRole(admin, role)).toEqual([]);
    } finally {
      await admin.unsafe(`drop role if exists "${role}"`);
    }
  });
});
