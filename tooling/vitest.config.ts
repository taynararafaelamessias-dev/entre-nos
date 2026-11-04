import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'tooling',
    include: ['**/*.test.ts'],
  },
});
