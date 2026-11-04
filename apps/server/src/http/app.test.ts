import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { healthResponseSchema } from '@entre-nos/contracts';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app.ts';

let webDistDir: string;

beforeAll(async () => {
  webDistDir = await mkdtemp(join(tmpdir(), 'entre-nos-web-'));
  await writeFile(join(webDistDir, 'index.html'), '<!doctype html><div id="root"></div>');
  await mkdir(join(webDistDir, 'assets'));
  await writeFile(join(webDistDir, 'assets', 'app.js'), 'console.log("app")');
});

afterAll(async () => {
  await rm(webDistDir, { recursive: true, force: true });
});

describe('createApp', () => {
  const healthy = () => createApp({ pingDatabase: async () => {}, webDistDir });
  const broken = () =>
    createApp({
      pingDatabase: async () => {
        throw new Error('down');
      },
      webDistDir,
    });

  it('GET /health answers 200 with postgres up', async () => {
    const res = await healthy().request('/health');
    expect(res.status).toBe(200);
    const body = healthResponseSchema.parse(await res.json());
    expect(body.status).toBe('ok');
    expect(body.postgres.status).toBe('up');
  });

  it('GET /health answers 503 with an error body when postgres is down', async () => {
    const res = await broken().request('/health');
    expect(res.status).toBe(503);
    const body = healthResponseSchema.parse(await res.json());
    expect(body.status).toBe('error');
    expect(body.postgres.status).toBe('down');
  });

  it('serves index.html at /', async () => {
    const res = await healthy().request('/');
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('<div id="root">');
  });

  it('falls back to index.html for client routes', async () => {
    const res = await healthy().request('/casal/qualquer-rota');
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('<div id="root">');
  });

  it('serves static assets', async () => {
    const res = await healthy().request('/assets/app.js');
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('console.log');
  });
});
