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

type Debug = {
  upstreamStatus: number | null;
  upstreamBody: string;
  reason: "timeout" | "network" | "http_error" | "missing_env";
  webhookHost: string | null;
};

function hostOf(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "(URL inválida)";
  }
}

// O n8n repete o id do webhook nas mensagens de erro: mascara os segmentos do path.
function redact(text: string, url: string) {
  let path: string[] = [];
  try {
    path = new URL(url).pathname.split("/").filter((part) => part.length >= 8);
  } catch {}
  return path.reduce((acc, part) => acc.split(part).join("***"), text);
}

function upstreamFailed(debug: Debug) {
  return Response.json({ ok: false, error: "Não foi possível enviar agora.", debug }, { status: 502 });
}

function invalid(errors: ReturnType<typeof toLeadErrors>) {
  const error = Object.values(errors)[0] ?? "Dados inválidos.";
  return Response.json({ ok: false, error, errors }, { status: 400 });
}

export async function POST(request: Request) {
  // Lido por requisição: a env da Vercel vale para o deploy em execução.
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[lead] WEBHOOK_URL não configurada");
    const debug: Debug = { upstreamStatus: null, upstreamBody: "", reason: "missing_env", webhookHost: null };
    return Response.json({ ok: false, error: "WEBHOOK_URL não configurada", debug }, { status: 500 });
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
      const text = await res.text().catch(() => "");
      console.error("[lead] n8n", res.status, text.slice(0, 1000));
      return upstreamFailed({
        upstreamStatus: res.status,
        upstreamBody: redact(text, webhookUrl).slice(0, 300),
        reason: "http_error",
        webhookHost: hostOf(webhookUrl),
      });
    }
  } catch (err) {
    console.error("[lead] falha ao enviar para o webhook", err);
    return upstreamFailed({
      upstreamStatus: null,
      upstreamBody: redact(String(err), webhookUrl).slice(0, 300),
      reason: controller.signal.aborted ? "timeout" : "network",
      webhookHost: hostOf(webhookUrl),
    });
  } finally {
    clearTimeout(timeout);
  }

  return Response.json({ ok: true });
}
