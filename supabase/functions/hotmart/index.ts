// Entre Nós · recebe os avisos de venda da Hotmart e grava no banco.
// Segredo necessário (Supabase → Edge Functions → Secrets): HOTMART_HOTTOK = o "hottok" que a Hotmart mostra na tela de Webhook.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok", { status: 200 });
  const expected = Deno.env.get("HOTMART_HOTTOK") ?? "";
  const got = req.headers.get("x-hotmart-hottok") ?? "";
  if (!expected || got !== expected) return new Response("unauthorized", { status: 401 });
  let body: unknown;
  try { body = await req.json(); } catch { return new Response("bad json", { status: 400 }); }
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data, error } = await sb.rpc("hotmart_ingest", { p: body });
  if (error) { console.error(error); return new Response("erro", { status: 500 }); }
  return new Response(JSON.stringify({ ok: true, kind: data }), { status: 200, headers: { "content-type": "application/json" } });
});
