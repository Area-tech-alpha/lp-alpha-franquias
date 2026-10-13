import { CtaButton } from "@/components/CtaButton";

const TOPICS = [
  {
    title: "Gestão financeira real",
    description:
      "Controle de DRE, DFC e forecasting para quem quer empreender de forma real no mercado de marketing digital.",
  },
  {
    title: "Revenue Architecture e controle de receita na prática",
    description: "Como transformar sua base de clientes em um canhão de geração de receita.",
  },
  {
    title: "Como transformar o comercial em uma fonte previsível de crescimento",
    description:
      "O passo a passo para sair de contratos pequenos e negociar ticket alto usando o peso e o branding da Alpha.",
  },
  {
    title: "Eficiência operacional & IA",
    description:
      "Como escalar para 6 dígitos de faturamento sem precisar inchar sua equipe nem virar escravo do operacional.",
  },
];

export function Learn() {
  return (
    <section className="bg-surface">
      <div className="container-lp pt-[56px] pb-[56px] lg:pt-[96px] lg:pb-[115px]">
        <p className="text-[12px] leading-[1.5] font-medium tracking-[0.3px] text-accent lg:text-[14px] lg:leading-[1.4]">
          01 / O QUE VOCÊ VAI APRENDER
        </p>

        <div className="mt-[22px] lg:mt-[32px] lg:grid lg:grid-cols-[minmax(0,570fr)_minmax(0,662fr)] lg:gap-x-[80px]">
          <h2 className="text-[clamp(2rem,1.5rem+2vw,2.875rem)] leading-[1.1] font-medium tracking-[-0.026em] text-fg">
            A verdade nua e crua sobre escalar a maior agência de marketing nichada em 2026
          </h2>
          <p className="mt-6 text-[16px] leading-[1.5] text-fg-muted md:text-[18px] lg:mt-0 lg:text-[21px] lg:leading-[1.4]">
            Athos Vilarins, fundador e CEO da Assessoria Alpha, e Pedro Dias, Diretor Operacional da Alpha, abrem
            juntos o que aplicam para fazer agência vender, dar lucro e escalar.{" "}
            <strong className="font-bold text-fg">
              Para donos de agência e para quem quer empreender no marketing digital.
            </strong>
          </p>
        </div>

        <ol className="mt-10 border-b border-line lg:mt-[50px] lg:border-b-0">
          {TOPICS.map((topic, i) => (
            <li
              key={topic.title}
              className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 border-t border-line py-6 md:grid-cols-[56px_minmax(0,1fr)] lg:min-h-[168.5px] lg:grid-cols-[64px_minmax(0,440fr)_minmax(0,728fr)] lg:gap-x-[40px] lg:pt-[29px] lg:pb-[29px] lg:last:min-h-[148px]"
            >
              <span className="text-[22px] leading-[1.15] font-medium text-accent md:text-[26px] lg:text-[28px] lg:leading-none lg:font-normal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[17px] leading-[1.3] font-bold text-fg md:text-[19px] lg:text-[22px] lg:font-medium">
                {topic.title}
              </h3>
              <p className="col-start-2 mt-2 text-[15px] leading-[1.5] text-fg-muted md:text-[16px] lg:col-start-3 lg:row-start-1 lg:mt-0 lg:pl-[8px] lg:text-[18px]">
                {topic.description}
              </p>
            </li>
          ))}
        </ol>

        <CtaButton className="mx-auto mt-8 sm:max-w-[560px] lg:mt-0 lg:min-h-[67px] lg:px-6 lg:py-[22px]">
          Quero me inscrever na AOS
        </CtaButton>
      </div>
    </section>
  );
}
