import Image from "next/image";
import { CtaButton } from "@/components/CtaButton";
import { EVENT_DESCRIPTION } from "@/lib/event";

export function Hero() {
  return (
    <section className="bg-wine text-white">
      <div className="container-lp pt-[64px] pb-[64px] lg:grid lg:min-h-[868px] lg:grid-cols-[630px_520px] lg:justify-between lg:pt-[130px] lg:pb-[100px]">
        <div>
          <p className="text-[12px] leading-[1.5] font-medium lg:text-[14px] lg:leading-[1.4]">
            WEBINÁRIO AOS | DIA 26 DE OUTUBRO DE 2026
          </p>
          <p className="mt-2 text-[12px] leading-[1.5] font-medium text-brand lg:mt-[18px] lg:text-[14px] lg:leading-[1.4]">
            ONLINE, AO VIVO E GRATUITO
          </p>
          <h1 className="mt-[23px] text-[38px] leading-[1.1] font-medium tracking-[-1.6px] lg:mt-[6px] lg:text-[48px]">
            AOS 2026: ALPHA OPERATING SYSTEM
          </h1>
          <p className="mt-6 text-[16px] leading-[1.5] text-on-dark lg:text-[17px]">
            {EVENT_DESCRIPTION}
          </p>
          <div className="mt-6 text-[16px] leading-[1.4] text-on-dark lg:mt-[30px] lg:text-[17px] lg:leading-[1.5]">
            <p className="font-bold">Vender todo mês com previsibilidade, escala e lucratividade.</p>
            <p>O método completo, ao vivo.</p>
          </div>
          <CtaButton className="mt-7 min-h-[58px] lg:mt-6 lg:min-h-[65px] lg:px-6 lg:py-[21px]">
            Quero me inscrever na AOS
          </CtaButton>
        </div>

        <figure className="relative mt-[48px] aspect-square w-full overflow-hidden lg:mt-[10px] lg:w-[520px]">
          <Image
            src="/hero-socios.jpg"
            alt="Choco e Athos, sócios da Alpha"
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-brand px-4 py-3 text-[15px] leading-[1.3] font-medium text-white lg:px-6 lg:py-4 lg:text-[20px]">
            Mudar de modelo é mais lucrativo do que reinventar a roda
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
