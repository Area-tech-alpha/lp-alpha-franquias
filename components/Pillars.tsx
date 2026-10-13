import { Fragment } from "react";

const PILLARS = ["Vender todo mês", "Previsibilidade", "Escala", "Lucratividade"];

// Faixa de transição entre o hero e o conteúdo (mesma quebra da referência).
export function Pillars() {
  return (
    <div className="border-b border-line bg-soft">
      <div className="container-lp flex min-h-[53px] items-center justify-between gap-1 py-2 lg:h-[159.5px] lg:gap-6 lg:pr-[115px]">
        {PILLARS.map((pillar, i) => (
          <Fragment key={pillar}>
            {i > 0 && (
              <span aria-hidden="true" className="text-[14px] leading-none font-medium text-brand lg:tracking-[2px] lg:text-[30px] lg:leading-[1.2]">
                ↗
              </span>
            )}
            <span className="min-w-0 text-center text-[10px] leading-[1.5] font-medium tracking-[0.5px] min-[400px]:text-[11px] min-[400px]:tracking-[1px] lg:tracking-[1px] text-wine uppercase lg:text-[24px] lg:leading-[1.2]">
              {pillar}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
