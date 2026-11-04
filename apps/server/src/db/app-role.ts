import type { Sql } from 'postgres';

export interface AppRole {
  role: string;
  password: string;
}

// O nome do papel e a senha entram só como parâmetros (set_config) e viram SQL dentro do
// bloco DO via format('%I' / '%L'): nada é concatenado no texto enviado ao Postgres.
const ENSURE_APP_ROLE = `
do $$
declare
  r text := current_setting('entre_nos.app_role');
  pw text := current_setting('entre_nos.app_pw');
  attrs text := 'login nosuperuser nobypassrls nocreatedb nocreaterole noreplication';
begin
  if exists (select from pg_roles where rolname = r) then
    execute format('alter role %I with %s password %L', r, attrs, pw);
  else
    execute format('create role %I with %s password %L', r, attrs, pw);
  end if;
  execute format('grant connect on database %I to %I', current_database(), r);
  execute format('grant usage on schema public to %I', r);
  execute format('grant select, insert, update, delete on all tables in schema public to %I', r);
  execute format('grant usage, select on all sequences in schema public to %I', r);
  execute format('alter default privileges for role current_user in schema public '
    'grant select, insert, update, delete on tables to %I', r);
  execute format('alter default privileges for role current_user in schema public '
    'grant usage, select on sequences to %I', r);
end
$$`;

/**
 * Garante o papel com que o app conecta: faz login, sem superuser nem bypass de RLS, lê e
 * escreve nas tabelas de `public` (as atuais e as que o dono criar depois), não cria nem
 * possui nada. Idempotente: se o papel existe, só troca a senha e reaplica os atributos.
 * Roda com o dono das tabelas (o usuário das migrations).
 */
export async function ensureAppRole(sql: Sql, { role, password }: AppRole): Promise<void> {
  if (!password) throw new Error('senha do papel do app vazia.');
  await sql.begin(async (tx) => {
    await tx`select set_config('entre_nos.app_role', ${role}, true), set_config('entre_nos.app_pw', ${password}, true)`;
    await tx.unsafe(ENSURE_APP_ROLE);
  });
}
