import { describe, expect, it } from 'vitest';
import { diffSnapshots, type DbSnapshot } from './restore-check.ts';

const base = (): DbSnapshot => ({
  tables: { 'public.casais': 2, 't.a': 3 },
  policies: 1,
  rlsTables: ['t.a'],
});

describe('diffSnapshots', () => {
  it('snapshots iguais não têm diferença', () => {
    expect(diffSnapshots(base(), base())).toEqual([]);
  });

  it('acusa contagem diferente numa tabela', () => {
    const restored = base();
    restored.tables['t.a'] = 2;
    expect(diffSnapshots(base(), restored)).toEqual(['tabela t.a: origem 3, restaurado 2']);
  });

  it('acusa tabela que falta no restaurado', () => {
    const restored = base();
    delete restored.tables['public.casais'];
    const diff = diffSnapshots(base(), restored);
    expect(diff).toHaveLength(1);
    expect(diff[0]).toMatch(/public\.casais/);
    expect(diff[0]).toMatch(/falta/);
  });

  it('acusa tabela a mais no restaurado', () => {
    const restored = base();
    restored.tables['public.extra'] = 0;
    const diff = diffSnapshots(base(), restored);
    expect(diff).toHaveLength(1);
    expect(diff[0]).toMatch(/public\.extra/);
    expect(diff[0]).toMatch(/a mais/);
  });

  it('acusa número de políticas diferente', () => {
    const restored = { ...base(), policies: 0 };
    expect(diffSnapshots(base(), restored)).toEqual(['políticas de RLS: origem 1, restaurado 0']);
  });

  it('acusa tabelas com RLS diferentes', () => {
    const restored = { ...base(), rlsTables: [] };
    const diff = diffSnapshots(base(), restored);
    expect(diff).toHaveLength(1);
    expect(diff[0]).toMatch(/RLS/);
    expect(diff[0]).toMatch(/t\.a/);
  });
});
