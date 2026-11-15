import { describe, expect, it } from 'vitest';
import { DEFAULT_SERVER_URL, resolveServerUrl } from './server-url.ts';

describe('resolveServerUrl', () => {
  it('usa o endereço padrão quando a variável não existe', () => {
    expect(resolveServerUrl(undefined)).toBe(DEFAULT_SERVER_URL);
  });

  it('usa o endereço padrão quando a variável é só espaço', () => {
    expect(resolveServerUrl('  ')).toBe(DEFAULT_SERVER_URL);
  });

  it('tira a barra final do endereço', () => {
    expect(resolveServerUrl('http://192.168.0.10:3000/')).toBe('http://192.168.0.10:3000');
  });

  it('recusa endereço sem protocolo', () => {
    expect(() => resolveServerUrl('servidor:3000')).toThrow('EXPO_PUBLIC_SERVER_URL inválida: servidor:3000');
  });

  it('recusa protocolo que não é http nem https', () => {
    expect(() => resolveServerUrl('ftp://x')).toThrow('EXPO_PUBLIC_SERVER_URL inválida: ftp://x');
  });
});
