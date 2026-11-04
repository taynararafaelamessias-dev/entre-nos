import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translate, type MessageKey } from './dictionary.ts';
import { htmlLang, LOCALE_STORAGE_KEY, resolveInitialLocale, type Locale } from './locale.ts';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() =>
    resolveInitialLocale(localStorage.getItem(LOCALE_STORAGE_KEY), navigator.languages),
  );

  useEffect(() => {
    document.documentElement.lang = htmlLang(locale);
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: (key) => translate(locale, key) }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale deve ser usado dentro de LocaleProvider');
  return value;
}
