import { type Locale, type MessageKey, resolveInitialLocale, translate } from '@entre-nos/i18n';
import { getLocales } from 'expo-localization';
import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() =>
    resolveInitialLocale(
      null,
      getLocales().map((l) => l.languageTag),
    ),
  );
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: (key) => translate(locale, key) }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale precisa estar dentro de LocaleProvider');
  return value;
}
