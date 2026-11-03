# Autorização em duas camadas: servidor e RLS do Postgres

Os dados são íntimos e cada casal só pode ver o que é seu. O servidor checa casal, papel e assinatura
em cada caso de uso, e o Postgres repete a regra com Row Level Security: cada transação declara a
pessoa da sessão, e as tabelas do casal só devolvem as linhas dela. Um erro de consulta no servidor
não vaza dados de outro casal.

## Consequences
- Toda consulta de dados de usuário roda numa transação que declara a pessoa; o servidor conecta com
  um usuário de banco sem bypass de RLS. Migrations e rotinas usam outro usuário.
- Testes de integração provam o isolamento nas duas camadas, com um Postgres real.
