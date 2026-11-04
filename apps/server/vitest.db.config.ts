import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'db',
    root: import.meta.dirname,
    include: ['src/**/*.db.test.ts'],
    testTimeout: 30000,
  },
});
