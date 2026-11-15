---
status: accepted
---
# App nativo nas lojas (Android e iOS), com conteúdo não explícito

O app do casal deixa de ser web/PWA e passa a ser um app nativo em React Native, publicado na App
Store e no Google Play. Para caber nas regras das lojas, o conteúdo é redesenhado sem nada explícito:
ilustrações estilizadas e cobertas, foco em educação e bem-estar, BDSM tratado como segurança e
conversa. É o mesmo produto do ADR 0001, com o mesmo glossário, numa interface nova pensada para
celular. Decidido em 2026-11-15. Substitui o ADR 0009.

## Considered Options
Fontes lidas em 2026-11-15.
- **Manter o conteúdo explícito e passar pela revisão**: descartado. App Store 1.1.4 proíbe
  *"explicit descriptions or displays of sexual organs or activities intended to stimulate erotic
  rather than aesthetic or emotional feelings"*, sem exceção para educação sexual
  (developer.apple.com/app-store/review/guidelines). O Google Play lista como violação
  *"illustrations of sex acts, or sexually suggestive poses"*, e a exceção educativa cobre só nudez
  (support.google.com/googleplay/android-developer/answer/9878810). Esconder conteúdo do revisor
  viola a 2.3.1.
- **App nativo fora das lojas**: dá certo no Android (APK), mas não existe caminho viável no iOS.
- **Continuar com web/PWA (ADR 0009)**: descartado pela pessoa que decide o produto.

## Consequences
- O app do casal é só nativo. As telas web (`site/`, as telas do casal em `apps/web` e as telas de
  entrada do link mágico) são apagadas; `site/` e `supabase/` continuam no histórico do git como
  referência de comportamento.
- O Gerenciador continua web, como app interno pequeno, construído depois do app do casal.
- Stack do app: Expo (build e publicação pelo EAS) e Expo Router, num `apps/mobile` do monorepo,
  com os contratos e o i18n PT/ES compartilhados. As versões são conferidas na documentação atual na
  hora da construção.
- Classificação etária 18+. No Brasil, a Apple exige A18 para apps com o descritor "Dating and
  Relationships", e todo app precisa preencher as novas declarações até 2027-01-12
  (developer.apple.com/news/?id=yxkh08us, 2026-11-02).
- O catálogo de conteúdo antigo não é portado: cada peça é refeita sob a regra de não ser explícita.
