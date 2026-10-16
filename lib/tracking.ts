// Captura de UTMs/click ids no client, com first-touch em sessionStorage.
import { TRACKING_KEYS, type Tracking } from "@/lib/lead";

const STORAGE_KEY = "lp_tracking";

function fromUrl(): Tracking {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(TRACKING_KEYS.map((key) => [key, params.get(key) || null])) as Tracking;
}

function hasAny(tracking: Tracking) {
  return TRACKING_KEYS.some((key) => tracking[key]);
}

function readStored(): Tracking | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Tracking) : null;
  } catch {
    return null;
  }
}

// Chamado no primeiro carregamento: salva as UTMs da URL se ainda não houver nada salvo.
export function captureTracking() {
  const current = fromUrl();
  if (!hasAny(current) || readStored()) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Storage indisponível (aba anônima, bloqueio): getTracking() cai para a URL.
  }
}

export function getTracking(): Tracking {
  const stored = readStored();
  return stored && hasAny(stored) ? stored : fromUrl();
}
