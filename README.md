# Abubakar Mahmood Portfolio

A static Astro portfolio for Abubakar Mahmood, a junior software engineer in Lahore focused on Flutter, backend APIs, offline-first systems, and production-minded delivery.

The site is deliberately small and progressively enhanced: its content and navigation remain usable without JavaScript, while JavaScript adds the slide-deck navigation, reveal effects, project tabs, keyboard shortcuts, and copy-to-clipboard behavior.

## Source and content rights

This repository is public so recruiters and other reviewers can inspect how the
portfolio is built. Unless a file says otherwise, the portfolio design, copy,
and first-party source are © 2026 Abubakar Mahmood, all rights reserved.
Public visibility does not grant permission to republish or reuse them.
Third-party dependencies remain under their own licenses.

## Stack

- Astro 7
- TypeScript
- Tailwind CSS 4
- Local variable fonts through Fontsource
- Static HTML, CSS, and small client-side scripts

## Requirements

- Node.js 24; `.nvmrc` is committed for local development and CI
- npm and the committed lockfile

```bash
nvm use
npm ci
```

Use `npm ci`, not `npm install`, for reproducible verification and deployment builds.

## Development

```bash
npm run dev
```

Astro's default local address is `http://localhost:4321`.

## Verification and production build

```bash
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

The `build` script runs Astro's type/content checks before producing the static `dist/` output. The Playwright suite exercises the built preview with JavaScript enabled, disabled, and partially blocked; it also covers external-link normalization, stale navigation fallback cancellation, discovery metadata, client/runtime errors, mobile overflow, keyboard behavior, clipboard failure, Axe serious/critical findings, and the static 404 response. GitHub Actions repeats the clean install, high-severity dependency audit, build, and Chromium suite on pushes and pull requests.

The latest bounded verification receipt is `docs/verification/2026-07-26-resilience-baseline.md`.

## Content ownership

Edit stable identity and navigation data in:

```text
src/config/site.ts
```

Edit curated project copy, order, links, and highlights in:

```text
src/data/projectOverrides.ts
```

Edit skill groups in:

```text
src/data/skills.ts
```

This keeps personal details and frequently changed content out of presentation components.

## Project feed behavior

`src/lib/projects.ts` treats curated project data as the stable source of truth. At build time it may enrich those entries with public GitHub metadata and add a small number of repositories carrying the `portfolio-featured` topic.

The fetch is bounded by a timeout, validates the response shape, accepts only HTTPS homepage links, restricts repository links to this account's `github.com` namespace, pins a GitHub REST API version, and fails open to curated content. A GitHub outage or rate-limit response therefore does not remove the portfolio's core project copy.

`GITHUB_TOKEN` is optional for local and hosting builds. It raises API limits but must remain a server/build secret; never expose it through a `PUBLIC_` environment variable or client script.

To feature an additional public repository automatically:

1. Add the `portfolio-featured` GitHub topic.
2. Rebuild and redeploy.
3. Add a curated entry when the project deserves stable, portfolio-grade wording and ordering.

Never synthesize a repository URL for private, renamed, or removed work. Use `repositoryNote` instead.

## Project structure

```text
.github/
  workflows/ci.yml
  dependabot.yml
public/
  js/init.js
  favicon.svg
  og.png
  robots.txt
src/
  components/
    Contact.astro
    Hero.astro
    Projects.astro
    Skills.astro
    SlideNav.astro
    TopBar.astro
  config/
    site.ts
  data/
    projectOverrides.ts
    skills.ts
  layouts/
    BaseLayout.astro
  lib/
    projects.ts
  pages/
    404.astro
    index.astro
  styles/
    global.css
tests/
  e2e/
    portfolio.spec.ts
playwright.config.ts
vercel.json
```

## Accessibility and resilience contract

Changes must preserve these behaviors:

- All page content remains visible and vertically scrollable when JavaScript is disabled or a client script fails.
- Top navigation, section dots, contact links, and project links remain ordinary links before enhancement.
- Every project remains reachable without JavaScript; the project rail becomes an ARIA tab interface only after the enhancement script initializes.
- Character-only global keyboard shortcuts are not used.
- Keyboard handlers do not override keys while focus is inside an interactive control.
- Motion honors `prefers-reduced-motion`.
- Focus indicators stay clearly visible.
- Touch targets remain at least 24 by 24 CSS pixels or have equivalent spacing.

## Deployment

Vercel is the authoritative production host for `abubakarmahmood.com`; `vercel.json` owns the build/output contract and low-risk response headers. Duplicate Netlify configuration is intentionally not retained.

Before promoting a deployment:

1. Run the clean build from a fresh checkout.
2. Test the production preview with JavaScript both enabled and disabled.
3. Run keyboard and screen-reader smoke tests.
4. Check every external project/profile link.
5. Validate the social card, sitemap, canonical URL, and 404 response.
6. Run Lighthouse in a documented browser/profile and retain the report rather than committing unsupported score claims.
7. Confirm the configured headers on the preview and production URLs.
8. Scan the deployed response headers with MDN HTTP Observatory.
9. Design and observe a Content Security Policy in report-only mode before enforcement; do not copy a generic enforcing policy into production.

## Maintenance rhythm

Monthly:

- Review Dependabot updates and CI.
- Check all featured repositories and demos.
- Confirm email, availability, role, and project claims.

Quarterly:

- Re-run accessibility, mobile, cross-browser, link, Lighthouse, and security-header checks.
- Refresh at least one project case study with concrete evidence, screenshots, decisions, constraints, and outcomes.

For framework upgrades, use a dedicated branch and visual/accessibility regression checks. Do not combine framework maintenance with a design or content rewrite.
