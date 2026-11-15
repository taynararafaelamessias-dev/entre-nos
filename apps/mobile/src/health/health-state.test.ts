import type { HealthResponse } from '@entre-nos/contracts';
import { describe, expect, it } from 'vitest';
import { healthState } from './health-state.ts';

const response = (status: 'up' | 'down'): HealthResponse => ({
  status: status === 'up' ? 'ok' : 'error',
  postgres: { status },
});

describe('healthState', () => {
  it('sem resposta ainda, está verificando', () => {
    expect(healthState({ data: undefined, isError: false })).toBe('checking');
  });

  it('banco no ar', () => {
    expect(healthState({ data: response('up'), isError: false })).toBe('up');
  });

  it('banco fora do ar', () => {
    expect(healthState({ data: response('down'), isError: false })).toBe('down');
  });

  it('erro sem resposta: servidor inalcançável', () => {
    expect(healthState({ data: undefined, isError: true })).toBe('unreachable');
  });

  it('erro com resposta antiga: servidor inalcançável', () => {
    expect(healthState({ data: response('up'), isError: true })).toBe('unreachable');
  });
});
