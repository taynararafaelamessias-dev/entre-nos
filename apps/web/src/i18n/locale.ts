export type Locale = 'pt' | 'es';
export const LOCALES = ['pt', 'es'] as const;
export const LOCALE_STORAGE_KEY = 'entre-nos.locale';

function isLocale(value: string | null): value is Locale {
  return value === 'pt' || value === 'es';
}

export function resolveInitialLocale(stored: string | null, languages: readonly string[]): Locale {
  if (isLocale(stored)) return stored;
  const first = languages.find((language) => language.toLowerCase().startsWith('es'));
  return first ? 'es' : 'pt';
}

export function htmlLang(locale: Locale): 'pt-BR' | 'es' {
  return locale === 'es' ? 'es' : 'pt-BR';
}
