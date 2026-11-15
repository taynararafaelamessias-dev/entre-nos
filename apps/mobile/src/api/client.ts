import { API_PREFIX, type ApiClient } from '@entre-nos/contracts';
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { resolveServerUrl } from '../config/server-url.ts';

export function createApiClient(serverUrl: string, fetchImpl: typeof fetch = fetch): ApiClient {
  return createORPCClient(
    new RPCLink({ url: `${serverUrl}${API_PREFIX}`, fetch: (request, init) => fetchImpl(request, init) }),
  );
}

// Nome literal: o Expo troca `process.env.EXPO_PUBLIC_*` pelo valor na hora do bundle.
export const api = createApiClient(resolveServerUrl(process.env.EXPO_PUBLIC_SERVER_URL));
export const apiQuery = createTanstackQueryUtils(api);
