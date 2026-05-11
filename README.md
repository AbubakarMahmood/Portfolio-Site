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

The current portfolio highlights:

- PakConnect
- Incident & SLA Tracker
- SalahSync
- Unified Public Data Gateway
- Predictive Dispatch Simulator

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
  layouts/
    BaseLayout.astro
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

- GitHub: [AbubakarMahmood1](https://github.com/AbubakarMahmood1)
- LinkedIn: [abubakar-mahmood](https://linkedin.com/in/abubakar-mahmood)
