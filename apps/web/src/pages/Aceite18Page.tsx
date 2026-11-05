import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { useState, type CSSProperties } from 'react';
import { aceitar18, EU_QUERY_KEY, useEu } from '../auth/sessao.ts';
import { LanguageToggle } from '../i18n/LanguageToggle.tsx';
import { useLocale } from '../i18n/LocaleProvider.tsx';

function order(i: number): CSSProperties {
  return { '--i': i } as CSSProperties;
}

export function Aceite18Page() {
  const { t } = useLocale();
  const eu = useEu();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [marcado, setMarcado] = useState(false);
  const aceite = useMutation({
    mutationFn: aceitar18,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: EU_QUERY_KEY });
      await navigate({ to: '/', replace: true });
    },
  });

  if (eu.data?.estado === 'fora') return <Navigate to="/entrar" replace />;
  if (eu.data?.estado === 'dentro') return <Navigate to="/" replace />;

  function enviar() {
    if (marcado) aceite.mutate();
  }

  return (
    <div className="home">
      <header className="top reveal" style={order(0)}>
        <p className="mark">
          Entre <b>Nós</b>
        </p>
        <LanguageToggle />
      </header>
      <main className="hero">
        <span className="selo reveal" style={order(1)} aria-hidden="true">
          18+
        </span>
        <h1 className="reveal" style={order(1)}>
          {t('aceite.title')}
        </h1>
        <p className="lead reveal" style={order(2)}>
          {t('aceite.lead')}
        </p>
        <form className="aceite reveal" style={order(3)} onSubmit={(e) => {
            e.preventDefault();
            enviar();
          }}>
          <label className="confirma">
            <input type="checkbox" checked={marcado} onChange={(e) => setMarcado(e.target.checked)} />
            <span className="caixa" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <span>{t('aceite.check')}</span>
          </label>
          <button
            type="submit"
            className="primary"
            disabled={!marcado || aceite.isPending}
            aria-describedby={marcado ? undefined : 'aceite-dica'}
          >
            {t('aceite.submit')}
          </button>
          {/* A dica some ao marcar, mas guarda o lugar: o bloco não pula no celular. */}
          <p id="aceite-dica" className="dica" aria-hidden={marcado} style={{ visibility: marcado ? 'hidden' : 'visible' }}>
            {t('aceite.hint')}
          </p>
        </form>
        {aceite.isError && (
          <p className="aviso" role="alert">
            {t('aceite.failed')}
          </p>
        )}
      </main>
    </div>
  );
}
