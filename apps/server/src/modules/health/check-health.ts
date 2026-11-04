import type { HealthResponse } from '@entre-nos/contracts';

export type PingDatabase = () => Promise<void>;

export async function checkHealth(
  pingDatabase: PingDatabase,
  now: () => number = () => performance.now(),
): Promise<HealthResponse> {
  const start = now();
  try {
    await pingDatabase();
  } catch {
    return { status: 'error', postgres: { status: 'down' } };
  }
  const end = now();
  return { status: 'ok', postgres: { status: 'up', latencyMs: Math.round(end - start) } };
}
