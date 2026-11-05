import type { Locale } from './locale.ts';

const pt = {
  'app.name': 'Entre Nós',
  'home.title': 'Só vocês dois.',
  'home.lead': 'O app do casal está sendo reconstruído.',
  'home.signedInAs': 'Você entrou como',
  'language.label': 'Idioma',
  'health.checking': 'Verificando o servidor…',
  'health.up': 'Servidor e banco de dados no ar.',
  'health.down': 'O banco de dados não está respondendo.',
  'entrar.title': 'Entre sem senha.',
  'entrar.lead': 'Digite seu e-mail e mandamos um link para você entrar.',
  'entrar.email': 'Seu e-mail',
  'entrar.submit': 'Receber link',
  'entrar.sending': 'Enviando…',
  'entrar.failed': 'Não deu para enviar o link agora. Tente de novo em instantes.',
  'entrar.badLink': 'Esse link venceu ou já foi usado. Peça um novo abaixo.',
  'enviado.title': 'Veja seu e-mail',
  'enviado.leadBefore': 'Mandamos um link para',
  'enviado.leadAfter': 'Ele vale por 10 minutos e funciona uma vez só.',
  'enviado.other': 'Usar outro e-mail',
  'aceite.title': 'Só para maiores de 18.',
  'aceite.lead': 'O Entre Nós é para adultos. Confirme uma vez e não perguntamos de novo.',
  'aceite.check': 'Tenho 18 anos ou mais',
  'aceite.submit': 'Entrar',
  'aceite.hint': 'Marque a confirmação para entrar.',
  'aceite.failed': 'Não deu para gravar agora. Tente de novo.',
  'sair': 'Sair',
} as const;

export type MessageKey = keyof typeof pt;

const es: Record<MessageKey, string> = {
  'app.name': 'Entre Nós',
  'home.title': 'Solo ustedes dos.',
  'home.lead': 'La app de la pareja se está reconstruyendo.',
  'home.signedInAs': 'Entraste como',
  'language.label': 'Idioma',
  'health.checking': 'Verificando el servidor…',
  'health.up': 'Servidor y base de datos en línea.',
  'health.down': 'La base de datos no responde.',
  'entrar.title': 'Entra sin clave.',
  'entrar.lead': 'Escribe tu correo y te enviamos un enlace para entrar.',
  'entrar.email': 'Tu correo',
  'entrar.submit': 'Recibir enlace',
  'entrar.sending': 'Enviando…',
  'entrar.failed': 'No pudimos enviar el enlace ahora. Inténtalo de nuevo en un momento.',
  'entrar.badLink': 'Ese enlace venció o ya se usó. Pide uno nuevo abajo.',
  'enviado.title': 'Revisa tu correo',
  'enviado.leadBefore': 'Enviamos un enlace a',
  'enviado.leadAfter': 'Vale por 10 minutos y funciona una sola vez.',
  'enviado.other': 'Usar otro correo',
  'aceite.title': 'Solo para mayores de 18.',
  'aceite.lead': 'Entre Nós es para adultos. Confírmalo una vez y no volvemos a preguntar.',
  'aceite.check': 'Tengo 18 años o más',
  'aceite.submit': 'Entrar',
  'aceite.hint': 'Marca la confirmación para entrar.',
  'aceite.failed': 'No pudimos guardarlo ahora. Inténtalo de nuevo.',
  'sair': 'Salir',
};

export const dictionary = { pt, es };

export function translate(locale: Locale, key: MessageKey): string {
  return dictionary[locale][key];
}
