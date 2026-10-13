import { FORM_ANCHOR } from "@/lib/event";

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-hidden="true"
      className={`size-[22px] shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10 10 4M5 4h5v5" />
    </svg>
  );
}

// Classes compartilhadas pelos botões da marca (âncoras e submit).
export const brandButtonClass =
  "flex w-full items-center justify-center gap-4 rounded-[4px] bg-brand text-on-brand font-bold uppercase transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-focus";

type CtaButtonProps = {
  children: React.ReactNode;
  className?: string;
};

// Botão-âncora que rola até o formulário de inscrição.
export function CtaButton({ children, className = "" }: CtaButtonProps) {
  return (
    <a
      href={`#${FORM_ANCHOR}`}
      className={`${brandButtonClass} min-h-[56px] justify-between px-5 py-4 text-[14px] leading-[1.4] lg:text-[16px] ${className}`}
    >
      <span className="flex-1 text-center">{children}</span>
      <ArrowIcon />
    </a>
  );
}
