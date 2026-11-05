import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { linkMagico, pessoa, sessao, vinculoDeLogin } from '../../db/schema.ts';
import { emailDoLink, VALIDADE_DO_LINK_SEGUNDOS } from './email/email-do-link.ts';
import type { EnviarEmail } from './email/enviar-email.ts';

const UM_DIA_SEGUNDOS = 60 * 60 * 24;

export type AuthDeps = {
  db: PostgresJsDatabase;
  baseURL: string;
  secret: string;
  enviarEmail: EnviarEmail;
};

/**
 * Better Auth só com link mágico (sem senha, ADR 0007). Os modelos do Better Auth caem nas
 * tabelas do domínio: user → pessoa, session → sessao, account → vinculo_de_login,
 * verification → link_magico. O link vale 10 min e uma vez só; a sessão vale 7 dias e é
 * renovada uma vez por dia de uso.
 */
export function createAuth(deps: AuthDeps) {
  return betterAuth({
    baseURL: deps.baseURL,
    secret: deps.secret,
    trustedOrigins: [deps.baseURL],
    database: drizzleAdapter(deps.db, {
      provider: 'pg',
      schema: { user: pessoa, session: sessao, account: vinculoDeLogin, verification: linkMagico },
    }),
    session: {
      expiresIn: 7 * UM_DIA_SEGUNDOS,
      updateAge: UM_DIA_SEGUNDOS,
    },
    advanced: { cookiePrefix: 'entre-nos' },
    plugins: [
      magicLink({
        expiresIn: VALIDADE_DO_LINK_SEGUNDOS,
        storeToken: 'hashed',
        sendMagicLink: async ({ email, url, metadata }) => {
          const locale = metadata?.locale === 'es' ? 'es' : 'pt';
          await deps.enviarEmail({ para: email, ...emailDoLink(locale, url) });
        },
      }),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
