import { z } from "zod";
import { INVESTMENT_OPTIONS, PROFILE_OPTIONS, TRACKING_KEYS, onlyDigits, type TrackingKey } from "@/lib/lead";

// Webhook de destino dos leads (configure na Vercel em Settings → Environment Variables).
const WEBHOOK_URL = process.env.WEBHOOK_URL;
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

const leadSchema = z.object({
  nome: z.string({ error: "Informe seu nome." }).trim().min(2, "Informe seu nome."),
  email: z.string({ error: "Informe um e-mail válido." }).trim().pipe(z.email("Informe um e-mail válido.")),
  whatsapp: z
    .string({ error: "Informe um WhatsApp válido com DDD." })
    .transform((value) => {
      const digits = onlyDigits(value);
      // Aceita com ou sem DDI 55.
      return digits.length > 11 && digits.startsWith("55") ? digits.slice(2) : digits;
    })
    .refine((digits) => digits.length >= 10 && digits.length <= 11, "Informe um WhatsApp válido com DDD.")
    .transform((digits) => `55${digits}`),
  perfil: z.enum(PROFILE_OPTIONS, { error: "Selecione seu perfil." }),
  investimento: z.enum(INVESTMENT_OPTIONS, { error: "Selecione quanto tem para investir." }),
  ...trackingShape,
  page_url: z.string().trim().max(2000).default(""),
  referrer: optional(2000),
  user_agent: optional(1000),
});

export async function POST(request: Request) {
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
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }

  const lead = parsed.data;

  if (!WEBHOOK_URL) {
    console.error("[lead] WEBHOOK_URL não configurada");
    return Response.json({ ok: false, error: "Envio indisponível no momento." }, { status: 500 });
  }

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
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Webhook respondeu ${res.status}: ${(await res.text()).slice(0, 300)}`);
  } catch (err) {
    console.error("[lead] falha ao enviar para o webhook", err);
    return Response.json({ ok: false, error: "Não foi possível enviar agora." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }

  return Response.json({ ok: true });
}
