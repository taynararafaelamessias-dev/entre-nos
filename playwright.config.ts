import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

if (existsSync('.env')) process.loadEnvFile('.env');

const { PORT, WEB_PORT, APP_URL } = process.env;

export default defineConfig({
  testDir: 'e2e',
  workers: 1,
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  use: { baseURL: APP_URL, locale: 'pt-BR' },
  webServer: [
    {
      command: 'node --env-file=.env apps/server/src/index.ts',
      url: `http://127.0.0.1:${PORT}/health`,
      reuseExistingServer: false,
    },
    {
      command: 'pnpm --filter @entre-nos/web dev',
      url: APP_URL,
      env: { PORT: PORT ?? '', WEB_PORT: WEB_PORT ?? '' },
    },
  ],
});
