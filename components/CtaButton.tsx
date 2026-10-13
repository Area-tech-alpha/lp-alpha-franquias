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

type CtaButtonProps = {
  children: React.ReactNode;
  className?: string;
};

// Botão-âncora que rola até o formulário de inscrição.
export function CtaButton({ children, className = "" }: CtaButtonProps) {
  return (
    <a
      href={`#${FORM_ANCHOR}`}
      className={`flex w-full items-center justify-between gap-4 rounded-[4px] bg-brand px-5 py-[18px] text-[14px] leading-[1.4] font-bold text-white uppercase transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:text-[16px] ${className}`}
    >
      <span className="flex-1 text-center">{children}</span>
      <ArrowIcon />
    </a>
  );
}
