import { api } from './client.ts';

// Nunca é chamada: só prova, pelo typecheck, que rota ou formato errado não compila.
export async function typeFixture(): Promise<void> {
  const ok = await api.health.check();
  // @ts-expect-error rota que não existe no contrato
  await api.health.naoExiste();
  // @ts-expect-error a rota não recebe entrada
  await api.health.check({ verbose: true });
  // @ts-expect-error campo que não existe na resposta
  void ok.postgres.naoExiste;
}
