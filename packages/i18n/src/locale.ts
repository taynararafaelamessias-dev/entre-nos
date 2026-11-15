export type Locale = 'pt' | 'es';
export const LOCALES = ['pt', 'es'] as const;
export const LOCALE_STORAGE_KEY = 'entre-nos.locale';

function isLocale(value: string | null): value is Locale {
  return value === 'pt' || value === 'es';
}

export function resolveInitialLocale(stored: string | null, languages: readonly string[]): Locale {
  if (isLocale(stored)) return stored;
  const first = languages.map((language) => language.toLowerCase().slice(0, 2)).find(isLocale);
  return first ?? 'pt';
}
