# Monólito modular num monorepo pequeno

Um único processo servidor (API, tempo real e rotinas) entregue como uma imagem Docker que também
serve o front-end compilado. O código fica num monorepo pnpm com poucas peças: `apps/web` (o app do
casal e o Gerenciador, separados por rota e papel), `apps/server` e `packages/` só onde há código
de fato compartilhado entre front e servidor (contratos/validação, i18n, conteúdo). As regras de
negócio vivem em módulos por área do domínio dentro do servidor, sem depender de HTTP.

## Considered Options
- **Um pacote só**: front (navegador, Vite) e servidor (Node) têm alvos de build e dependências
  diferentes; num pacote só, um vaza para o outro.
- **Microsserviços / vários deployables**: sem time nem carga que justifiquem; multiplica a operação
  no m4mini.
- **Framework full-stack com SSR**: o app é todo atrás de login, SEO não importa; SSR só adicionaria
  complexidade. Uma página pública de entrada pode ser estática.
- **Gerenciador como app separado**: duplica autenticação, layout e build; o papel de equipe já separa.

## Consequences
- Front e servidor compartilham os mesmos esquemas de validação: um contrato, dois lados.
- Fronteiras entre módulos do domínio são checadas por regra de lint, não por pacotes separados.
