import { useLocale } from './LocaleProvider.tsx';
import { LOCALES } from './locale.ts';

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div role="group" className="lang" aria-label={t('language.label')}>
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={locale === option}
          onClick={() => setLocale(option)}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
