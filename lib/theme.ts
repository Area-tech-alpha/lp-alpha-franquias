export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "alpha-theme";

// Roda no <head> antes da pintura: escolha salva → preferência do sistema → dark.
// Sem escolha salva, acompanha mudanças do sistema em tempo real.
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement,k="${THEME_STORAGE_KEY}",s=null;try{s=localStorage.getItem(k)}catch(e){}var m=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)");function a(t){d.setAttribute("data-theme",t)}a(s==="light"||s==="dark"?s:m&&m.matches?"light":"dark");if(m&&m.addEventListener)m.addEventListener("change",function(e){var c=null;try{c=localStorage.getItem(k)}catch(_){}if(c!=="light"&&c!=="dark")a(e.matches?"light":"dark")})})();`;
