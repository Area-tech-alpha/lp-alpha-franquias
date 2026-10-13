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

- O formulário envia para `/api/lead` (Route Handler), que valida os dados e repassa um POST JSON para `WEBHOOK_URL`, com as UTMs da URL (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`), `page_url` e `submitted_at`.
- `NEXT_PUBLIC_SITE_URL` é opcional e serve de base para as metatags OG. Sem ela, a página usa o domínio de produção da Vercel.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Horário do evento, título, links de Termos/Privacidade | `lib/event.ts` |
| Opções dos selects e validação | `lib/lead.ts` |
| Seções | `components/` (Header, Hero, Pillars, Learn, Signup, LeadForm, Footer) |
| Foto dos sócios (1080×1080) | `public/hero-socios.jpg` |
| Logo | `public/logo-alpha.svg` |
