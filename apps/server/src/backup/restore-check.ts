import type { ISql, Sql } from 'postgres';

/** Retrato do banco usado para conferir uma restauração (chaves de `tables`: `schema.tabela`). */
export interface DbSnapshot {
  tables: Record<string, number>;
  policies: number;
  rlsTables: string[];
}

/**
 * Conta as linhas de toda tabela comum ou particionada fora dos schemas do sistema, o número
 * de políticas de RLS e quais tabelas têm RLS ligado. Roda com o dono (sem RLS no caminho),
 * senão as contagens viriam filtradas.
 */
export async function takeSnapshot(sql: ISql): Promise<DbSnapshot> {
  const rels = await sql<{ schema: string; name: string; rls: boolean }[]>`
    select n.nspname as schema, c.relname as name, c.relrowsecurity as rls
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind in ('r', 'p')
      and n.nspname not in ('pg_catalog', 'information_schema')
      and left(n.nspname, 8) <> 'pg_toast'
      and left(n.nspname, 7) <> 'pg_temp'
    order by n.nspname, c.relname`;

  const tables: Record<string, number> = {};
  const rlsTables: string[] = [];
  for (const { schema, name, rls } of rels) {
    const key = `${schema}.${name}`;
    const [row] = await sql<{ n: number }[]>`select count(*)::int as n from ${sql(schema)}.${sql(name)}`;
    tables[key] = row?.n ?? 0;
    if (rls) rlsTables.push(key);
  }
  rlsTables.sort();

  const [pol] = await sql<{ n: number }[]>`select count(*)::int as n from pg_policies`;
  return { tables, policies: pol?.n ?? 0, rlsTables };
}

/** Compara a origem com o restaurado: uma linha em português por diferença; iguais → `[]`. */
export function diffSnapshots(source: DbSnapshot, restored: DbSnapshot): string[] {
  const out: string[] = [];
  const keys = [...new Set([...Object.keys(source.tables), ...Object.keys(restored.tables)])].sort();
  for (const key of keys) {
    const a = source.tables[key];
    const b = restored.tables[key];
    if (b === undefined) out.push(`tabela ${key}: falta no restaurado (origem ${a})`);
    else if (a === undefined) out.push(`tabela ${key}: a mais no restaurado (restaurado ${b})`);
    else if (a !== b) out.push(`tabela ${key}: origem ${a}, restaurado ${b}`);
  }
  if (source.policies !== restored.policies) {
    out.push(`políticas de RLS: origem ${source.policies}, restaurado ${restored.policies}`);
  }
  const srcRls = [...source.rlsTables].sort();
  const resRls = [...restored.rlsTables].sort();
  if (srcRls.join('\n') !== resRls.join('\n')) {
    const fmt = (l: string[]) => (l.length ? l.join(', ') : '(nenhuma)');
    out.push(`tabelas com RLS: origem ${fmt(srcRls)}, restaurado ${fmt(resRls)}`);
  }
  return out;
}

/**
 * Cria um ponto de restauração nomeado e tira o snapshot na mesma transação repeatable read:
 * o ponto vem primeiro, então o snapshot enxerga exatamente o que a restauração até esse
 * nome deve trazer de volta.
 */
export async function markRestorePoint(sql: Sql, name: string): Promise<DbSnapshot> {
  return sql.begin('isolation level repeatable read', async (tx) => {
    await tx`select pg_create_restore_point(${name})`;
    return takeSnapshot(tx);
  });
}

/**
 * Confere o papel do app como veio no banco restaurado, antes de qualquer `ensureAppRole`
 * (que força `nobypassrls` e esconderia o problema). Ausente é normal (o migrate recria);
 * superuser ou bypass de RLS → uma linha em português por problema (ADR 0005).
 */
export async function checkAppRole(sql: ISql, role: string): Promise<string[]> {
  const [row] = await sql<{ rolsuper: boolean; rolbypassrls: boolean }[]>`
    select rolsuper, rolbypassrls from pg_roles where rolname = ${role}`;
  if (!row) return [];
  const out: string[] = [];
  if (row.rolsuper) out.push(`papel ${role}: é superuser no banco restaurado`);
  if (row.rolbypassrls) out.push(`papel ${role}: tem bypass de RLS no banco restaurado`);
  return out;
}
