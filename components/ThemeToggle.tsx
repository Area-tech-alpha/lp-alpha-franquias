"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, (): Theme => "dark");
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Sem localStorage (aba anônima/bloqueada): o tema vale só para esta visita.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={next === "light" ? "Ativar tema claro" : "Ativar tema escuro"}
      title={next === "light" ? "Tema claro" : "Tema escuro"}
      className="grid size-11 shrink-0 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-alt hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      {/* Ícones trocados por CSS para não depender do estado no primeiro paint. */}
      <svg viewBox="0 0 24 24" aria-hidden="true" className="hidden size-5 dark:block" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 dark:hidden" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}
