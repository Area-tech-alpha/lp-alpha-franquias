import { LeadForm } from "@/components/LeadForm";
import { EVENT_TIME, EVENT_TITLE, FORM_ANCHOR } from "@/lib/event";

export function Signup() {
  return (
    <section id={FORM_ANCHOR} className="scroll-mt-4 bg-surface-alt">
      <div className="container-lp pt-[56px] pb-[56px] lg:grid lg:grid-cols-[minmax(0,570fr)_minmax(0,662fr)] lg:gap-x-[80px] lg:pt-[117px] lg:pb-[25px]">
        <div className="lg:pt-[29px]">
          <p className="text-[12px] leading-[1.5] font-medium tracking-[0.3px] text-accent lg:text-[14px] lg:leading-[1.4]">
            02 / GARANTA SUA VAGA
          </p>
          <h2 className="mt-5 text-[clamp(2.125rem,1.6rem+2.2vw,3.125rem)] leading-[1.1] font-medium tracking-[-0.028em] text-fg lg:mt-[28px]">
            Conteúdo de quem realmente constrói agência de marketing de sucesso no Brasil, gerindo lucro, pessoas e
            escala TODOS OS DIAS.
          </h2>
          <p className="mt-5 text-[16px] leading-[1.5] text-fg-muted lg:mt-[30px] lg:text-[19px]">
            Evento online e gratuito. Vagas de expansão restritas por região.
          </p>
        </div>

        <div className="mt-8 border border-card-border bg-card px-5 pt-6 pb-6 md:px-8 md:pt-8 lg:mt-0 lg:px-[39px] lg:pt-[28px] lg:pb-[22px]">
          <p className="text-[18px] leading-[1.3] font-bold text-fg lg:text-[22px] lg:leading-none">{EVENT_TITLE}</p>
          <p className="mt-5 text-[17px] leading-[1.3] font-medium text-accent lg:mt-[22px] lg:text-[22px] lg:leading-[1.16]">
            26 de outubro de 2026 · {EVENT_TIME}
            <br />
            Online, ao vivo e gratuito
          </p>
          <p className="mt-5 text-[16px] leading-[1.5] text-fg-muted lg:mt-[38px] lg:text-[17px]">
            Preencha seus dados para receber as informações de acesso.
          </p>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
