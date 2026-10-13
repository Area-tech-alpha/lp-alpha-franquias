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
| Seções | `components/` (Header, Hero, Pillars, Learn, Signup, LeadForm, Footer, ThemeToggle, ThemeProvider) |
| Foto dos sócios (1080×1080) | `public/hero-socios.jpg` |
| Logo principal (1391×396, transparente) | `public/alpha-logo.png` |
| Símbolo (selo do topo, card do formulário) | `public/alpha-simbolo.png` |
| Favicons (gerados pelo Next) | `app/favicon.ico`, `app/icon.png` (512×512), `app/apple-icon.png` (180×180) |

## Tema

A página abre sempre em light (idêntico à referência). O botão de sol/lua ativa o dark, e a escolha fica salva em `localStorage` (`alpha-theme`) via `next-themes` (`defaultTheme="light"`, `enableSystem={false}`), sem flash no carregamento.

Todas as cores são tokens em `app/globals.css`. O amarelo da marca é `--brand` (`#FFAB00`, tom do logotipo; hover `#E69A00`); em texto (labels, números da lista, data do evento) usa `--accent-text`, que hoje aponta para o mesmo amarelo.
