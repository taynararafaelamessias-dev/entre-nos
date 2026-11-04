import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['site/**', 'supabase/**', '**/dist/**', 'apps/server/drizzle/**', '.rumo/**', '**/node_modules/**'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@entre-nos/server(/.*)?$|(^|/)apps/server(/|$)|(^|/)server/src(/|$)',
              message: 'apps/web não importa apps/server; use packages/ (ADR 0004).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['apps/server/src/modules/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(hono|@hono/.+)(/.*)?$|(^|/)http(/|$)',
              message: 'Módulos do domínio não dependem de HTTP (ADR 0004).',
            },
          ],
        },
      ],
    },
  },
);
