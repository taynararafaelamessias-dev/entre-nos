import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export function createDatabase(url: string) {
  const sql = postgres(url, { max: 10, connect_timeout: 5 });
  return {
    sql,
    db: drizzle(sql),
    ping: async (): Promise<void> => {
      await sql`select 1`;
    },
    close: () => sql.end(),
  };
}
