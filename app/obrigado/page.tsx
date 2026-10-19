import type { Metadata } from "next";
import { brandButtonClass } from "@/components/CtaButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BrandSymbol } from "@/components/Logo";
import { EVENT_TIME, EVENT_TITLE, WHATSAPP_GROUP_URL } from "@/lib/event";

export const metadata: Metadata = {
  title: `Inscrição confirmada | ${EVENT_TITLE}`,
  robots: { index: false, follow: false },
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[22px] shrink-0" fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.48.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.4.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.56.93.95-3.47-.22-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.23-9.43 9.44-9.43a9.37 9.37 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43m8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.79.72.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6.01-1.58a11.32 11.32 0 0 0 5.43 1.38h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.32-8.02" />
    </svg>
  );
}

export default function ObrigadoPage() {
  return (
    <>
      <Header />
      <main className="bg-surface-alt">
        <div className="container-lp flex justify-center py-[56px] lg:py-[117px]">
          <div className="w-full max-w-[640px] border border-card-border bg-card px-5 py-8 text-center md:px-10 md:py-12">
            <p className="flex items-center justify-center gap-2.5 text-[12px] leading-[1.5] font-medium tracking-[0.3px] text-accent lg:text-[14px] lg:leading-[1.4]">
              <BrandSymbol className="h-[14px] lg:h-[16px]" />
              INSCRIÇÃO CONFIRMADA
            </p>
            <h1 className="mt-5 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-[1.15] font-medium tracking-[-0.028em] text-fg">
              Falta só um passo: entre no grupo do evento
            </h1>
            <p className="mt-5 text-[16px] leading-[1.5] text-fg-muted lg:text-[18px]">
              Sua vaga no <strong className="font-bold text-fg">{EVENT_TITLE}</strong> está garantida. O link da live
              de 26 de outubro, às {EVENT_TIME}, e todos os avisos do evento serão enviados pelo grupo do WhatsApp.
            </p>
            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${brandButtonClass} mt-8 min-h-[56px] gap-3 px-5 py-4 text-[14px] leading-[1.4] lg:text-[16px]`}
            >
              <WhatsAppIcon />
              Entrar no grupo do WhatsApp
            </a>
            <p className="mt-4 text-[14px] leading-[1.4] text-fg-muted">
              Sem entrar no grupo você pode perder o link da live.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
