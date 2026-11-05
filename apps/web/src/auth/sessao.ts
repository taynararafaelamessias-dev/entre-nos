import { euResponseSchema, type EuResponse } from '@entre-nos/contracts';
import { useQuery } from '@tanstack/react-query';
import type { Locale } from '../i18n/locale.ts';

export type Eu =
  | { estado: 'dentro'; pessoa: EuResponse['pessoa'] }
  | { estado: 'fora' }
  | { estado: 'aceite_pendente' };

export const EU_QUERY_KEY = ['eu'] as const;

const json = { 'Content-Type': 'application/json' };

/** Pede o link mágico. O e-mail sai no idioma da tela; link ruim volta para `/entrar?erro=link`. */
export async function pedirLink(email: string, locale: Locale): Promise<void> {
  const res = await fetch('/api/auth/sign-in/magic-link', {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ email, callbackURL: '/', errorCallbackURL: '/entrar?erro=link', metadata: { locale } }),
  });
  if (!res.ok) throw new Error(`pedir link: ${res.status}`);
}

export async function aceitar18(): Promise<void> {
  const res = await fetch('/api/aceite-18', { method: 'POST', headers: json, body: JSON.stringify({ tenho18: true }) });
  if (!res.ok) throw new Error(`aceite de 18+: ${res.status}`);
}

export async function sair(): Promise<void> {
  const res = await fetch('/api/auth/sign-out', { method: 'POST', headers: json, body: '{}' });
  if (!res.ok) throw new Error(`sair: ${res.status}`);
}

async function buscarEu(): Promise<Eu> {
  const res = await fetch('/api/eu');
  if (res.status === 401) return { estado: 'fora' };
  if (res.status === 403) return { estado: 'aceite_pendente' };
  if (!res.ok) throw new Error(`quem sou eu: ${res.status}`);
  return { estado: 'dentro', pessoa: euResponseSchema.parse(await res.json()).pessoa };
}

export function useEu() {
  return useQuery<Eu>({ queryKey: EU_QUERY_KEY, queryFn: buscarEu, retry: false, staleTime: 30_000 });
}
