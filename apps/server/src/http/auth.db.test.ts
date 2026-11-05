import { randomBytes } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { erroApiSchema, euResponseSchema } from '@entre-nos/contracts';
import type { Hono } from 'hono';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { type BancoDeTeste, criarBancoDeTeste } from '../db/banco-de-teste.ts';
import { createDatabase } from '../db/client.ts';
import { createAuth } from '../modules/auth/auth.ts';
import { esperarEmailDoCapturador } from '../modules/auth/email/capturador.ts';
import { criarEnvioSmtp } from '../modules/auth/email/enviar-email.ts';
import { createApi } from './api.ts';
import { createApp } from './app.ts';

const BASE_URL = 'http://localhost:3102';
const COOKIE_DA_SESSAO = 'entre-nos.session_token=';

let banco: BancoDeTeste;
let database: ReturnType<typeof createDatabase>;
let webDistDir: string;
let app: Hono;

beforeAll(async () => {
  banco = await criarBancoDeTeste();
  database = createDatabase(banco.appUrl);
  webDistDir = await mkdtemp(join(tmpdir(), 'entre-nos-web-'));
  await writeFile(join(webDistDir, 'index.html'), '<!doctype html><div id="root"></div>');

  const auth = createAuth({
    db: database.db,
    baseURL: BASE_URL,
    secret: randomBytes(32).toString('hex'),
    enviarEmail: criarEnvioSmtp(process.env.SMTP_URL!, 'Entre Nós <teste@entre-nos.local>'),
  });
  app = createApp({
    pingDatabase: database.ping,
    webDistDir,
    api: createApi({ auth, db: database.db }),
  });
}, 60000);

afterAll(async () => {
  await database?.close();
  await banco?.destruir();
  if (webDistDir) await rm(webDistDir, { recursive: true, force: true });
});

const emailNovo = () => `${randomBytes(6).toString('hex')}@teste.local`;

async function pedirLink(email: string, locale: 'pt' | 'es' = 'pt'): Promise<string> {
  return (await pedirLinkComAssunto(email, locale)).caminho;
}

async function pedirLinkComAssunto(email: string, locale: 'pt' | 'es'): Promise<{ caminho: string; assunto: string }> {
  const res = await app.request('/api/auth/sign-in/magic-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: BASE_URL },
    body: JSON.stringify({
      email,
      callbackURL: '/',
      errorCallbackURL: '/entrar?erro=link',
      metadata: { locale },
    }),
  });
  expect(res.status).toBe(200);
  const { link, assunto } = await esperarEmailDoCapturador(process.env.MAILPIT_URL!, email);
  const url = new URL(link);
  return { caminho: url.pathname + url.search, assunto };
}

function cookieDaSessao(res: Response): string | undefined {
  return res.headers
    .getSetCookie()
    .map((c) => c.split(';')[0]!)
    .find((par) => par.startsWith(COOKIE_DA_SESSAO) && par.length > COOKIE_DA_SESSAO.length);
}

async function abrirLink(caminho: string) {
  const res = await app.request(caminho);
  return { res, cookie: cookieDaSessao(res), location: res.headers.get('location') ?? '' };
}

async function entrar(email = emailNovo(), locale: 'pt' | 'es' = 'pt'): Promise<{ email: string; cookie: string }> {
  const { cookie } = await abrirLink(await pedirLink(email, locale));
  expect(cookie).toBeDefined();
  return { email, cookie: cookie! };
}

const get = (caminho: string, cookie?: string) =>
  app.request(caminho, { headers: cookie ? { Cookie: cookie } : {} });

const post = (caminho: string, corpo: unknown, cookie?: string) =>
  app.request(caminho, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: BASE_URL, ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify(corpo),
  });

async function erroDe(res: Response) {
  return erroApiSchema.parse(await res.json()).erro;
}

describe('link mágico + sessão + aceite de 18+', () => {
  it('pede o link, abre, entra; /api/eu exige o aceite de 18+ e responde depois dele', async () => {
    const email = emailNovo();
    const { res, cookie, location } = await abrirLink(await pedirLink(email));
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(new URL(location, BASE_URL).pathname).toBe('/');
    expect(cookie).toBeDefined();

    const sessao = await get('/api/auth/get-session', cookie);
    expect(sessao.status).toBe(200);
    expect(((await sessao.json()) as { user: { email: string } }).user.email).toBe(email);

    const antes = await get('/api/eu', cookie);
    expect(antes.status).toBe(403);
    expect(await erroDe(antes)).toBe('aceite_18_pendente');

    const aceite = await post('/api/aceite-18', { tenho18: true }, cookie);
    expect(aceite.status).toBe(204);

    const depois = await get('/api/eu', cookie);
    expect(depois.status).toBe(200);
    const eu = euResponseSchema.parse(await depois.json());
    expect(eu.pessoa.email).toBe(email);
  });

  it('o mesmo link aberto duas vezes não dá sessão na segunda', async () => {
    const caminho = await pedirLink(emailNovo());
    const primeira = await abrirLink(caminho);
    expect(primeira.cookie).toBeDefined();

    const segunda = await abrirLink(caminho);
    expect(segunda.cookie).toBeUndefined();
    expect(segunda.location).toContain('erro=link');
  });

  it('link vencido não dá sessão', async () => {
    const email = emailNovo();
    const caminho = await pedirLink(email);
    // Relativo ao valor gravado: não depende do fuso do banco (a coluna é timestamp sem fuso).
    const vencidos = await banco.owner`
      update link_magico set expires_at = expires_at - interval '1 hour'
      where value like '%' || ${email} || '%'`;
    expect(vencidos.count).toBe(1);

    const { cookie, location } = await abrirLink(caminho);
    expect(cookie).toBeUndefined();
    expect(location).toContain('erro=link');
  });

  it('a trava: sem cookie 401; sem aceite 403 em qualquer rota; tenho18:false 400; aceite grava aceito_em', async () => {
    const semCookie = await get('/api/eu');
    expect(semCookie.status).toBe(401);
    expect(await erroDe(semCookie)).toBe('sem_sessao');

    const { email, cookie } = await entrar();

    for (const caminho of ['/api/eu', '/api/qualquer']) {
      const res = await get(caminho, cookie);
      expect(res.status).toBe(403);
      expect(await erroDe(res)).toBe('aceite_18_pendente');
    }

    const recusa = await post('/api/aceite-18', { tenho18: false }, cookie);
    expect(recusa.status).toBe(400);
    expect(await erroDe(recusa)).toBe('pedido_invalido');

    expect((await post('/api/aceite-18', { tenho18: true }, cookie)).status).toBe(204);

    const linhas = await banco.owner<{ aceito: boolean }[]>`
      select a.aceito_em is not null as aceito
      from aceite_18 a join pessoa p on p.id = a.pessoa_id
      where p.email = ${email}`;
    expect(linhas).toEqual([{ aceito: true }]);

    const naoExiste = await get('/api/qualquer', cookie);
    expect(naoExiste.status).toBe(404);
    expect(await erroDe(naoExiste)).toBe('nao_encontrado');
  });

  it('depois de sair, o cookie antigo não vale mais', async () => {
    const { cookie } = await entrar();
    expect((await post('/api/aceite-18', { tenho18: true }, cookie)).status).toBe(204);
    expect((await get('/api/eu', cookie)).status).toBe(200);

    const saida = await post('/api/auth/sign-out', {}, cookie);
    expect(saida.status).toBe(200);

    const depois = await get('/api/eu', cookie);
    expect(depois.status).toBe(401);
    expect(await erroDe(depois)).toBe('sem_sessao');
  });

  it('o idioma da tela chega ao e-mail: metadata.locale es manda o assunto em espanhol', async () => {
    const email = emailNovo();
    const { caminho, assunto } = await pedirLinkComAssunto(email, 'es');
    expect(assunto).toBe('Tu enlace para entrar');
    expect((await abrirLink(caminho)).cookie).toBeDefined();
  });

  it('sessão passada do updateAge é renovada e o cookie novo chega ao navegador', async () => {
    const { email, cookie } = await entrar();
    expect((await post('/api/aceite-18', { tenho18: true }, cookie)).status).toBe(204);

    const movidas = await banco.owner`
      update sessao set expires_at = expires_at - interval '2 days'
      where user_id = (select id from pessoa where email = ${email})`;
    expect(movidas.count).toBe(1);

    const res = await get('/api/eu', cookie);
    expect(res.status).toBe(200);
    expect(cookieDaSessao(res)).toBeDefined();
  });

  it('endpoints do Better Auth que o app não usa respondem 404', async () => {
    const { email, cookie } = await entrar();
    expect((await post('/api/aceite-18', { tenho18: true }, cookie)).status).toBe(204);
    const [antes] = await banco.owner<{ name: string }[]>`select name from pessoa where email = ${email}`;

    const atualizar = await post('/api/auth/update-user', { name: 'outro nome' }, cookie);
    expect(atualizar.status).toBe(404);
    expect(await erroDe(atualizar)).toBe('nao_encontrado');
    const [depois] = await banco.owner<{ name: string }[]>`select name from pessoa where email = ${email}`;
    expect(depois!.name).toBe(antes!.name);

    const sessoes = await get('/api/auth/list-sessions', cookie);
    expect(sessoes.status).toBe(404);
    expect(await erroDe(sessoes)).toBe('nao_encontrado');
  });
});
