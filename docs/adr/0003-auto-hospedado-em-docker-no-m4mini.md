# Tudo auto-hospedado em Docker, primeiro no m4mini e depois numa VPS

A aplicação inteira (Postgres, servidor, tempo real, rotinas agendadas) roda em containers Docker
no m4mini por enquanto, e migra para uma VPS depois, sem nuvem gerenciada. Escolhemos portabilidade
e custo zero de infraestrutura agora, em vez de Postgres gerenciado (Neon) ou Cloudflare Workers.

## Consequences
- Um `docker compose` é a definição do ambiente: o mesmo arquivo sobe no m4mini e na VPS.
- Sem backup gerenciado: backup contínuo do Postgres para fora de casa (WAL-G para um bucket R2/B2),
  com restauração no tempo e um teste de restauração automático por semana.
- O m4mini aparece na internet por um Cloudflare Tunnel (container `cloudflared` no compose): nenhuma
  porta aberta no roteador, IP de casa escondido, e a migração para a VPS move o mesmo container.
- Tempo real e rotinas agendadas rodam dentro do nosso processo, não em serviços da plataforma.
