import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { type BancoDeTeste, criarBancoDeTeste } from '../../db/banco-de-teste.ts';
import { registrarAceite18, temAceite18 } from './aceite-18.ts';

let banco: BancoDeTeste;
let app: postgres.Sql;
const pessoaId = 'pessoa-teste-1';

beforeAll(async () => {
  banco = await criarBancoDeTeste();
  app = postgres(banco.appUrl, { max: 1, onnotice: () => {} });
}, 60000);

afterAll(async () => {
  await app?.end();
  await banco?.destruir();
});

async function aceites() {
  // epoch em ms calculado no SQL: o drizzle troca os parsers de timestamp do cliente compartilhado.
  return app<{ aceito_ms: number; idade_ms: number }[]>`
    select (extract(epoch from aceito_em) * 1000)::float8 as aceito_ms,
           (extract(epoch from now() - aceito_em) * 1000)::float8 as idade_ms
    from aceite_18 where pessoa_id = ${pessoaId}`;
}

describe('aceite de 18+', () => {
  it('pessoa recém-criada ainda não tem aceite de 18+', async () => {
    await app`insert into pessoa (id, name, email) values (${pessoaId}, '', 'pessoa@exemplo.test')`;
    expect(await temAceite18(drizzle(app), pessoaId)).toBe(false);
  });

  it('registrarAceite18 grava o aceite com o momento atual', async () => {
    await registrarAceite18(drizzle(app), pessoaId);
    expect(await temAceite18(drizzle(app), pessoaId)).toBe(true);
    const rows = await aceites();
    expect(rows).toHaveLength(1);
    const idade = rows[0]!.idade_ms;
    expect(idade).toBeGreaterThanOrEqual(0);
    expect(idade).toBeLessThan(60000);
  });

  it('registrar de novo mantém uma linha só, com o primeiro momento', async () => {
    const [antes] = await aceites();
    await registrarAceite18(drizzle(app), pessoaId);
    const depois = await aceites();
    expect(depois).toHaveLength(1);
    expect(depois[0]!.aceito_ms).toBe(antes!.aceito_ms);
  });

  it('o papel do app lê sessao, link_magico e vinculo_de_login', async () => {
    for (const tabela of ['sessao', 'link_magico', 'vinculo_de_login']) {
      const rows = await app.unsafe(`select count(*)::int as n from ${tabela}`);
      expect(rows[0]?.n).toBe(0);
    }
  });
});
