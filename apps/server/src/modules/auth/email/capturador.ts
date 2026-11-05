// Ajuda de teste: lê o link mágico que chegou no capturador local (Mailpit, serviço `mail`).

type ResultadoDaBusca = { messages?: { ID: string; Created: string }[] };
type Mensagem = { Text?: string };

const LINK_MAGICO = /https?:\/\/\S*magic-link\/verify\S*/;

/** Espera chegar um e-mail para `para` e devolve o link mágico dele (o mais recente). */
export async function esperarLinkDoCapturador(mailpitUrl: string, para: string, timeoutMs = 10000): Promise<string> {
  const base = mailpitUrl.replace(/\/$/, '');
  const limite = Date.now() + timeoutMs;
  while (Date.now() < limite) {
    const busca = await fetch(`${base}/api/v1/search?query=${encodeURIComponent(`to:"${para}"`)}`);
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
