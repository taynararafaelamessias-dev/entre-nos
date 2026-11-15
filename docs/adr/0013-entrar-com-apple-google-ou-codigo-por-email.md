---
status: accepted
---
# Entrar com Apple, Google ou código por e-mail

No celular, a pessoa entra com um toque pela Apple ou pelo Google, ou recebe um código de 6 dígitos
por e-mail que o teclado preenche sozinho. O e-mail também traz um link que abre o app. Continua sem
senha, como no ADR 0007, mas sem depender só do e-mail chegar e de o link abrir no lugar certo: no
celular, o link mágico abre no navegador do app de e-mail. O critério é a experiência de quem entra,
que a pessoa que decide o produto pôs como prioridade em 2026-11-15. Substitui o ADR 0007.

## Consequences
- Ao oferecer o Google, a App Store exige uma opção equivalente com e-mail privado (4.8), e o
  "Entrar com Apple" cumpre isso. Com o e-mail escondido da Apple, a conta não pode depender de um
  e-mail real.
- O e-mail continua saindo pelo Resend, com texto neutro.
- A sessão fica guardada no armazenamento seguro do aparelho, não num cookie.
