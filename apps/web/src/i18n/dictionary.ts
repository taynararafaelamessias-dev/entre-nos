import type { Locale } from './locale.ts';

const pt = {
  'app.name': 'Entre Nós',
  'home.title': 'Só vocês dois.',
  'home.lead': 'O app do casal está sendo reconstruído.',
  'language.label': 'Idioma',
  'health.checking': 'Verificando o servidor…',
  'health.up': 'Servidor e banco de dados no ar.',
  'health.down': 'O banco de dados não está respondendo.',
} as const;

export type MessageKey = keyof typeof pt;

const es: Record<MessageKey, string> = {
  'app.name': 'Entre Nós',
  'home.title': 'Solo ustedes dos.',
  'home.lead': 'La app de la pareja se está reconstruyendo.',
  'language.label': 'Idioma',
  'health.checking': 'Verificando el servidor…',
  'health.up': 'Servidor y base de datos en línea.',
  'health.down': 'La base de datos no responde.',
};

export const dictionary = { pt, es };

export function translate(locale: Locale, key: MessageKey): string {
  return dictionary[locale][key];
}
