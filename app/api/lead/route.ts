import { TRACKING_KEYS, validateLead, type LeadPayload, type TrackingKey } from "@/lib/lead";

// Webhook de destino dos leads (configure na Vercel em Settings → Environment Variables).
const WEBHOOK_URL = process.env.WEBHOOK_URL;

function str(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  if (!WEBHOOK_URL) {
    console.error("[lead] WEBHOOK_URL não configurada");
    return Response.json({ ok: false, error: "Envio indisponível no momento." }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Requisição inválida." }, { status: 400 });
  }

  const payload: LeadPayload = {
    nome: str(body.nome),
    email: str(body.email),
    whatsapp: str(body.whatsapp, 30),
    perfil: str(body.perfil),
    investimento: str(body.investimento),
    page_url: str(body.page_url, 2000),
    ...(Object.fromEntries(TRACKING_KEYS.map((key) => [key, str(body[key])])) as Record<TrackingKey, string>),
  };

  const errors = validateLead(payload);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, submitted_at: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`Webhook respondeu ${res.status}`);
  } catch (err) {
    console.error("[lead] falha ao enviar para o webhook", err);
    return Response.json({ ok: false, error: "Não foi possível enviar agora." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
