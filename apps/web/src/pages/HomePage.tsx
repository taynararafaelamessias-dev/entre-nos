import { useHealth } from '../health/useHealth.ts';
import { LanguageToggle } from '../i18n/LanguageToggle.tsx';
import { useLocale } from '../i18n/LocaleProvider.tsx';

export function HomePage() {
  const { t } = useLocale();
  const health = useHealth();

  const statusText = !health.data
    ? health.isError
      ? t('health.down')
      : t('health.checking')
    : health.data.postgres.status === 'up'
      ? t('health.up')
      : t('health.down');

  return (
    <main>
      <LanguageToggle />
      <h1>{t('home.title')}</h1>
      <p>{t('home.lead')}</p>
      <p role="status">{statusText}</p>
    </main>
  );
}
