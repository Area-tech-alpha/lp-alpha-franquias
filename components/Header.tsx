import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="container-lp flex h-[84px] items-center justify-between gap-4 lg:h-[141.5px] lg:pr-[54px]">
        <Logo preload className="h-[40px] lg:ml-[6px] lg:h-[52px]" />
        <ThemeToggle />
      </div>
    </header>
  );
}
