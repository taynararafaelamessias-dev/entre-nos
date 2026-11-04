import type { CSSProperties } from 'react';
import { useHealth } from '../health/useHealth.ts';
import { LanguageToggle } from '../i18n/LanguageToggle.tsx';
import { useLocale } from '../i18n/LocaleProvider.tsx';

type StatusState = 'checking' | 'up' | 'down';

function order(i: number): CSSProperties {
  return { '--i': i } as CSSProperties;
}

export function HomePage() {
  const { t } = useLocale();
  const health = useHealth();

  const state: StatusState = !health.data
    ? health.isError
      ? 'down'
      : 'checking'
    : health.data.postgres.status === 'up'
      ? 'up'
      : 'down';

  const statusText = { checking: t('health.checking'), up: t('health.up'), down: t('health.down') }[state];

  return (
    <div className="home">
      <header className="top reveal" style={order(0)}>
        <p className="mark">
          Entre <b>Nós</b>
        </p>
        <LanguageToggle />
      </header>
      <main className="hero">
        <span className="rule reveal" style={order(1)} aria-hidden="true" />
        <h1 className="reveal" style={order(1)}>
          {t('home.title')}
        </h1>
        <p className="lead reveal" style={order(2)}>
          {t('home.lead')}
        </p>
        <p className="status reveal" style={order(3)} role="status" data-state={state}>
          {statusText}
        </p>
      </main>
    </div>
  );
}
