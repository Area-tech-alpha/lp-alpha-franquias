// Regras do formulário compartilhadas entre o client e o Route Handler.

export const PROFILE_OPTIONS = [
  "Dono (a) de Agência",
  "Investidor (a)",
  "Executivo (a) de Mercado",
  "CLT",
] as const;

export const INVESTMENT_OPTIONS = [
  "Tenho até 50 mil",
  "Tenho entre 50 e 70 mil",
  "Tenho entre 70 e 140 mil",
  "Tenho entre 140 e 400 mil",
  "Tenho mais de 400 mil",
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

export function validateLead(fields: LeadFields): LeadErrors {
  const errors: LeadErrors = {};
  if (fields.nome.trim().length < 2) errors.nome = "Informe seu nome.";
  if (!EMAIL_RE.test(fields.email.trim())) errors.email = "Informe um e-mail válido.";
  const phone = onlyDigits(fields.whatsapp);
  if (phone.length < 10 || phone.length > 11) errors.whatsapp = "Informe um WhatsApp válido com DDD.";
  if (!(PROFILE_OPTIONS as readonly string[]).includes(fields.perfil)) errors.perfil = "Selecione seu perfil.";
  if (!(INVESTMENT_OPTIONS as readonly string[]).includes(fields.investimento))
    errors.investimento = "Selecione quanto tem para investir.";
  return errors;
}
