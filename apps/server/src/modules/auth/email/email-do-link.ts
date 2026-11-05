/** Quanto tempo o link mágico vale. O texto do e-mail promete isso; mude os dois juntos. */
export const VALIDADE_DO_LINK_SEGUNDOS = 600;

export type LocaleDoEmail = 'pt' | 'es';

export type EmailDoLink = { assunto: string; texto: string; html: string };

// Texto neutro de propósito: o e-mail pode ser lido por cima do ombro ou numa notificação,
// então não diz nada sobre o que o app é nem sobre quem usa.
const TEXTOS = {
  pt: {
    assunto: 'Seu link para entrar',
    chamada: 'Use este link para entrar:',
    botao: 'Entrar',
    validade: 'Ele vale por 10 minutos e funciona uma vez só.',
    ignore: 'Se não foi você que pediu, ignore este e-mail.',
  },
  es: {
    assunto: 'Tu enlace para entrar',
    chamada: 'Usa este enlace para entrar:',
    botao: 'Entrar',
    validade: 'Vale por 10 minutos y funciona una sola vez.',
    ignore: 'Si no lo pediste tú, ignora este correo.',
  },
} as const satisfies Record<LocaleDoEmail, Record<string, string>>;

function escaparHtml(valor: string): string {
  return valor
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function emailDoLink(locale: LocaleDoEmail, url: string): EmailDoLink {
  const t = TEXTOS[locale];
  const texto = `${t.chamada}\n${url}\n\n${t.validade}\n${t.ignore}\n`;
  const link = escaparHtml(url);
  const html = [
    '<!doctype html>',
    `<html lang="${locale === 'pt' ? 'pt-BR' : 'es'}"><body style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5;color:#222">`,
    `<p>${t.chamada}</p>`,
    `<p><a href="${link}" style="display:inline-block;padding:12px 24px;border-radius:8px;background:#222;color:#fff;text-decoration:none">${t.botao}</a></p>`,
    `<p style="font-size:14px;color:#555;word-break:break-all">${link}</p>`,
    `<p>${t.validade}<br>${t.ignore}</p>`,
    '</body></html>',
  ].join('\n');
  return { assunto: t.assunto, texto, html };
}
