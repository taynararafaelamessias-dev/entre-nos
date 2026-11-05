import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// Tabelas do Better Auth (formato do schema pg gerado pela CLI 1.7), com os nomes do domínio.
// O adapter mapeia user → pessoa, session → sessao, account → vinculoDeLogin,
// verification → linkMagico. Sem RLS de propósito: o Better Auth lê sessão e pessoa por token
// antes de saber quem é a pessoa (RLS chega com as tabelas do casal).

export const pessoa = pgTable('pessoa', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const sessao = pgTable(
  'sessao',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => pessoa.id, { onDelete: 'cascade' }),
  },
  (table) => [index('sessao_userId_idx').on(table.userId)],
);

// Fica vazia (só link mágico, sem senha nem OAuth); existe para o adapter nunca sentir falta do modelo.
export const vinculoDeLogin = pgTable(
  'vinculo_de_login',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => pessoa.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('vinculo_de_login_userId_idx').on(table.userId)],
);

export const linkMagico = pgTable(
  'link_magico',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('link_magico_identifier_idx').on(table.identifier)],
);

// Aceite de 18+: uma linha por pessoa, com o momento do primeiro aceite.
export const aceite18 = pgTable('aceite_18', {
  pessoaId: text('pessoa_id')
    .primaryKey()
    .references(() => pessoa.id, { onDelete: 'cascade' }),
  aceitoEm: timestamp('aceito_em', { withTimezone: true }).defaultNow().notNull(),
});
