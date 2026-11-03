# Cobrança atrás de um adaptador; Asaas no Brasil

O domínio só conhece a **assinatura** do casal; cada provedor de pagamento é um adaptador que cria o
checkout e traduz os webhooks dele em mudanças de assinatura. No Brasil o provedor é o **Asaas**.
Fizemos assim porque o conteúdo do app cai nas listas de conteúdo adulto de vários provedores, e
trocar de provedor tem que custar um adaptador, não uma reescrita.

## Considered Options
Fontes lidas em 2026-11-03.
- **Stripe**: descartado. Proíbe *"businesses that sell or offer adult content"* (FAQ de negócios
  proibidos, support.stripe.com). Paddle e Lemon Squeezy proíbem o mesmo.
- **Hotmart** (§4.13 proíbe cenas explícitas de atos sexuais) e **Mercado Pago** (proíbe conteúdo
  pornográfico): risco alto para posições ilustradas.
- **Pagar.me** e **Kiwify** (exceção para conteúdo educativo): alternativas no Brasil.
- **Processadoras adultas internacionais** (CCBill, Epoch, Segpay, Verotel): pelas páginas lidas,
  exigem empresa nos EUA ou na UE (Epoch: *"merchants must be within either the US or EU region"*;
  CCBill: *"incorporated in a supported region"*).

## Consequences
- A operação começa só no Brasil, cobrando em BRL. O provedor para fora do Brasil é uma decisão
  futura e entra como um segundo adaptador.
- Recomendação, a confirmar pela pessoa que decide o produto: o Asaas confirma por escrito que aceita o segmento
  antes do primeiro cliente real. Os termos dele falam de *"obscene or indecent imagery and
  language"* (trecho de busca; a página não abriu).
