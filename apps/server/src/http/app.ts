import { API_PREFIX } from '@entre-nos/contracts';
import { RPCHandler } from '@orpc/server/fetch';
import { Hono } from 'hono';
import { checkHealth, type PingDatabase } from '../modules/health/check-health.ts';
import { createRouter } from './router.ts';

export function createApp(deps: { pingDatabase: PingDatabase }): Hono {
  const app = new Hono();

  app.get('/health', async (c) => {
    const result = await checkHealth(deps.pingDatabase);
    return c.json(result, result.status === 'ok' ? 200 : 503);
  });

  const rpc = new RPCHandler(createRouter(deps));
  app.use(`${API_PREFIX}/*`, async (c, next) => {
    const { matched, response } = await rpc.handle(c.req.raw, { prefix: API_PREFIX, context: {} });
    if (matched) return c.newResponse(response.body, response);
    await next();
  });

  return app;
}
