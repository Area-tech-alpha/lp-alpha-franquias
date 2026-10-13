import Image from "next/image";

// As duas versões vão no HTML e o CSS mostra a do tema ativo, sem flash no carregamento.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative block ${className}`}>
      <Image src="/logo-alpha.svg" alt="Alpha" width={180} height={45} className="h-full w-full dark:hidden" />
      <Image src="/logo-alpha-dark.svg" alt="Alpha" width={180} height={45} className="hidden h-full w-full dark:block" />
    </span>
  );
}
