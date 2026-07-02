# Portfolio Site — Project Guide

Personal portfolio for **Abubakar Mahmood**, deployed at https://abubakarmahmood.com (Vercel, auto-deploys from `main`).

## Identity & Voice

- Terminal / command-line aesthetic: dark-only (`#060809` bg), mint-cyan accent (`#00e5c7`), `$ command` section prompts.
- Fonts are self-hosted via Fontsource: **Space Grotesk Variable** (headings), **JetBrains Mono Variable** (body). No Google Fonts requests.
- Minimalist and resume-focused. No heavy animation, no 3D, no gimmicks that hurt performance or clarity. Subtle micro-interactions only (typed hero command, scroll reveals, hover nudges) — all gated on `prefers-reduced-motion`.

## Architecture

- **Astro 4** + Tailwind (via `@astrojs/tailwind`) + `@astrojs/sitemap` (pinned to 3.2.x — newer majors break on Astro 4).
- Single page (`src/pages/index.astro`) composed of full-viewport slide sections: Hero (`#intro`), Projects (`#work`), Skills (`#stack`), Contact (`#contact`).
- `SlideNav.astro` owns the slide UX: keyboard nav (arrows / 1-4 / ESC — modifier combos are deliberately ignored so browser shortcuts still work), nav dots + section indicator (desktop `lg:` only), scroll-reveal IntersectionObserver, and `#hash` deep links.
- `TopBar.astro` is the fixed header; its links jump sections via the shared `.nav-jump[data-section]` convention.
- Design tokens live in `src/styles/global.css` as CSS variables (`--color-*`, `--font-*`). Use tokens, not hard-coded colors.

## Projects data

- `src/lib/projects.ts` merges curated entries from `src/data/projectOverrides.ts` with live GitHub repos fetched **at build time** for user `AbubakarMahmood` (note: no trailing `1` — that account doesn't exist).
- Extra repos are auto-included when tagged with the `portfolio-featured` topic on GitHub.
- GitHub fetch failures degrade gracefully to curated data; optional `GITHUB_TOKEN` env var raises the rate limit.

## Conventions & gotchas

- `html`/`body` are `overflow: hidden`; the `#slide-scroll` main element owns scrolling (scroll-snap proximity on mobile, mandatory on `md+`).
- All personal facts (email `theabubakar321@gmail.com`, LinkedIn `abubakar-mahmood`, Lahore/UTC+05, "Junior Software Engineer") must stay accurate — never invent claims or projects.
- SEO assets: `public/og.png` (1200×630), `public/favicon.svg`, `public/robots.txt`, JSON-LD Person schema in `BaseLayout.astro`. Update og.png if the name/role/domain changes.
- `npm run build` runs `astro check` first; keep it green before pushing.
