---
status: accepted
---
# Cobrança nativa das lojas, sem Asaas

A assinatura do casal é vendida só pela cobrança das lojas: compra dentro do app no iOS e Google
Play Billing no Android. O servidor recebe as notificações das duas lojas e transforma cada uma numa
mudança da assinatura do domínio, que vale para o casal inteiro, inclusive para o parceiro que usa a
outra plataforma. Decidido em 2026-11-15 pela pessoa que decide o produto. Substitui o ADR 0008.

## Considered Options
Fontes lidas em 2026-11-15.
- **Asaas por link para a web**: descartado. No Brasil, a Apple cobra 15% sobre vendas feitas por
  oferta fora do app (10% em assinaturas depois do 1º ano), e na compra dentro do app cobra 10%
  para o Small Business Program mais 5% de processamento
  (developer.apple.com/support/app-distribution-in-brazil). Ou seja, o Asaas não economiza nada e
  ainda põe a pessoa num navegador. Além disso, uma assinatura comprada fora só libera o app se
  também estiver à venda dentro dele (3.1.3(b)).
- **Só Asaas**: impossível no iOS, pela mesma 3.1.3(b).

## Consequences
- O adaptador do ADR 0008 continua como desenho: o domínio só conhece a assinatura, e a camada que
  fala com as lojas fica atrás dele. Para começar, um agregador das duas lojas (RevenueCat é o
  candidato; preço não verificado) dentro desse adaptador.
- Saem do caminho o Asaas e as issues que dependiam dele (#8 e #14). O contador (#19) continua,
  porque a receita passa a vir da Apple e do Google.
- O servidor não consegue parar a renovação de uma assinatura das lojas: só a pessoa cancela na loja.
  Isso conflita com o ADR 0010 ("para de se renovar quando o casal acaba"), que precisa ser revisto.
- A App Review precisa de uma conta de demonstração com casal formado para testar a compra.
