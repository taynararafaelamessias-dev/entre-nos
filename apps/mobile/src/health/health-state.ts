import type { HealthResponse } from '@entre-nos/contracts';

export type HealthState = 'checking' | 'up' | 'down' | 'unreachable';

export function healthState(q: { data: HealthResponse | undefined; isError: boolean }): HealthState {
  if (q.isError) return 'unreachable';
  if (!q.data) return 'checking';
  return q.data.postgres.status;
}
