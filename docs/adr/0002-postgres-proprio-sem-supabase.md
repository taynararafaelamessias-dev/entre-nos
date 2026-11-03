# Postgres próprio e backend sob medida, sem Supabase

Saímos do Supabase (BaaS) para Postgres puro, com um servidor de aplicação próprio e autenticação
dentro da própria aplicação (Better Auth é o candidato). O objetivo é uma arquitetura profissional
sob medida: regras de negócio num backend tipado e testável, não espalhadas entre RLS, RPCs e cliente.

## Consequences
- Tudo o que o Supabase dava de graça vira decisão nossa: tempo real das salas, rotinas agendadas
  (apagar Conversar em 24 h, perguntas em 90 dias), armazenamento de arquivos, e-mail de autenticação.
- Autorização sai das políticas RLS e passa a ser responsabilidade do backend.
