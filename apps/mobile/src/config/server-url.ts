export const DEFAULT_SERVER_URL = 'http://localhost:3000';

export function resolveServerUrl(raw: string | undefined): string {
  const value = (raw ?? '').trim();
  if (value === '') return DEFAULT_SERVER_URL;
  if (!/^https?:\/\/[^\s/]+/.test(value)) throw new Error('EXPO_PUBLIC_SERVER_URL inválida: ' + raw);
  return value.replace(/\/+$/, '');
}
