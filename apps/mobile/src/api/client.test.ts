import { describe, expect, it } from 'vitest';
import { createApiClient } from './client.ts';

describe('createApiClient', () => {
  it('chama a rota pelo prefixo da API e repassa a falha de rede', async () => {
    const recorded: Request[] = [];
    const fake = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      recorded.push(new Request(input, init));
      throw new TypeError('Network request failed');
    };
    const client = createApiClient('http://servidor.test', fake as typeof fetch);

    await expect(client.health.check()).rejects.toThrow('Network request failed');

    expect(recorded).toHaveLength(1);
    expect(recorded[0]?.method).toBe('POST');
    expect(recorded[0]?.url).toBe('http://servidor.test/api/v1/health/check');
  });
});
