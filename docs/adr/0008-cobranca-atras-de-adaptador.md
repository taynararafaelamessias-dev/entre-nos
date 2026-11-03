# Cobrança atrás de um adaptador; Asaas no Brasil

O domínio só conhece a **assinatura** do casal (situação, plano, validade). Cada provedor de
pagamento é um adaptador que cria o checkout e traduz os webhooks dele em mudanças de assinatura.
No Brasil o provedor é o **Asaas**. Fizemos assim porque o conteúdo do app (posições ilustradas,
brinquedos, BDSM) cai nas listas de conteúdo adulto de vários provedores, e o provedor pode recusar
ou encerrar a conta: trocar de provedor tem que custar um adaptador, não uma reescrita.

## Considered Options
Fontes lidas em 2026-11-03.
- **Stripe**: descartado. Proíbe *"businesses that sell or offer adult content"* (FAQ de negócios
  proibidos, support.stripe.com). Paddle e Lemon Squeezy proíbem o mesmo.
- **Hotmart** (§4.13 proíbe cenas explícitas de atos sexuais) e **Mercado Pago** (proíbe conteúdo
  pornográfico): risco alto para posições ilustradas.
- **Pagar.me** e **Kiwify** (exceção para conteúdo educativo): alternativas se o Asaas recusar.
- **Processadoras adultas internacionais** (CCBill, Epoch, Segpay, Verotel): exigem empresa nos EUA
  ou na UE (Epoch: *"merchants must be within either the US or EU region"*; CCBill: *"incorporated
  in a supported region"*). Ficam para quando houver empresa na UE.

## Consequences
- Antes do primeiro cliente real, o Asaas confirma por escrito que aceita o segmento. Os termos dele
  falam de *"obscene or indecent imagery and language"* (trecho de busca; a página não abriu).
- A operação começa só no Brasil, cobrando em BRL. O provedor para fora do Brasil é uma decisão
  futura e entra como um segundo adaptador.
