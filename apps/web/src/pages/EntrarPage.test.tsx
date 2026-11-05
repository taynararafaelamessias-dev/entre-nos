import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../i18n/LocaleProvider.tsx';
import { LOCALE_STORAGE_KEY } from '../i18n/locale.ts';
import { criarRouter } from '../router.tsx';

type Chamada = { url: string; init?: RequestInit };

function stubFetch(chamadas: Chamada[]) {
  vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
    chamadas.push({ url, init });
    if (url === '/api/eu') return new Response('{"erro":"sem_sessao"}', { status: 401 });
    if (url === '/api/auth/sign-in/magic-link') return new Response('{"status":true}', { status: 200 });
    return new Response('{}', { status: 404 });
  });
}

function renderEm(caminho: string) {
  const router = criarRouter(createMemoryHistory({ initialEntries: [caminho] }));
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <LocaleProvider>
        <RouterProvider router={router} />
      </LocaleProvider>
    </QueryClientProvider>,
  );
}

describe('EntrarPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('em PT: pede o link com o locale e mostra "Veja seu e-mail"', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'pt');
    const chamadas: Chamada[] = [];
    stubFetch(chamadas);
    renderEm('/entrar');

    fireEvent.change(await screen.findByLabelText('Seu e-mail'), { target: { value: 'ana@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Receber link' }));

    expect(await screen.findByRole('heading', { name: 'Veja seu e-mail' })).toBeTruthy();
    expect(screen.getByText(/ana@example\.com/)).toBeTruthy();
    const pedido = chamadas.find((c) => c.url === '/api/auth/sign-in/magic-link');
    expect(pedido?.init?.method).toBe('POST');
    expect(JSON.parse(String(pedido?.init?.body))).toEqual({
      email: 'ana@example.com',
      callbackURL: '/',
      errorCallbackURL: '/entrar?erro=link',
      metadata: { locale: 'pt' },
    });
  });

  it('em ES: pede o link com locale es e mostra o título em espanhol', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'es');
    const chamadas: Chamada[] = [];
    stubFetch(chamadas);
    renderEm('/entrar');

    fireEvent.change(await screen.findByLabelText('Tu correo'), { target: { value: 'eva@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Recibir enlace' }));

    expect(await screen.findByRole('heading', { name: 'Revisa tu correo' })).toBeTruthy();
    const pedido = chamadas.find((c) => c.url === '/api/auth/sign-in/magic-link');
    expect(JSON.parse(String(pedido?.init?.body)).metadata).toEqual({ locale: 'es' });
  });

  it('link vencido ou usado: avisa e deixa pedir outro', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'pt');
    stubFetch([]);
    renderEm('/entrar?erro=link&error=INVALID_TOKEN');

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByText(/venceu ou já foi usado/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Receber link' })).toBeTruthy();
  });

  it('sem sessão, a raiz manda para a tela de entrada', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'pt');
    stubFetch([]);
    renderEm('/');

    expect(await screen.findByLabelText('Seu e-mail')).toBeTruthy();
  });
});
