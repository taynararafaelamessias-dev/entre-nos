---
status: accepted
---
# A assinatura é da pessoa; só a parte a dois pede casal

Uma pessoa pode assinar sozinha, antes de o parceiro entrar, e o conteúdo libera na hora para ela.
A **parte a dois** (Esquentar a relação, compartilhado, diário das posições) só funciona com casal
formado. Quando o parceiro entra, herda a assinatura inteira. Se o casal acaba e a loja continua
renovando, o pagante continua com o que funciona sozinho e recebe um aviso claro com um botão para a
tela de assinaturas da loja. Decidido em 2026-11-15 pela pessoa que decide o produto, com a
experiência do usuário como critério. Muda o ADR 0006 e o ADR 0010.

## Considered Options
- **Só casal formado assina** (regra anterior): descartado, porque trava a conversão no fim do
  onboarding, que é o melhor momento dela, até o outro aceitar o convite.
- **Pagante sem casal volta para a parte gratuita** (ADR 0010): descartado, porque com a cobrança das
  lojas o servidor não consegue parar a renovação (ADR 0012), e a pessoa pagaria por nada.

## Consequences
- ADR 0006: "uma pessoa sem casal só tem a parte gratuita" passa a valer só para quem não assina.
  Quem assina sem casal tem a parte da assinatura menos a parte a dois.
- ADR 0010: o casal continua acabando quando alguém sai, e os dados do casal não passam para um casal
  novo. O que muda é o que acontece com a assinatura: ela não "para de se renovar". Quem decide é o
  pagante, na loja, e o app avisa e leva até lá.
- O onboarding vem antes de qualquer conta. A conta é pedida só ao convidar o parceiro, assinar ou
  guardar algo (App Store 5.1.1(v)).
