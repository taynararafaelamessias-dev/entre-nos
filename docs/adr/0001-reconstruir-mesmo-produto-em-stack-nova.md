# Reconstruir o mesmo produto em stack nova, começando pelo onboarding

O app atual (HTML estático com scripts que se sobrescrevem em `window.render`, migrations coladas à
mão no SQL Editor, regras de acesso só no navegador) não tem como evoluir com segurança. Decidimos
reconstruir **todas** as funcionalidades atuais numa arquitetura nova, em vez de remendar o código
existente ou cortar para um MVP enxuto. O onboarding vem primeiro e é tratado como peça central do
produto, não como formulário de cadastro.

## Consequences
- O código em `site/` e `supabase/` vira referência de comportamento, não base de código.
- Os dados do Supabase atual são de teste e são descartados; não há migração de dados.
