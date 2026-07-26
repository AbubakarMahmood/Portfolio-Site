# Portfolio Resilience Baseline

**Date:** 2026-07-26  
**Base commit:** `c169eeb3adf536363febb0528e2f993a0e6b0646`  
**Review branch:** `codex/portfolio-resilience-review`  
**Status:** `LOCALLY_VERIFIED; LIVE_PROMOTION_PENDING`

## Scope

- Preserve the existing visual design while making the page content-first and progressively enhanced.
- Keep every section and project readable when JavaScript is disabled or either client-script layer fails.
- Replace fabricated or stale project links with verified public destinations.
- Add bounded GitHub metadata enrichment, accessible navigation/project controls, clipboard recovery, a real static 404, CI, dependency update routing, and browser regression coverage.
- Upgrade the build stack to Astro 7 and Tailwind CSS 4 without design drift, then remove all advisories found in the committed npm lockfile.
- Validate and close the historical project-link injection reports and the stale-scroll fallback race against the current branch.
- Establish Vercel as the single deployment authority and stage low-risk response headers.

Project selection, portfolio claim rewriting, production deployment, and CSP enforcement were not part of this local remediation.

## Verification

| Gate | Result |
|---|---|
| `npm ci` | Pass with the committed lockfile |
| `npm run build` | Pass; Astro reports 0 errors, 0 warnings, and 0 hints; 2 static pages built |
| `npm run test:e2e` | 15/15 Chromium scenarios pass |
| Dependency scan | `npm audit` and OSV Scanner report 0 known vulnerabilities in the committed lockfile |
| No JavaScript | All four sections and all project panels remain visible and scrollable |
| Partial script failure | Bundled-enhancement-only, bootstrap-only, and all-script failure paths pass |
| Accessibility | Skip navigation, ARIA tab enhancement, keyboard-control isolation, reduced motion, print fallback, and zero serious/critical Axe violations |
| Responsive layout | 320x667 automated overflow/target checks pass; 390x844 visual review passes |
| Link truth | PakConnect and the four other public project destinations resolve as public; SalahSync points to the public support/release repository and does not expose the private source URL |
| Project URL safety | Only HTTPS homepage URLs survive normalization; GitHub links must be under `github.com/AbubakarMahmood/<repo>` |
| Navigation race | A newer section request cancels and invalidates the older smooth-scroll fallback |
| Metadata/runtime | Canonical, social, JSON-LD, favicon, robots, sitemap, console, page-error, and same-origin request checks pass |
| 404 | Unknown local-preview route returns HTTP 404 with `noindex, nofollow` and a recovery link |
| Visual review | Desktop, mobile, and full no-JavaScript captures reviewed without clipping or page-level overflow |

The browser run used Playwright `1.62.0` with Chrome for Testing `151.0.7922.34`.

## Security Follow-up

The two supplied medium findings describe the same historical URL-validation gap at different commits. The current branch rejects `javascript:`, `data:`, HTTP, credential-bearing URLs, non-GitHub hosts, and GitHub repository paths outside the expected owner namespace before values reach an anchor.

The supplied informational stale-scroll finding was valid as a self-only UX race, not a security boundary failure. The fallback is now tracked, cancelled, and guarded by the latest navigation request. Both paths have dedicated regression coverage.

The original Astro 4 lockfile produced 31 OSV advisories across 11 packages. A disposable Astro 7/Tailwind 4 migration passed the full build/browser suite and visual comparison before promotion. The committed dependency tree now returns zero npm-audit and OSV findings.

## Review Bundle Disposition

The complete 54-item findings register has been consumed, not only its L3 safe-remediation overlay:

- **Implemented and locally verified:** F-001 through F-026, F-031, F-032,
  F-034 through F-049, and F-051. F-039 is closed with an explicit
  all-rights-reserved source/content statement.
- **Implemented locally; live evidence pending:** F-027 and F-040. Vercel is
  the sole configured host and low-risk headers are version controlled, but
  production response verification still requires deployment.
- **Mitigated by bounded design:** F-020 and F-033. Curated content survives
  GitHub failure, metadata is parsed and URL-normalized, and external changes
  cannot invent core project copy. A separate PR-based metadata-sync system is
  not justified for this small site.
- **Truthful link closed; deeper proof deferred:** F-030. PakConnect is public
  and directly linked; richer case-study evidence remains part of the content
  gate rather than a link defect.
- **Evidence-gated content work:** F-028, F-029, and F-050. Case studies,
  project visuals, and a resume route wait for verified owning-repository
  evidence and selection of a canonical public resume; no claims or document
  were invented to close the audit cosmetically.
- **Explicitly optional or rejected now:** F-052 through F-054. Analytics,
  theme switching, a blog, CMS, PWA, and contact-form backend remain omitted
  until a demonstrated need outweighs their maintenance and privacy cost.

Roadmap phases 0–3 and 5 are complete locally to the extent possible before a
Vercel preview. Phase 4 remains evidence-gated content work. Phase 6 remains
trigger-gated optional product work. Lighthouse, Observatory, production
headers, and exact deployed-commit claims cannot be earned before promotion.

## Live Boundary

At review time, `https://abubakarmahmood.com` served the unchanged base commit through Vercel. The local branch is not deployed, so the new custom 404, Vercel headers, and resilience changes are not production-proven.

Before promotion:

1. Review and commit the branch intentionally.
2. Push it and inspect the Vercel preview at desktop/mobile widths with JavaScript enabled and disabled.
3. Merge only after preview checks pass.
4. Verify the production commit, project links, 404 status, and configured response headers.
5. Design and observe CSP in report-only mode before considering enforcement.

## Deferred

- Curated project ordering and claim copy remain evidence-gated by the owning repositories.
- CSP remains an observed-preview decision, not a copied production policy.
- Lighthouse and external security-header scores require a deployed final commit and retained reports.
