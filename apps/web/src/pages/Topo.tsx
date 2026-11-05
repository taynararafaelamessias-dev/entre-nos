import type { CSSProperties, ReactNode } from 'react';
import { LanguageToggle } from '../i18n/LanguageToggle.tsx';

/** Posição do bloco no stagger do `.reveal` (lida pelo CSS como `--i`). */
export function order(i: number): CSSProperties {
  return { '--i': i } as CSSProperties;
}

/** Barra do topo das telas: a marca, o seletor de idioma e as ações extras da tela. */
export function Topo({ children }: { children?: ReactNode }) {
  return (
    <header className="top reveal" style={order(0)}>
      <p className="mark">
        Entre <b>Nós</b>
      </p>
      <div className="top-acoes">
        <LanguageToggle />
        {children}
      </div>
    </header>
  );
}
