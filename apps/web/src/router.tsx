import { createRootRoute, createRoute, createRouter, Outlet, type RouterHistory } from '@tanstack/react-router';
import { Aceite18Page } from './pages/Aceite18Page.tsx';
import { EntrarPage } from './pages/EntrarPage.tsx';
import { HomePage } from './pages/HomePage.tsx';

const rootRoute = createRootRoute({ component: Outlet });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const entrarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entrar',
  // Link mágico vencido ou já usado volta com `?erro=link` (o Better Auth ainda soma `error=`).
  validateSearch: (search: Record<string, unknown>): { erro?: 'link' } =>
    search.erro === 'link' ? { erro: 'link' } : {},
  component: function EntrarRota() {
    return <EntrarPage erroDeLink={entrarRoute.useSearch().erro === 'link'} />;
  },
});

const aceite18Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/aceite-18',
  component: Aceite18Page,
});

const routeTree = rootRoute.addChildren([homeRoute, entrarRoute, aceite18Route]);

export function criarRouter(history?: RouterHistory) {
  return createRouter({ routeTree, ...(history ? { history } : {}) });
}

export const router = criarRouter();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
