import Image from "next/image";
import { CtaButton } from "@/components/CtaButton";
import { BrandSymbol } from "@/components/Logo";
import { EVENT_DESCRIPTION } from "@/lib/event";

export function Hero() {
  return (
    <section className="bg-hero text-hero-fg">
      <div className="container-lp pt-[56px] pb-[64px] lg:grid lg:min-h-[868px] lg:grid-cols-[minmax(0,630px)_minmax(0,520px)] lg:justify-between lg:gap-x-[40px] lg:pt-[130px] lg:pb-[100px]">
        <div>
          <p className="flex items-center gap-2 text-[12px] leading-[1.5] font-medium text-brand lg:text-[14px] lg:leading-[1.4]">
            <BrandSymbol className="h-[14px] lg:h-[16px]" />
            WEBINÁRIO AOS | DIA 26 DE OUTUBRO DE 2026
          </p>
          <h1 className="mt-4 text-[clamp(2.25rem,1.75rem+2vw,3rem)] leading-[1.1] font-medium tracking-[-0.033em] lg:mt-[18px]">
            AOS 2026: ALPHA OPERATING SYSTEM
          </h1>
          <p className="mt-5 text-[16px] leading-[1.5] text-hero-muted lg:mt-6 lg:text-[17px]">{EVENT_DESCRIPTION}</p>
          <div className="mt-5 text-[16px] leading-[1.5] text-hero-muted lg:mt-[30px] lg:text-[17px]">
            <p className="font-bold">Vender todo mês com previsibilidade, escala e lucratividade.</p>
            <p>O método completo, ao vivo.</p>
          </div>
          <CtaButton className="mt-7 lg:mt-6 lg:min-h-[65px] lg:px-6 lg:py-[21px]">Quero me inscrever na AOS</CtaButton>
        </div>

        <figure className="relative mt-10 aspect-square w-full overflow-hidden md:mx-auto md:max-w-[520px] lg:mt-[10px]">
          <Image
            src="/hero-socios.jpg"
            alt="Choco e Athos, sócios da Alpha"
            fill
            sizes="(min-width: 768px) 520px, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover object-[50%_30%]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-brand px-4 py-3 text-[15px] leading-[1.3] font-bold text-on-brand sm:text-[17px] lg:px-6 lg:py-4 lg:text-[20px]">
            Mudar de modelo é mais lucrativo do que reinventar a roda
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
