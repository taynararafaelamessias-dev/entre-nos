import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      'apps/server/drizzle/**',
      '.rumo/**',
      '**/node_modules/**',
      '**/.expo/**',
      '**/expo-env.d.ts',
      'apps/mobile/ios/**',
      'apps/mobile/android/**',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ['apps/mobile/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@entre-nos/server(/.*)?$|(^|/)apps/server(/|$)|(^|/)server/src(/|$)',
              message: 'apps/mobile não importa apps/server; use packages/ (ADR 0014).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@entre-nos/(server|mobile)(/.*)?$|(^|/)apps/',
              message: 'packages/ não importa apps/ (ADR 0014).',
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
              regex: '^(hono|@hono/.+|@orpc/.+)(/.*)?$|(^|/)http(/|$)',
              message: 'Módulos do domínio não dependem de HTTP (ADR 0014).',
            },
          ],
        },
      ],
    },
  },
);
