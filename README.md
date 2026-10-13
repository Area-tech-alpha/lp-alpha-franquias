# AOS 2026 – Alpha Operating System (LP)

Landing page do webinário AOS 2026. Next.js (App Router) + TypeScript + Tailwind CSS.

## Rodando localmente

```bash
cp .env.example .env.local   # preencha WEBHOOK_URL
npm install
npm run dev
```

## Deploy (Vercel)

Importe o repositório na Vercel e defina a variável de ambiente `WEBHOOK_URL`. Não precisa de mais nenhuma configuração.

- O formulário envia para `/api/lead` (Route Handler), que valida os dados e repassa um POST JSON para `WEBHOOK_URL`, com as UTMs da URL (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`), o `fbclid`, `page_url` e `submitted_at`.
- Sem `WEBHOOK_URL` configurada, `/api/lead` responde 500 e o formulário mostra a mensagem de erro.
- `NEXT_PUBLIC_SITE_URL` é opcional e serve de base para as metatags OG. Sem ela, a página usa o domínio de produção da Vercel.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Horário do evento, título, links de Termos/Privacidade | `lib/event.ts` |
| Cores da marca e dos temas (dark/light) | `app/globals.css` (tokens em `:root` / `[data-theme]`) |
| Opções dos selects e validação | `lib/lead.ts` |
| Seções | `components/` (Header, Hero, Pillars, Learn, Signup, LeadForm, Footer, ThemeToggle) |
| Foto dos sócios (1080×1080) | `public/hero-socios.jpg` |
| Logo para fundo claro / escuro | `public/logo-alpha.svg` / `public/logo-alpha-dark.svg` |

## Tema

Dark por padrão; segue o `prefers-color-scheme` do sistema até o visitante usar o botão de sol/lua, e aí a escolha fica salva em `localStorage` (`alpha-theme`). O script em `lib/theme.ts` roda no `<head>` antes da pintura, então não há flash de tema.

Em texto, o amarelo vira `--accent-text`: `#FFC400` no dark e `#8A6500` no light (o `#FFC400` e o `#B38600` sobre branco não passam no WCAG AA).
