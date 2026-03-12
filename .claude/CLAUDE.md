# dtc-live — Next.js Project

Rebuild of dtc.live from Ghost to Next.js on Vercel.
Ghost is used as headless CMS via Content API.

## Active Skills

Load these skills for frontend/component work:
- `.claude/skills/frontend-design/` — design system, editorial UI
- `.claude/skills/next-best-practices/` — Next.js App Router patterns
- `.claude/skills/vercel-react-best-practices/` — performance patterns

## Stack
- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS v4
- Ghost CMS (headless, Content API)
- Deployed on Vercel (vyg team)

## Key Rules
- Use npm (not pnpm)
- All fetches use React.cache() for deduplication
- Server Components by default; client components only when needed
- Import from specific files, not barrel exports
- Ghost API credentials: .env.local (gitignored)

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint check
