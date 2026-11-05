import { expect, test } from '@playwright/test';

type ResultadoDaBusca = { messages?: { ID: string; Created: string }[] };
type Mensagem = { Text?: string };

const LINK_MAGICO = /https?:\/\/\S*magic-link\/verify\S*/;

// Lê o link mágico que chegou no capturador local (Mailpit, serviço `mail`).
async function linkDoCapturador(email: string, timeoutMs = 10000): Promise<string> {
  const base = (process.env.MAILPIT_URL ?? '').replace(/\/$/, '');
  const limite = Date.now() + timeoutMs;
  while (Date.now() < limite) {
    const busca = await fetch(`${base}/api/v1/search?query=${encodeURIComponent(`to:"${email}"`)}`);
    if (busca.ok) {
      const { messages = [] } = (await busca.json()) as ResultadoDaBusca;
      const maisRecente = [...messages].sort((a, b) => b.Created.localeCompare(a.Created))[0];
      if (maisRecente) {
        const mensagem = (await (await fetch(`${base}/api/v1/message/${maisRecente.ID}`)).json()) as Mensagem;
        const link = mensagem.Text?.match(LINK_MAGICO)?.[0];
        if (link) return link;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`nenhum link mágico chegou no capturador em ${timeoutMs} ms`);
}

test('entra pelo link do capturador, aceita 18+ e sai', async ({ page }) => {
  const email = `e2e-${Date.now()}@teste.local`;

  await page.goto('/entrar');
  await page.getByLabel('Seu e-mail').fill(email);
  await page.getByRole('button', { name: 'Receber link' }).click();
  await expect(page.getByRole('heading', { name: 'Veja seu e-mail' })).toBeVisible();

  await page.goto(await linkDoCapturador(email));
  await expect(page).toHaveURL(/\/aceite-18$/);
  await page.getByLabel('Tenho 18 anos ou mais').check();
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByText(email)).toBeVisible();

  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page).toHaveURL(/\/entrar$/);
  await page.goto('/');
  await expect(page).toHaveURL(/\/entrar$/);
});
