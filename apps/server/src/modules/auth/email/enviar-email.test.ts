import { describe, expect, it } from 'vitest';
import { criarEnvioResend, escolherEnvio, type MensagemDeEmail } from './enviar-email.ts';

const mensagem: MensagemDeEmail = {
  para: 'ana@example.com',
  assunto: 'Seu link para entrar',
  texto: 'Use este link para entrar: https://x.example/v?token=segredo',
  html: '<p>link</p>',
};

describe('criarEnvioResend', () => {
  it('manda o e-mail para a API do Resend com a chave no cabeçalho', async () => {
    const chamadas: { url: string; init: RequestInit }[] = [];
    const fetchFn = (async (url: string, init: RequestInit) => {
      chamadas.push({ url, init });
      return new Response('{"id":"1"}', { status: 200 });
    }) as typeof fetch;

    await criarEnvioResend('re_chave', 'Entre Nós <entrar@x.example>', fetchFn)(mensagem);

    expect(chamadas).toHaveLength(1);
    expect(chamadas[0]!.url).toBe('https://api.resend.com/emails');
    expect(chamadas[0]!.init.method).toBe('POST');
    const headers = new Headers(chamadas[0]!.init.headers);
    expect(headers.get('authorization')).toBe('Bearer re_chave');
    expect(headers.get('content-type')).toBe('application/json');
    expect(JSON.parse(String(chamadas[0]!.init.body))).toEqual({
      from: 'Entre Nós <entrar@x.example>',
      to: ['ana@example.com'],
      subject: 'Seu link para entrar',
      text: mensagem.texto,
      html: mensagem.html,
    });
  });

  it('falha com o status, sem vazar chave, endereço ou link', async () => {
    const fetchFn = (async () => new Response('erro re_chave', { status: 422 })) as unknown as typeof fetch;
    const envio = criarEnvioResend('re_chave', 'entrar@x.example', fetchFn);

    const erro = await envio(mensagem).then(
      () => null,
      (e: unknown) => e as Error,
    );
    expect(erro?.message).toBe('Resend respondeu 422');
    for (const segredo of ['re_chave', 'ana@example.com', 'segredo']) {
      expect(erro?.message).not.toContain(segredo);
    }
  });
});

describe('escolherEnvio', () => {
  it('usa o Resend quando há RESEND_API_KEY', () => {
    const escolha = escolherEnvio({ MAIL_FROM: 'a@x', RESEND_API_KEY: 're_1', SMTP_URL: 'smtp://h:1' });
    expect(escolha.via).toBe('resend');
  });

  it('usa SMTP quando só há SMTP_URL', () => {
    const escolha = escolherEnvio({ MAIL_FROM: 'a@x', SMTP_URL: 'smtp://127.0.0.1:1025' });
    expect(escolha.via).toBe('smtp');
  });

  it('sem nenhum dos dois, explica o que falta', () => {
    expect(() => escolherEnvio({ MAIL_FROM: 'a@x' })).toThrow(
      'defina RESEND_API_KEY (produção) ou SMTP_URL (dev)',
    );
  });

  it('exige MAIL_FROM', () => {
    expect(() => escolherEnvio({ SMTP_URL: 'smtp://h:1' })).toThrow('MAIL_FROM');
  });
});
