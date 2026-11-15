import { API_PREFIX, healthResponseSchema, type ApiClient } from '@entre-nos/contracts';
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.ts';

describe('createApp', () => {
  const healthy = () => createApp({ pingDatabase: async () => {} });
  const broken = () =>
    createApp({
      pingDatabase: async () => {
        throw new Error('down');
      },
    });

  const clientOf = (app: ReturnType<typeof createApp>) =>
    createORPCClient<ApiClient>(
      new RPCLink({
        url: 'http://servidor.test' + API_PREFIX,
        fetch: async (request) => app.request(request),
      }),
    );

  it('GET /health answers 200 with postgres up', async () => {
    const res = await healthy().request('/health');
    expect(res.status).toBe(200);
    const body = healthResponseSchema.parse(await res.json());
    expect(body.status).toBe('ok');
    expect(body.postgres.status).toBe('up');
  });

  it('GET /health answers 503 with an error body when postgres is down', async () => {
    const res = await broken().request('/health');
    expect(res.status).toBe(503);
    const body = healthResponseSchema.parse(await res.json());
    expect(body.status).toBe('error');
    expect(body.postgres.status).toBe('down');
  });

  it('GET / não serve front-end: 404 sem HTML', async () => {
    const res = await healthy().request('/');
    expect(res.status).toBe(404);
    expect(await res.text()).not.toContain('<');
  });

  it('o cliente tipado lê a saúde do servidor pela API', async () => {
    const result = await clientOf(healthy()).health.check();
    expect(result).toMatchObject({
      status: 'ok',
      postgres: { status: 'up', latencyMs: expect.any(Number) },
    });
  });

  it('o cliente tipado recebe o erro quando o postgres está fora', async () => {
    const result = await clientOf(broken()).health.check();
    expect(result).toMatchObject({ status: 'error', postgres: { status: 'down' } });
  });

  it('POST numa rota inexistente da API responde 404', async () => {
    const res = await healthy().request(`${API_PREFIX}/nao/existe`, { method: 'POST' });
    expect(res.status).toBe(404);
  });

  it('corpo acima de 64 KiB na API responde 413', async () => {
    const body = JSON.stringify({ json: 'a'.repeat(70 * 1024) });
    const res = await healthy().request(`${API_PREFIX}/health/check`, { method: 'POST', body, headers: { 'content-type': 'application/json' } });
    expect(res.status).toBe(413);
  });
});
