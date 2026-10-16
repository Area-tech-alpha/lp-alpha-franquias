// Checagens de e-mail que só rodam no servidor (DNS e lista de descartáveis).
import { promises as dns } from "node:dns";
import disposableList from "disposable-email-domains/index.json";
import disposableWildcards from "disposable-email-domains/wildcard.json";

const MX_TIMEOUT_MS = 3_000;
const NO_MX = "Esse e-mail não existe. Confira o domínio.";
const DISPOSABLE = "Use um e-mail pessoal ou profissional, não um e-mail temporário.";

const disposable = new Set<string>(disposableList);

function isDisposable(domain: string) {
  if (disposable.has(domain)) return true;
  return (disposableWildcards as string[]).some((base) => domain === base || domain.endsWith(`.${base}`));
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

// Mensagem de erro para o e-mail, ou null se estiver ok.
export async function emailDomainError(email: string): Promise<string | null> {
  const domain = email.split("@")[1] ?? "";
  if (isDisposable(domain)) return DISPOSABLE;
  try {
    const records = await withTimeout(dns.resolveMx(domain), MX_TIMEOUT_MS);
    return records.some((r) => r.exchange) ? null : NO_MX;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOTFOUND" || code === "ENODATA") return NO_MX;
    // Timeout ou falha do DNS: não perde o lead por instabilidade.
    console.warn("[lead] checagem de MX inconclusiva", domain, err);
    return null;
  }
}
