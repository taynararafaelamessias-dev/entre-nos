import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { checkHealth, type PingDatabase } from '../modules/health/check-health.ts';

export function createApp(deps: { pingDatabase: PingDatabase; webDistDir: string }): Hono {
  const app = new Hono();

  app.get('/health', async (c) => {
    const result = await checkHealth(deps.pingDatabase);
    return c.json(result, result.status === 'ok' ? 200 : 503);
  });

  app.use('*', serveStatic({ root: deps.webDistDir }));
  app.get('*', serveStatic({ root: deps.webDistDir, path: 'index.html' }));

  return app;
}
