import Image from "next/image";
import { CtaButton } from "@/components/CtaButton";
import { BrandSymbol } from "@/components/Logo";
import { EVENT_DESCRIPTION } from "@/lib/event";

export function Hero() {
  return (
    <section className="bg-hero text-hero-fg">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="w-full lg:max-w-[560px]">
          <p className="flex items-center gap-2 text-[12px] leading-[1.5] font-medium text-brand lg:text-[14px] lg:leading-[1.4]">
            <BrandSymbol className="h-[14px] lg:h-[16px]" />
            WEBINÁRIO AOS | DIA 26 DE OUTUBRO DE 2026
          </p>
          <h1 className="mt-4 text-[clamp(2.25rem,1.75rem+2vw,3rem)] leading-[1.1] font-medium tracking-[-0.033em] lg:mt-[18px]">
            AOS 2026: Unidade lucrativa e escala em&nbsp;2027.
          </h1>
          <p className="mt-5 text-[16px] leading-[1.5] text-hero-muted lg:mt-6 lg:text-[17px]">{EVENT_DESCRIPTION}</p>
          <div className="mt-5 text-[16px] leading-[1.5] text-hero-muted lg:mt-[30px] lg:text-[17px]">
            <p className="font-bold">Vender todo mês com previsibilidade, escala e lucratividade.</p>
            <p>O método completo, ao vivo.</p>
          </div>
          <CtaButton className="mt-7 lg:mt-6 lg:min-h-[65px] lg:px-6 lg:py-[21px]">Quero me inscrever na AOS</CtaButton>
        </div>

        {/* Legenda fora da arte, alinhada à largura da imagem (como na referência), para não cobrir os nomes dos sócios. */}
        <figure className="w-full max-w-[520px] justify-self-center lg:justify-self-end">
          <Image
            src="/hero-socios.png"
            alt="Athos Villarins e Pedro Dias – AOS 2026"
            width={1080}
            height={1080}
            preload
            sizes="(max-width: 768px) 100vw, 50vw"
            className="block aspect-square h-auto w-full object-cover"
          />
          <figcaption className="mt-6 lg:mt-[30px]">
            <p className="text-[13px] leading-[1.4] text-hero-muted lg:text-[14px]">Athos Villarins / Pedro Dias</p>
            <p className="mt-2 text-[17px] leading-[1.3] font-bold text-brand lg:mt-3 lg:text-[20px]">
              Mudar de modelo é mais lucrativo do que reinventar a roda
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
