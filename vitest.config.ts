import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['tooling/vitest.config.ts', 'apps/*/vitest.config.ts'],
  },
});
