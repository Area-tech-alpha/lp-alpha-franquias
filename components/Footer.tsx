import { Logo } from "@/components/Logo";
import { PRIVACY_URL, TERMS_URL } from "@/lib/event";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-lp flex flex-col items-start gap-5 py-10 md:flex-row md:items-center md:gap-[47px] lg:min-h-[168.5px] lg:items-start lg:py-[64px]">
        <Logo className="h-[40px] w-[160px] shrink-0 lg:w-[161px]" />
        <p className="text-[14px] leading-[1.6] text-fg-muted md:mt-0 lg:mt-[10.75px] lg:leading-[1.4]">
          Alpha Franchising © 2026. Todos os direitos reservados. ·{" "}
          <a href={TERMS_URL} className="underline-offset-2 hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-focus">
            Termos de Uso
          </a>{" "}
          ·{" "}
          <a href={PRIVACY_URL} className="underline-offset-2 hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-focus">
            Política de Privacidade
          </a>
        </p>
      </div>
    </footer>
  );
}
