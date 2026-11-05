import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { aceite18 } from '../../db/schema.ts';

/** Grava o aceite de 18+ da pessoa. Repetir não muda nada: vale o primeiro momento. */
export async function registrarAceite18(db: PostgresJsDatabase, pessoaId: string): Promise<void> {
  await db.insert(aceite18).values({ pessoaId }).onConflictDoNothing();
}

export async function temAceite18(db: PostgresJsDatabase, pessoaId: string): Promise<boolean> {
  const rows = await db
    .select({ pessoaId: aceite18.pessoaId })
    .from(aceite18)
    .where(eq(aceite18.pessoaId, pessoaId))
    .limit(1);
  return rows.length > 0;
}
