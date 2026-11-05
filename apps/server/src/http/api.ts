import { aceite18RequestSchema, type ErroApi, type EuResponse } from '@entre-nos/contracts';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Hono } from 'hono';
import { registrarAceite18, temAceite18 } from '../modules/auth/aceite-18.ts';
import type { Auth } from '../modules/auth/auth.ts';

type Pessoa = { id: string; email: string; name: string };

const erro = (valor: ErroApi['erro']): ErroApi => ({ erro: valor });

/**
 * Rotas de `/api`, nesta ordem: handler do Better Auth → trava (sessão e aceite de 18+) →
 * rotas → 404. Sem sessão nada responde; sem aceite de 18+ só o próprio aceite responde.
 */
export function createApi(deps: { auth: Auth; db: PostgresJsDatabase }): Hono {
  const api = new Hono();

  api.on(['GET', 'POST'], '/auth/*', (c) => deps.auth.handler(c.req.raw));

  // Daqui em diante tudo passa pela trava, que deixa a pessoa da sessão no contexto.
  const protegidas = new Hono<{ Variables: { pessoa: Pessoa } }>();

  protegidas.use('*', async (c, next) => {
    const sessao = await deps.auth.api.getSession({ headers: c.req.raw.headers });
    if (!sessao) {
      return c.json(erro('sem_sessao'), 401);
    }
    c.set('pessoa', { id: sessao.user.id, email: sessao.user.email, name: sessao.user.name });
    if (c.req.path === '/api/aceite-18') {
      return next();
    }
    if (!(await temAceite18(deps.db, sessao.user.id))) {
      return c.json(erro('aceite_18_pendente'), 403);
    }
    return next();
  });

  protegidas.post('/aceite-18', async (c) => {
    const corpo: unknown = await c.req.json().catch(() => null);
    if (!aceite18RequestSchema.safeParse(corpo).success) {
      return c.json(erro('pedido_invalido'), 400);
    }
    await registrarAceite18(deps.db, c.get('pessoa').id);
    return c.body(null, 204);
  });

  protegidas.get('/eu', (c) => {
    const pessoa = c.get('pessoa');
    const resposta: EuResponse = { pessoa: { id: pessoa.id, email: pessoa.email, nome: pessoa.name } };
    return c.json(resposta);
  });

  protegidas.all('*', (c) => c.json(erro('nao_encontrado'), 404));

  api.route('/', protegidas);

  return api;
}
