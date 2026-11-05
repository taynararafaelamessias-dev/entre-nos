import { randomBytes } from 'node:crypto';
import postgres from 'postgres';
import { ensureAppRole } from './app-role.ts';
import { runMigrations } from './migrate.ts';

export interface BancoDeTeste {
  /** Banco de teste com o dono (o usuário das migrations). */
  ownerUrl: string;
  /** Mesmo banco, com um papel do app sem bypass de RLS (como o app conecta). */
  appUrl: string;
  owner: postgres.Sql;
  destruir(): Promise<void>;
}

const hex = (n: number) => randomBytes(n).toString('hex');

/**
 * Cria um banco aleatório, aplica as migrations e garante um papel do app aleatório,
 * como `migrate.db.test.ts`. `destruir` apaga banco e papel.
 */
export async function criarBancoDeTeste(): Promise<BancoDeTeste> {
  const baseUrl = process.env.MIGRATION_DATABASE_URL;
  if (!baseUrl) {
    throw new Error(
      'MIGRATION_DATABASE_URL não definida: suba o banco (docker compose up -d --wait db) e exporte as variáveis do .env.',
    );
  }

  const dbName = `entre_nos_test_${hex(6)}`;
  const role = `entre_nos_app_t_${hex(6)}`;
  const password = hex(24);

  const urlFor = (user?: { name: string; password: string }) => {
    const url = new URL(baseUrl);
    url.pathname = `/${dbName}`;
    if (user) {
      url.username = user.name;
      url.password = user.password;
    }
    return url.toString();
  };
  const ownerUrl = urlFor();
  const appUrl = urlFor({ name: role, password });

  const admin = postgres(baseUrl, { max: 1, onnotice: () => {} });
  await admin.unsafe(`create database "${dbName}"`);

  const owner = postgres(ownerUrl, { max: 1, onnotice: () => {} });
  try {
    await runMigrations(ownerUrl);
    await ensureAppRole(owner, { role, password });
  } catch (err) {
    await owner.end();
    await admin.unsafe(`drop database if exists "${dbName}" with (force)`);
    await admin.unsafe(`drop role if exists "${role}"`);
    await admin.end();
    throw err;
  }

  return {
    ownerUrl,
    appUrl,
    owner,
    async destruir() {
      const [exists] = await admin`select 1 from pg_roles where rolname = ${role}`;
      if (exists) await owner.unsafe(`drop owned by "${role}"`);
      await owner.end();
      await admin.unsafe(`drop database if exists "${dbName}" with (force)`);
      await admin.unsafe(`drop role if exists "${role}"`);
      await admin.end();
    },
  };
}
