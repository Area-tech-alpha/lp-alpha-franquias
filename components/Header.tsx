import Image from "next/image";
import { FORM_ANCHOR } from "@/lib/event";

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="container-lp relative h-[128px] lg:grid lg:h-[141.5px] lg:grid-cols-[524px_1fr_auto] lg:items-start lg:pr-[91px]">
        <Image
          src="/logo-alpha.svg"
          alt="Alpha"
          width={180}
          height={45}
          className="absolute top-[27px] h-[46px] w-[188px] lg:static lg:mt-[48px] lg:ml-[6px] lg:h-[45px] lg:w-[180px]"
        />
        <p className="absolute inset-x-[15px] top-[91px] text-center text-[11px] leading-[1.5] font-medium text-wine lg:static lg:mt-[61px] lg:text-left lg:text-[14px] lg:leading-[1.4]">
          WEBINÁRIO AOS / 26 OUT 2026
        </p>
        <a
          href={`#${FORM_ANCHOR}`}
          className="absolute top-[42px] right-[15px] text-right text-[11px] leading-[1.5] font-medium text-wine hover:text-brand lg:static lg:mt-[61px] lg:text-[14px] lg:leading-[1.4]"
        >
          ONLINE E GRATUITO ↗
        </a>
      </div>
    </header>
  );
}
