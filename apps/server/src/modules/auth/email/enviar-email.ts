import { createTransport } from 'nodemailer';

export type MensagemDeEmail = { para: string; assunto: string; texto: string; html: string };

export type EnviarEmail = (mensagem: MensagemDeEmail) => Promise<void>;

/** Dev e testes: SMTP para o capturador local (serviço `mail` do compose). */
export function criarEnvioSmtp(smtpUrl: string, remetente: string): EnviarEmail {
  const transporte = createTransport(smtpUrl);
  return async (m) => {
    await transporte.sendMail({ from: remetente, to: m.para, subject: m.assunto, text: m.texto, html: m.html });
  };
}

/** Produção: API HTTP do Resend. O erro nunca carrega a chave, o endereço nem o link. */
export function criarEnvioResend(apiKey: string, remetente: string, fetchFn: typeof fetch = fetch): EnviarEmail {
  return async (m) => {
    const resposta = await fetchFn('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: remetente, to: [m.para], subject: m.assunto, text: m.texto, html: m.html }),
    });
    if (!resposta.ok) {
      throw new Error(`Resend respondeu ${resposta.status}`);
    }
  };
}

export type EnvioEscolhido = EnviarEmail & { via: 'resend' | 'smtp' };

/** Resend quando há chave (produção); senão SMTP (dev). Sem nenhum dos dois, não sobe. */
export function escolherEnvio(env: Record<string, string | undefined>): EnvioEscolhido {
  const remetente = env.MAIL_FROM;
  if (!remetente) {
    throw new Error('defina MAIL_FROM (remetente dos e-mails)');
  }
  if (env.RESEND_API_KEY) {
    return Object.assign(criarEnvioResend(env.RESEND_API_KEY, remetente), { via: 'resend' as const });
  }
  if (env.SMTP_URL) {
    return Object.assign(criarEnvioSmtp(env.SMTP_URL, remetente), { via: 'smtp' as const });
  }
  throw new Error('defina RESEND_API_KEY (produção) ou SMTP_URL (dev)');
}
