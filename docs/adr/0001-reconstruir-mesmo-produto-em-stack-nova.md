# Reconstruir o mesmo produto em stack nova, começando pelo onboarding

O app atual (HTML estático com scripts que se sobrescrevem em `window.render`, migrations coladas à
mão no SQL Editor, regras de acesso só no navegador) não tem como evoluir com segurança. Decidimos
reconstruir **todas** as funcionalidades atuais (exceto o antigo Desafio do casal, aposentado) numa arquitetura nova, em vez de remendar o código
existente ou cortar para um MVP enxuto. O onboarding vem primeiro e é tratado como peça central do
produto, não como formulário de cadastro.

## Consequences
- O código em `site/` e `supabase/` vira referência de comportamento, não base de código: cada área
  é repensada (inclusive os três desafios), uma decisão por área, e não portada como está.
- O fluxo do onboarding só é fixado depois de um protótipo clicável.
- As regras de negócio são decididas pela pessoa que decide o produto, não pelos agentes que constroem.
- Os dados do Supabase atual são de teste e são descartados; não há migração de dados.
