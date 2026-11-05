import { useMutation } from '@tanstack/react-query';
import { Navigate } from '@tanstack/react-router';
import { useState, type CSSProperties } from 'react';
import { pedirLink, useEu } from '../auth/sessao.ts';
import { LanguageToggle } from '../i18n/LanguageToggle.tsx';
import { useLocale } from '../i18n/LocaleProvider.tsx';

function order(i: number): CSSProperties {
  return { '--i': i } as CSSProperties;
}

function IconeEnvelope() {
  return (
    <svg className="envelope" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="5" y="11" width="38" height="26" rx="4" />
      <path d="M7 14l17 12 17-12" />
    </svg>
  );
}

export function EntrarPage({ erroDeLink }: { erroDeLink: boolean }) {
  const { t, locale } = useLocale();
  const eu = useEu();
  const [email, setEmail] = useState('');
  const pedido = useMutation({ mutationFn: (endereco: string) => pedirLink(endereco, locale) });

  if (eu.data?.estado === 'dentro') return <Navigate to="/" replace />;
  if (eu.data?.estado === 'aceite_pendente') return <Navigate to="/aceite-18" replace />;

  function enviar() {
    pedido.mutate(email.trim());
  }

  const enviado = pedido.isSuccess;

  return (
    <div className="home">
      <header className="top reveal" style={order(0)}>
        <p className="mark">
          Entre <b>Nós</b>
        </p>
        <LanguageToggle />
      </header>
      {enviado ? (
        <main className="hero" key="enviado">
          <span className="reveal" style={order(1)}>
            <IconeEnvelope />
          </span>
          <h1 className="reveal" style={order(1)}>
            {t('enviado.title')}
          </h1>
          <p className="lead reveal" style={order(2)}>
            {t('enviado.leadBefore')} <strong className="destino">{pedido.variables}</strong>. {t('enviado.leadAfter')}
          </p>
          <div className="reveal" style={order(3)}>
            <button type="button" className="ghost" onClick={() => pedido.reset()}>
              {t('enviado.other')}
            </button>
          </div>
        </main>
      ) : (
        <main className="hero" key="form">
          <span className="rule reveal" style={order(1)} aria-hidden="true" />
          <h1 className="reveal" style={order(1)}>
            {t('entrar.title')}
          </h1>
          <p className="lead reveal" style={order(2)}>
            {t('entrar.lead')}
          </p>
          {erroDeLink && (
            <p className="aviso reveal" style={order(2)} role="alert">
              {t('entrar.badLink')}
            </p>
          )}
          <form className="pedido reveal" style={order(3)} onSubmit={(e) => {
            e.preventDefault();
            enviar();
          }}>
            <label className="campo">
              <span className="campo-rotulo">{t('entrar.email')}</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button type="submit" className="primary" disabled={pedido.isPending}>
              {pedido.isPending ? t('entrar.sending') : t('entrar.submit')}
            </button>
          </form>
          {pedido.isError && (
            <p className="aviso" role="alert">
              {t('entrar.failed')}
            </p>
          )}
        </main>
      )}
    </div>
  );
}
