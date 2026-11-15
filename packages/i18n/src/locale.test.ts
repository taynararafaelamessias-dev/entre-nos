import { describe, expect, it } from 'vitest';
import { dictionary, resolveInitialLocale, translate } from './index.ts';

describe('resolveInitialLocale', () => {
  it('prefere o idioma guardado', () => {
    expect(resolveInitialLocale('es', ['pt-BR'])).toBe('es');
  });
  it('usa espanhol quando o aparelho pede espanhol', () => {
    expect(resolveInitialLocale(null, ['es-AR', 'pt'])).toBe('es');
  });
  it('segue o primeiro idioma suportado da lista do aparelho', () => {
    expect(resolveInitialLocale(null, ['pt-BR', 'es-ES'])).toBe('pt');
    expect(resolveInitialLocale(null, ['en-US', 'es-MX', 'pt'])).toBe('es');
  });
  it('cai para português em outros idiomas', () => {
    expect(resolveInitialLocale(null, ['en-US'])).toBe('pt');
  });
  it('ignora valor guardado inválido', () => {
    expect(resolveInitialLocale('fr', [])).toBe('pt');
  });
});

describe('dictionary', () => {
  it('pt e es têm as mesmas chaves e nenhum valor vazio', () => {
    expect(Object.keys(dictionary.es)).toEqual(Object.keys(dictionary.pt));
    for (const locale of ['pt', 'es'] as const) {
      for (const value of Object.values(dictionary[locale])) {
        expect(value).not.toBe('');
      }
    }
  });
});

describe('translate', () => {
  it('traduz a falha de conexão com o servidor em espanhol', () => {
    expect(translate('es', 'health.unreachable')).toBe('No se pudo conectar con el servidor.');
  });
  it('traduz a falha de conexão com o servidor em português', () => {
    expect(translate('pt', 'health.unreachable')).toBe('Não foi possível falar com o servidor.');
  });
});
