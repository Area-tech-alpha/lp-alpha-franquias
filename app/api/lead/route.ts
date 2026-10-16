import { z } from "zod";
import { emailDomainError } from "@/lib/email-server";
import { TRACKING_KEYS, leadFieldsSchema, toLeadErrors, type TrackingKey } from "@/lib/lead";

// Roda em Node.js (padrão). Com cacheComponents, `runtime`/`dynamic` não são permitidos; POST nunca é cacheado.

const WEBHOOK_TIMEOUT_MS = 10_000;

const EVENTO = "AOS 2026";
const DATA_EVENTO = "2026-10-26";

// String opcional: vazio/ausente vira null.
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => value || null);

const trackingShape = Object.fromEntries(TRACKING_KEYS.map((key) => [key, optional(500)])) as Record<
  TrackingKey,
  ReturnType<typeof optional>
>;

const leadSchema = leadFieldsSchema.extend({
  ...trackingShape,
  page_url: z.string().trim().max(2000).default(""),
  referrer: optional(2000),
  user_agent: optional(1000),
});

function invalid(errors: ReturnType<typeof toLeadErrors>) {
  const error = Object.values(errors)[0] ?? "Dados inválidos.";
  return Response.json({ ok: false, error, errors }, { status: 400 });
}

export async function POST(request: Request) {
  // Lido por requisição: a env da Vercel vale para o deploy em execução.
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[lead] WEBHOOK_URL não configurada");
    return Response.json({ ok: false, error: "WEBHOOK_URL não configurada" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Requisição inválida." }, { status: 400 });
  }

  // Honeypot: bots preenchem o campo oculto "website". Responde sucesso sem enviar.
  const website = (body as { website?: unknown } | null)?.website;
  if (typeof website === "string" && website.trim()) return Response.json({ ok: true });

  const parsed = leadSchema.safeParse(body);
  const errors = parsed.success ? {} : toLeadErrors(parsed.error);

  // Checa o domínio mesmo se outro campo falhou, para devolver todos os erros de uma vez.
  if (!errors.email) {
    const email = leadFieldsSchema.shape.email.safeParse((body as { email?: unknown } | null)?.email);
    const emailError = email.success ? await emailDomainError(email.data) : null;
    if (emailError) errors.email = emailError;
  }

  if (!parsed.success || Object.keys(errors).length > 0) return invalid(errors);

  const lead = parsed.data;

  const payload = {
    nome: lead.nome,
    email: lead.email,
    whatsapp: lead.whatsapp,
    perfil: lead.perfil,
    investimento: lead.investimento,
    evento: EVENTO,
    data_evento: DATA_EVENTO,
    ...Object.fromEntries(TRACKING_KEYS.map((key) => [key, lead[key]])),
    page_url: lead.page_url,
    referrer: lead.referrer,
    user_agent: lead.user_agent ?? request.headers.get("user-agent") ?? "",
    created_at: new Date().toISOString(),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error("[lead] n8n", res.status, (await res.text()).slice(0, 1000));
      return Response.json({ ok: false, error: "Não foi possível enviar agora." }, { status: 502 });
    }
  } catch (err) {
    console.error("[lead] falha ao enviar para o webhook", err);
    return Response.json({ ok: false, error: "Não foi possível enviar agora." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }

  return Response.json({ ok: true });
}
