// Regras do formulário compartilhadas entre o client e o Route Handler (o servidor é a fonte da verdade).
import { parsePhoneNumberFromString } from "libphonenumber-js/mobile";
import { z } from "zod";

export const PROFILE_OPTIONS = [
  "Dono (a) de Agência",
  "Investidor (a)",
  "Executivo (a) de Mercado",
  "CLT",
] as const;

// Ordem de exibição: do maior para o menor.
export const INVESTMENT_OPTIONS = [
  "Tenho mais de 400 mil",
  "Tenho entre 140 e 400 mil",
  "Tenho entre 70 e 140 mil",
  "Tenho entre 50 e 70 mil",
  "Tenho até 50 mil",
] as const;

// Parâmetros de rastreamento lidos da URL (first-touch, ver lib/tracking.ts).
export const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

export type TrackingKey = (typeof TRACKING_KEYS)[number];

export type Tracking = Record<TrackingKey, string | null>;

export type LeadFields = {
  nome: string;
  email: string;
  whatsapp: string;
  perfil: string;
  investimento: string;
};

export type LeadErrors = Partial<Record<keyof LeadFields, string>>;

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

// (11) 98765-4321 / (11) 3456-7890
export function maskPhoneBR(value: string) {
  let d = onlyDigits(value);
  // Autofill costuma trazer o DDI (+55 11 98765-4321).
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  d = d.slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// ---------- Nome ----------

const NAME_CHARS = /^[\p{L}' -]+$/u;
const BLOCKED_NAME_WORDS = new Set(["asdf", "qwerty", "teste", "test", "fulano", "ciclano", "xxx"]);
const NAME_PARTICLES = new Set(["da", "de", "do", "das", "dos"]);

function stripAccents(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function collapseSpaces(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function nameError(name: string): string | null {
  if (!name) return "Informe seu nome completo.";
  if (!NAME_CHARS.test(name)) return "Use apenas letras no nome.";
  const words = name.split(" ");
  if (words.length < 2) return "Informe nome e sobrenome.";
  const plain = stripAccents(name);
  if (plain.includes("asdf") || plain.includes("qwerty")) return "Informe seu nome real.";
  for (const word of words) {
    const letters = stripAccents(word).replace(/['-]/g, "");
    if (letters.length < 2) return "Informe nome e sobrenome completos.";
    if (BLOCKED_NAME_WORDS.has(letters) || /^(\p{L})\1+$/u.test(letters) || /(\p{L})\1\1/u.test(letters))
      return "Informe seu nome real.";
  }
  return null;
}

// "maria DA silva" → "Maria da Silva"
function titleCase(name: string) {
  return name
    .toLocaleLowerCase("pt-BR")
    .split(" ")
    .map((word, i) =>
      i > 0 && NAME_PARTICLES.has(word)
        ? word
        : word.replace(/(^|[-'])(\p{L})/gu, (_, sep: string, letter: string) => sep + letter.toLocaleUpperCase("pt-BR")),
    )
    .join(" ");
}

// ---------- E-mail ----------

const EMAIL_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmali.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gemail.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com",
  "gmail.com.br": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmil.com": "hotmail.com",
  "hotamil.com": "hotmail.com",
  "homail.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotmail.cm": "hotmail.com",
  "outlok.com": "outlook.com",
  "outllok.com": "outlook.com",
  "outook.com": "outlook.com",
  "otlook.com": "outlook.com",
  "outloo.com": "outlook.com",
  "outlook.con": "outlook.com",
  "outlook.co": "outlook.com",
  "yaho.com": "yahoo.com",
  "yahho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "yaho.com.br": "yahoo.com.br",
  "iclod.com": "icloud.com",
  "icoud.com": "icloud.com",
  "icloud.con": "icloud.com",
  "live.con": "live.com",
};

// Sugere a correção de domínios digitados errado ("ana@gmial.com" → "ana@gmail.com").
export function suggestEmail(email: string): string | null {
  const [user, domain] = email.trim().toLowerCase().split("@");
  if (!user || !domain) return null;
  const fixed = EMAIL_TYPOS[domain] ?? (/\.(con|cmo|cpm)$/.test(domain) ? domain.replace(/\.\w+$/, ".com") : null);
  return fixed ? `${user}@${fixed}` : null;
}

// ---------- WhatsApp ----------

function isFakeSequence(subscriber: string) {
  const last8 = subscriber.slice(-8);
  if (/^(\d)\1+$/.test(last8)) return true;
  const steps = [...last8].slice(1).map((d, i) => Number(d) - Number(last8[i]));
  return steps.every((s) => s === 1) || steps.every((s) => s === -1);
}

// Devolve o celular em E.164 sem "+" (5561986522088) ou a mensagem de erro.
function parseWhatsapp(value: string): { ok: true; number: string } | { ok: false; error: string } {
  let digits = onlyDigits(value);
  if (digits.length > 11 && digits.startsWith("55")) digits = digits.slice(2);
  const phone = parsePhoneNumberFromString(digits, "BR");
  if (!phone || !phone.isValid() || phone.getType() !== "MOBILE")
    return { ok: false, error: "Informe um celular válido com DDD." };
  if (isFakeSequence(phone.nationalNumber.slice(2))) return { ok: false, error: "Informe seu número real de WhatsApp." };
  return { ok: true, number: phone.number.slice(1) };
}

// ---------- Schemas ----------

export const leadFieldsSchema = z.object({
  nome: z
    .string({ error: "Informe seu nome completo." })
    .transform(collapseSpaces)
    .superRefine((value, ctx) => {
      const error = nameError(value);
      if (error) ctx.addIssue({ code: "custom", message: error });
    })
    .transform(titleCase),
  email: z
    .string({ error: "Informe um e-mail válido." })
    .trim()
    .toLowerCase()
    .pipe(z.email("Informe um e-mail válido.")),
  whatsapp: z.string({ error: "Informe um celular válido com DDD." }).transform((value, ctx) => {
    const result = parseWhatsapp(value);
    if (result.ok) return result.number;
    ctx.addIssue({ code: "custom", message: result.error });
    return z.NEVER;
  }),
  perfil: z.enum(PROFILE_OPTIONS, { error: "Selecione seu perfil." }),
  investimento: z.enum(INVESTMENT_OPTIONS, { error: "Selecione quanto tem para investir." }),
});

export function toLeadErrors(error: z.ZodError): LeadErrors {
  const errors: LeadErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof LeadFields;
    if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

export function validateLead(fields: LeadFields): LeadErrors {
  const result = leadFieldsSchema.safeParse(fields);
  return result.success ? {} : toLeadErrors(result.error);
}

export function validateField(name: keyof LeadFields, value: string): string | undefined {
  const result = leadFieldsSchema.shape[name].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}
