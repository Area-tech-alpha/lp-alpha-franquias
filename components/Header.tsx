import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="container-lp flex h-[84px] items-center justify-between gap-4 lg:h-[141.5px] lg:items-start lg:pt-[48px] lg:pr-[54px]">
        <Logo className="h-[40px] w-[160px] lg:ml-[6px] lg:h-[45px] lg:w-[180px]" />
        <ThemeToggle />
      </div>
    </header>
  );
}
