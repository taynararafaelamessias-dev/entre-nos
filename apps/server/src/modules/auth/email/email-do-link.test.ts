import { describe, expect, it } from 'vitest';
import { emailDoLink, VALIDADE_DO_LINK_SEGUNDOS } from './email-do-link.ts';

const url = 'https://entre-nos.example/api/auth/magic-link/verify?token=abc&callbackURL=%2F';

// Quem vê a caixa de entrada por cima do ombro não pode descobrir do que o app trata.
const PALAVRAS_PROIBIDAS = ['casal', 'sexo', 'íntim', 'intim', 'desejo', 'bdsm', 'posição', 'pareja'];

describe('emailDoLink', () => {
  it('o link vale 10 minutos', () => {
    expect(VALIDADE_DO_LINK_SEGUNDOS).toBe(600);
  });

  it('em português: assunto neutro, texto com o link, validade e uso único', () => {
    const email = emailDoLink('pt', url);
    expect(email.assunto).toBe('Seu link para entrar');
    expect(email.texto).toContain(url);
    expect(email.texto).toContain('10 minutos');
    expect(email.texto).toContain('uma vez só');
  });

  it('em espanhol: assunto neutro, texto com o link, validade e uso único', () => {
    const email = emailDoLink('es', url);
    expect(email.assunto).toBe('Tu enlace para entrar');
    expect(email.texto).toContain(url);
    expect(email.texto).toContain('10 minutos');
    expect(email.texto).toContain('una sola vez');
  });

  it.each(['pt', 'es'] as const)('em %s não expõe nada do conteúdo do app', (locale) => {
    const email = emailDoLink(locale, url);
    const tudo = `${email.assunto}\n${email.texto}\n${email.html}`.toLowerCase();
    for (const palavra of PALAVRAS_PROIBIDAS) {
      expect(tudo).not.toContain(palavra);
    }
  });

  it('o HTML escapa o link', () => {
    const email = emailDoLink('pt', 'https://x.example/v?a=1&b="2"<script>');
    expect(email.html).toContain('a=1&amp;b=&quot;2&quot;&lt;script&gt;');
    expect(email.html).not.toContain('<script>');
  });
});
