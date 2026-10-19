// Meta Pixel: ID público vindo da env. Sem ID, nada é carregado nem disparado.
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Fbq = (command: "init" | "track" | "trackCustom", eventOrId: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

function fbq(...args: Parameters<Fbq>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq(...args);
}

export function trackPageView() {
  fbq("track", "PageView");
}

export function trackLead(params?: Record<string, unknown>) {
  fbq("track", "Lead", params);
}
