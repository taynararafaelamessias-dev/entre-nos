---
status: accepted
---
# Hospedagem gerenciada antes do primeiro envio às lojas

O servidor continua em TypeScript, com Postgres e RLS (ADRs 0002, 0005 e 0014). O que muda é onde ele
roda: sai do m4mini em casa para infraestrutura gerenciada, com Postgres gerenciado e restauração no
tempo, mais um host de containers, antes do primeiro envio às lojas. Isso inclui o envio de validação, porque a
App Review usa o servidor de verdade. Um app pago nas lojas não pode depender da energia e da internet
de uma casa. Decidido em 2026-11-19. Muda os ADRs 0003 e 0014.

## Considered Options
- **Trocar a linguagem do servidor** (Kotlin ou Go): descartado. O que já foi construído e testado
  (#1, #5) se aproveita, e "profissional" aqui era a hospedagem, não a linguagem.
- **m4mini e depois VPS (ADR 0003)**: continua só como ambiente de construção.

## Consequences
- O provedor ainda não foi escolhido. Ele é decidido num ticket próprio, com preço e fonte.
- O backup WAL-G (#5) e o Cloudflare Tunnel (#4) passam a valer só para o ambiente de construção,
  ou são substituídos pelo que o provedor gerenciado oferece.
