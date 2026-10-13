const PILLARS = ["Vender todo mês", "Previsibilidade", "Escala", "Lucratividade"];

// Faixa de transição entre o hero e o conteúdo (mesma quebra da referência).
// Cada seta fica presa ao item seguinte, para nunca sobrar sozinha no fim de uma linha no mobile.
export function Pillars() {
  return (
    <div className="border-y border-line bg-surface-alt">
      <ul className="container-lp flex min-h-[64px] flex-wrap items-center justify-center gap-x-3 gap-y-1 py-3 sm:gap-x-4 lg:h-[159.5px] lg:flex-nowrap lg:justify-between lg:gap-6 lg:py-0 lg:pr-[115px]">
        {PILLARS.map((pillar, i) => (
          <li key={pillar} className="flex items-center gap-3 whitespace-nowrap sm:gap-4 lg:contents">
            {i > 0 && (
              <span aria-hidden="true" className="text-[14px] leading-none font-medium text-accent lg:text-[30px] lg:leading-[1.2] lg:tracking-[2px]">
                ↗
              </span>
            )}
            <span className="text-[12px] leading-[1.5] font-medium tracking-[1px] text-fg uppercase lg:text-[24px] lg:leading-[1.2]">
              {pillar}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
