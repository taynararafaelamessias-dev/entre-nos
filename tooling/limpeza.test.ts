import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('limpeza do app antigo (ADR 0011)', () => {
  it.each(['site', 'supabase', 'apps/web', 'wrangler.jsonc'])('%s foi removido', (path) => {
    expect(existsSync(join(repoRoot, path))).toBe(false);
  });

  it.each([
    'apps/server/drizzle/0000_fundacao.sql',
    'docker/postgres/Dockerfile',
    'ops/backup/verify-backup.sh',
    'docs/adr/0001-reconstruir-mesmo-produto-em-stack-nova.md',
    '.env.example',
  ])('%s continua no repositório', (path) => {
    expect(existsSync(join(repoRoot, path))).toBe(true);
  });
});
