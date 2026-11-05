import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { sair, useEu } from '../auth/sessao.ts';
import { useHealth } from '../health/useHealth.ts';
import { useLocale } from '../i18n/LocaleProvider.tsx';
import { order, Topo } from './Topo.tsx';

type StatusState = 'checking' | 'up' | 'down';

export function HomePage() {
  const { t } = useLocale();
  const eu = useEu();
  const health = useHealth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const saida = useMutation({
    mutationFn: sair,
    onSettled: async () => {
      queryClient.clear();
      await navigate({ to: '/entrar', replace: true });
    },
  });

  if (eu.data?.estado === 'fora') return <Navigate to="/entrar" replace />;
  if (eu.data?.estado === 'aceite_pendente') return <Navigate to="/aceite-18" replace />;

  const state: StatusState = !health.data
    ? health.isError
      ? 'down'
      : 'checking'
    : health.data.postgres.status === 'up'
      ? 'up'
      : 'down';

  const statusText = { checking: t('health.checking'), up: t('health.up'), down: t('health.down') }[state];
  const pessoa = eu.data?.estado === 'dentro' ? eu.data.pessoa : null;

  return (
    <div className="home">
      <Topo>
        {pessoa && (
          <button type="button" className="ghost sair" onClick={() => saida.mutate()} disabled={saida.isPending}>
            {t('sair')}
          </button>
        )}
      </Topo>
      <main className="hero">
        <span className="rule reveal" style={order(1)} aria-hidden="true" />
        <h1 className="reveal" style={order(1)}>
          {t('home.title')}
        </h1>
        <p className="lead reveal" style={order(2)}>
          {t('home.lead')}
        </p>
        {pessoa && (
          <p className="quem reveal" style={order(3)}>
            <span>{t('home.signedInAs')}</span> <strong>{pessoa.email}</strong>
          </p>
        )}
        <p className="status reveal" style={order(4)} role="status" data-state={state}>
          {statusText}
        </p>
      </main>
    </div>
  );
}
