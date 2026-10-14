import Image from "next/image";

// Logo principal (amarela, fundo transparente): igual nos temas light e dark.
export function Logo({ className = "", preload = false }: { className?: string; preload?: boolean }) {
  return (
    <Image
      src="/alpha-logo.png"
      alt="Alpha Assessoria"
      width={1391}
      height={396}
      sizes="(min-width: 1024px) 183px, 141px"
      loading={preload ? "eager" : "lazy"}
      className={`w-auto ${className}`}
    />
  );
}

// Só o símbolo das setas, para selos, badges e elementos pequenos.
export function BrandSymbol({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/alpha-simbolo.png"
      alt=""
      aria-hidden="true"
      width={243}
      height={256}
      sizes="24px"
      className={`w-auto shrink-0 ${className}`}
    />
  );
}
