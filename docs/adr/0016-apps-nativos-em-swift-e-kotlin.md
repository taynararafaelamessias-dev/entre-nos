---
status: accepted
---
# Dois apps nativos: Swift no iOS e Kotlin no Android

O app do casal é feito em dois apps 100% nativos: SwiftUI no iOS e Jetpack Compose no Android, em
vez de Expo/React Native. O critério é a experiência nativa em cada plataforma, e a pessoa que decide o
produto aceitou o custo: cada tela é construída e corrigida duas vezes. O cliente da API é gerado
nos dois apps a partir de um contrato OpenAPI que o servidor publica. Decidido em 2026-11-19. Muda a
stack do ADR 0011 e os contratos do ADR 0014.

## Considered Options
- **Expo / React Native (ADR 0011)**: uma base para as duas lojas. Descartado em favor da experiência
  nativa.
- **Kotlin Multiplatform** (telas nativas, lógica compartilhada em Kotlin): descartado. Com o cliente
  gerado por OpenAPI, o que sobra para compartilhar é pouco, e o iOS passaria a depender de mais uma
  cadeia de ferramentas.

## Consequences
- O contrato da API deixa de ser compartilhado como pacote TypeScript: o servidor gera o OpenAPI a
  partir dos próprios esquemas, e um formato errado quebra a geração do cliente nos dois apps.
- Push sai pelo APNs no iOS e pelo FCM no Android, sem o serviço de push do Expo. A sessão fica no
  Keychain (iOS) e no Keystore (Android).
- O i18n PT/ES é mantido por plataforma (String Catalog no iOS, recursos no Android), a partir de uma
  fonte única no repositório.
- Tudo num repositório só: `apps/ios` (Xcode), `apps/android` (Gradle), `apps/server` e, depois,
  `apps/gerenciador` (web interno). Uma mudança de contrato entra num único PR, com o OpenAPI e os
  dois clientes gerados juntos.
- O trabalho em Expo (PR #29, issue #25) deixa de ser o caminho do app.
