import { describe, expect, it } from 'vitest';
import { checkHealth } from './check-health.ts';

describe('checkHealth', () => {
  it('reports postgres up with the measured latency when the ping resolves', async () => {
    const times = [10, 14];
    const result = await checkHealth(
      async () => {},
      () => times.shift() ?? 0,
    );
    expect(result).toEqual({ status: 'ok', postgres: { status: 'up', latencyMs: 4 } });
  });

  it('reports an error without throwing when the ping rejects', async () => {
    const result = await checkHealth(async () => {
      throw new Error('connection refused');
    });
    expect(result).toEqual({ status: 'error', postgres: { status: 'down' } });
  });
});
