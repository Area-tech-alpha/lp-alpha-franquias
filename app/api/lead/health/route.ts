import { connection } from "next/server";

// Diz se a env do webhook está configurada, sem expor a URL.
export async function GET() {
  await connection(); // força execução por requisição (substitui `dynamic = "force-dynamic"`)
  return Response.json({ webhookConfigured: Boolean(process.env.WEBHOOK_URL) });
}
