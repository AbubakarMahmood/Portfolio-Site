# Abubakar Mahmood Portfolio

Personal portfolio site for Abubakar Mahmood, a junior software engineer based in Lahore focused on Flutter, backend APIs, offline-first systems, and production-minded project delivery.

The site is intentionally small: one Astro page, static output, minimal client JavaScript, and explicit deployment config for Vercel and Netlify.

## Live Deployment

This repository is ready for Git-based deployment.

| Platform | Build command | Output directory |
| --- | --- | --- |
| Vercel | `npm run build` | `dist` |
| Netlify | `npm run build` | `dist` |

Deployment config is committed in:

- `vercel.json`
- `netlify.toml`

## Tech Stack

- Astro
- TypeScript
- Tailwind CSS
- Static HTML/CSS/JS output

## Site Content

Project data is build-time dynamic. `src/components/Projects.astro` loads from `src/lib/projects.ts`, which fetches public GitHub repo metadata during `npm run build` and merges it with curated copy in `src/data/projectOverrides.ts`.

The current curated highlights are:

- PakConnect
- Incident & SLA Tracker
- SalahSync
- Unified Public Data Gateway
- Predictive Dispatch Simulator

To add a new project without touching the component:

1. Make the GitHub repo public.
2. Add the GitHub topic `portfolio-featured`.
3. Rebuild/redeploy the portfolio.

For homepage-grade wording, add an entry in `src/data/projectOverrides.ts`. Curated entries control title, order, description, stack labels, and metric; GitHub still supplies the live repo URL and homepage when available. Set `GITHUB_TOKEN` in the build environment if GitHub rate limits become noisy.

The skills and positioning are aligned with the resume profile: Flutter/Dart, FastAPI/Python, TypeScript/GraphQL, Java, SQL, Docker, CI, testing, and observability.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Build

```bash
npm run build
```

The build runs:

```bash
astro check && astro build
```

Generated output is written to `dist/`.

## Preview Production Build

```bash
npm run preview
```

## Quality Checks

Before deployment, this site was checked with:

- `npm run build`
- Local browser smoke test
- Keyboard navigation test
- Lighthouse audit

Latest local Lighthouse result:

| Category | Score |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

## Project Structure

```text
src/
  components/
    Contact.astro
    Hero.astro
    Projects.astro
    Skills.astro
    SlideNav.astro
  data/
    projectOverrides.ts
  layouts/
    BaseLayout.astro
  lib/
    projects.ts
  pages/
    index.astro
  styles/
    global.css
```

## Maintenance Notes

- Keep project claims tied to real repositories, demos, or resume-backed work.
- Re-run `npm run build` before pushing.
- Re-run Lighthouse after major layout or asset changes.
- Avoid committing generated folders such as `dist/`, `.astro/`, `.vercel/`, or `node_modules/`.

## Author

Abubakar Mahmood

- GitHub: [AbubakarMahmood](https://github.com/AbubakarMahmood)
- LinkedIn: [abubakar-mahmood](https://linkedin.com/in/abubakar-mahmood)
