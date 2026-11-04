import { describe, expect, it } from 'vitest';
import { dictionary } from './dictionary.ts';
import { htmlLang, resolveInitialLocale } from './locale.ts';

describe('resolveInitialLocale', () => {
  it('prefere o idioma guardado', () => {
    expect(resolveInitialLocale('es', ['pt-BR'])).toBe('es');
  });
  it('usa espanhol quando o navegador pede espanhol', () => {
    expect(resolveInitialLocale(null, ['es-AR', 'pt'])).toBe('es');
  });
  it('cai para português em outros idiomas', () => {
    expect(resolveInitialLocale(null, ['en-US'])).toBe('pt');
  });
  it('ignora valor guardado inválido', () => {
    expect(resolveInitialLocale('fr', [])).toBe('pt');
  });
});

describe('htmlLang', () => {
  it('mapeia cada idioma', () => {
    expect(htmlLang('pt')).toBe('pt-BR');
    expect(htmlLang('es')).toBe('es');
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
