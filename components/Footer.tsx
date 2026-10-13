import Image from "next/image";
import { PRIVACY_URL, TERMS_URL } from "@/lib/event";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-lp flex flex-col-reverse items-center gap-[30px] pt-[35px] pb-[74px] lg:min-h-[168.5px] lg:flex-row lg:items-start lg:gap-[47px] lg:pt-[64px] lg:pb-[64px]">
        <Image
          src="/logo-alpha.svg"
          alt="Alpha"
          width={180}
          height={45}
          className="h-auto w-[240px] lg:w-[161px]"
        />
        <p className="text-center text-[13.5px] leading-[1.5] text-muted lg:mt-[10.75px] lg:text-left lg:text-[14px] lg:leading-[1.4]">
          Alpha Franchising © 2026. Todos os direitos reservados. ·{" "}
          <a href={TERMS_URL} className="hover:text-wine hover:underline">Termos de Uso</a> ·{" "}
          <a href={PRIVACY_URL} className="hover:text-wine hover:underline">Política de Privacidade</a>
        </p>
      </div>
    </footer>
  );
}
