---
status: proposed
---
# Camada Picante na assinatura, atrás de três portas

O app ganha uma camada de conteúdo mais forte, a **camada Picante**: o jogo Posições, um nível Picante
nos jogos e no Conversar (bilhetes e foto surpresa). Ela só aparece quando três condições valem ao
mesmo tempo: a pessoa tem assinatura, confirmou 18+, e **os dois** aceitaram o nível nos Limites.
Posições são mostradas por figuras estilizadas em silhueta (homem e mulher, sem anatomia nem nudez),
nunca por foto ou desenho gráfico. A foto surpresa sugere o clima da foto por uma carta-tema e nunca
pede nudez ou parte do corpo; o que o casal manda é escolha dele, e a foto some depois de vista.
Proposto em 2026-11-19. Revê a regra "sem posições ilustradas" do ADR 0011, que segue valendo para
todo o resto (a parte gratuita e a parte da assinatura fora da camada Picante continuam não explícitas).

## Considered Options
- **Manter tudo não explícito (ADR 0011 puro)**: descartado pela pessoa que decide o produto, que quer
  conteúdo mais forte no plano pago.
- **Conteúdo forte fora da loja (APK + pagamento externo)**: descartado. Não existe no iOS e o ADR 0012
  fixa a cobrança nas lojas.
- **Camada Picante dentro da loja, com portas e estilização**: escolhida.

## Evidência e risco
- O dono informou em 2026-11-19 que o Heat Game tem, na versão da App Store, um jogo de posições com
  figuras escuras de homem e mulher, e que já pagou por ele. Não verificamos a revisão da Apple sobre esse
  app; o ADR 0011 já avisa que um app parecido aprovado não é precedente.
- O Google Play lista *"sexually suggestive poses"* entre as violações (support.google.com/googleplay/android-developer/answer/9878810,
  lido em 2026-11-15), e a App Store 1.1.4 barra *"explicit … sexual activities"*. A estilização e as
  portas reduzem o risco, mas não o eliminam.

## Consequences
- O envio de validação à App Review previsto no ADR 0011 passa a incluir uma amostra da camada Picante.
  O catálogo picante só é produzido depois do resultado.
- A foto surpresa entra na regra de moderação: denúncia de imagem pelo parceiro e retenção mínima.
  O app não promete "print bloqueado" no iOS, onde só dá para detectar o print (a confirmar na construção).
- Classificação etária 18+ e as declarações de conteúdo das duas lojas refletem a camada Picante.
- As telas no Doop (Jogos, Conversar, Assinatura) mostram as três portas e o estado travado de cada uma.
