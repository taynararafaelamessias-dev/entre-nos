import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const eslint = new ESLint({ cwd: repoRoot });

async function restrictedImports(path: string, code: string): Promise<number> {
  const [result] = await eslint.lintText(code, { filePath: join(repoRoot, path) });
  if (!result) throw new Error(`ESLint não devolveu resultado para ${path}`);
  return result.messages.filter((m) => m.ruleId === 'no-restricted-imports').length;
}

describe('fronteiras do monorepo (ADR 0004)', () => {
  it('apps/web não importa o pacote do servidor', async () => {
    expect(await restrictedImports('apps/web/src/x.ts', "import { x } from '@entre-nos/server';\nexport { x };\n")).toBe(1);
  });

  it('apps/web não importa apps/server por caminho relativo', async () => {
    expect(
      await restrictedImports('apps/web/src/x.ts', "import { createApp } from '../../server/src/http/app.ts';\nexport { createApp };\n"),
    ).toBe(1);
  });

  it('apps/web pode importar packages/contracts', async () => {
    expect(
      await restrictedImports('apps/web/src/x.ts', "import { healthResponseSchema } from '@entre-nos/contracts';\nexport { healthResponseSchema };\n"),
    ).toBe(0);
  });

  it('módulos do domínio no servidor não dependem de HTTP', async () => {
    expect(await restrictedImports('apps/server/src/modules/health/x.ts', "import { Hono } from 'hono';\nexport { Hono };\n")).toBe(1);
  });

  it('a camada http do servidor pode usar hono', async () => {
    expect(await restrictedImports('apps/server/src/http/x.ts', "import { Hono } from 'hono';\nexport { Hono };\n")).toBe(0);
  });
});
