# Login só por link mágico

Ninguém cria senha: a pessoa entra pelo link enviado ao e-mail. Num app íntimo, isso tira o atrito do
cadastro e elimina senha fraca ou reutilizada.

## Consequences
- O e-mail transacional vira dependência crítica: sem e-mail entregue, ninguém entra.
- O e-mail sai pelo Resend, nunca direto do servidor (cairia no spam). O texto é neutro ("seu link
  para entrar"). A política do Resend sobre o segmento ainda não foi verificada.
