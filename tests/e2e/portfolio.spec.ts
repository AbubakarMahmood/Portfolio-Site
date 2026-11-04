import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { safeGitHubUrl, safeHttpsUrl } from '../../src/lib/projects';

const sectionIds = ['intro', 'work', 'stack', 'contact'];
const knownProjectTitles = [
  'PakConnect',
  'Inventory & Work Order API',
  'Incident & SLA Tracker',
  'Go Rate Limiter',
  'SalahSync'
];

async function expectKnownContent(page: Page) {
  for (const id of sectionIds) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }

  for (const title of knownProjectTitles) {
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeAttached();
  }
}

async function expectAllProjectPanelsVisible(page: Page) {
  const panels = page.locator('[data-project-panel]');
  expect(await panels.count()).toBeGreaterThanOrEqual(knownProjectTitles.length);

  for (const panel of await panels.all()) {
    await expect(panel).toBeVisible();
  }
}

async function expectPageScrollable(page: Page) {
  const overflow = await page.evaluate(() => {
    const main = document.querySelector<HTMLElement>('[data-scroll-root]');
    const documentRoot = document.scrollingElement;

    return Math.max(
      main ? main.scrollHeight - main.clientHeight : 0,
      documentRoot ? documentRoot.scrollHeight - window.innerHeight : 0
    );
  });

  expect(overflow).toBeGreaterThan(100);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

async function keydownWasPrevented(target: Locator, key: string) {
  return target.evaluate((element, pressedKey) => {
    let prevented = false;
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === pressedKey) prevented = event.defaultPrevented;
      },
      { once: true }
    );
    element.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: pressedKey,
        bubbles: true,
        cancelable: true
      })
    );
    return prevented;
  }, key);
}

async function blockInlineEnhancements(page: Page) {
  // Astro may emit a component script as an external chunk once it grows.
  // Block both forms, leaving the separate early /js/init.js bootstrap intact.
  await page.route('**/_astro/*.js', route => route.abort());
  await page.route(
    (url) => url.pathname === '/',
    async (route) => {
      const response = await route.fetch();
      await route.fulfill({
        response,
        headers: {
          ...response.headers(),
          'content-security-policy': "script-src 'self'"
        }
      });
    }
  );
}

test('rejects unsafe project URL schemes and GitHub namespaces', () => {
  expect(safeHttpsUrl('https://example.com/demo')).toBe('https://example.com/demo');
  expect(safeHttpsUrl('http://example.com/demo')).toBeUndefined();
  expect(safeHttpsUrl('javascript:alert(1)')).toBeUndefined();
  expect(safeHttpsUrl('data:text/html,unsafe')).toBeUndefined();
  expect(safeHttpsUrl('https://user:secret@example.com/demo')).toBeUndefined();

  expect(safeGitHubUrl('https://github.com/AbubakarMahmood/pak_connect')).toBe(
    'https://github.com/AbubakarMahmood/pak_connect'
  );
  expect(safeGitHubUrl('https://github.com/another-owner/pak_connect')).toBeUndefined();
  expect(safeGitHubUrl('https://github.com.evil.example/AbubakarMahmood/pak_connect')).toBeUndefined();
});

test('publishes canonical discovery and structured metadata', async ({ page, request }) => {
  await page.goto('/');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://abubakarmahmood.com/'
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://abubakarmahmood.com/og.png'
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    'content',
    'Abubakar Mahmood - Junior Software Engineer'
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image'
  );
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.locator('link[rel="sitemap"]')).toHaveAttribute(
    'href',
    '/sitemap-index.xml'
  );

  const structuredData = await page
    .locator('script[type="application/ld+json"]')
    .evaluate((element) => JSON.parse(element.textContent ?? '{}'));
  expect(structuredData['@context']).toBe('https://schema.org');
  expect(structuredData['@graph'].map((entry: { '@type': string }) => entry['@type'])).toEqual([
    'Person',
    'WebSite'
  ]);

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain(
    'Sitemap: https://abubakarmahmood.com/sitemap-index.xml'
  );

  for (const path of ['/favicon.svg', '/og.png', '/sitemap-index.xml']) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should be available`).toBe(true);
  }
});

test('loads and enhances without client or same-origin request errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
  page.on('requestfailed', (request) => {
    if (new URL(request.url()).origin === 'http://127.0.0.1:4321') {
      errors.push(`request: ${request.url()} (${request.failure()?.errorText ?? 'failed'})`);
    }
  });

  await page.goto('/');
  await page.getByRole('tab', { name: 'SalahSync' }).click();
  await page.locator('header a[href="#contact"]').click();
  await expect(page).toHaveURL(/#contact$/);
  expect(errors).toEqual([]);
});

test.describe('baseline without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('keeps every section, project, and native link usable', async ({ page }) => {
    await page.goto('/');

    await expectKnownContent(page);
    await expectAllProjectPanelsVisible(page);
    await expectPageScrollable(page);
    await expect(page.locator('#copy-email')).toBeHidden();

    await page.locator('header a[href="#contact"]').click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeVisible();
  });
});

test.describe('progressive enhancement', () => {
  test('adds accessible navigation and truthful project links', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveClass(/\bjs\b/);
    await expect(page.locator('html')).toHaveClass(/\bnav-enhanced\b/);
    await expect(page.locator('[data-project-deck]')).toHaveClass(/\bis-enhanced\b/);
    await expect(page.locator('[role="tablist"]')).toBeVisible();
    await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
    await expect(page.locator('[role="tabpanel"]:not([hidden])')).toHaveCount(1);

    const salahSyncTab = page.getByRole('tab', { name: /SalahSync/ });
    await salahSyncTab.click();
    const panelId = await salahSyncTab.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();

    const salahSyncPanel = page.locator(`#${panelId}`);
    await expect(salahSyncPanel).toBeVisible();
    await expect(salahSyncPanel).toContainText('Source repository is private');
    await expect(
      salahSyncPanel.getByRole('link', {
        name: 'SalahSync public support and release repository on GitHub (opens in a new tab)'
      })
    ).toHaveAttribute('href', 'https://github.com/AbubakarMahmood/salahsync-support');

    const salahSyncGitHubLinks = await page
      .locator('a[href^="https://github.com/AbubakarMahmood/salah"]')
      .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
    expect(salahSyncGitHubLinks).toEqual([
      'https://github.com/AbubakarMahmood/salahsync-support'
    ]);
    await expect(
      page.locator('a[href="https://github.com/AbubakarMahmood/pak_connect"]')
    ).toHaveCount(1);
  });

  test('preserves skip navigation and excludes controls from global arrows', async ({ page }) => {
    await page.goto('/');

    const skipLink = page.locator('.skip-link');
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();

    await expect(keydownWasPrevented(page.locator('#copy-email'), 'ArrowDown')).resolves.toBe(
      false
    );
    await expect(keydownWasPrevented(page.locator('#main-content'), 'ArrowDown')).resolves.toBe(
      true
    );
  });

  test('surfaces a recoverable clipboard fallback', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: undefined
      });
    });
    await page.goto('/');

    const copyButton = page.locator('#copy-email');
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    await expect(copyButton).toHaveText('selected');
    await expect(page.locator('#copy-email-status')).toContainText(
      'Email address selected'
    );
    await expect
      .poll(() => page.evaluate(() => window.getSelection()?.toString() ?? ''))
      .toContain('theabubakar321@gmail.com');
  });

  test('discards stale smooth-scroll fallbacks after newer navigation', async ({ page }) => {
    await page.addInitScript(() => {
      const calls: Array<{ top: number; behavior: ScrollBehavior | undefined }> = [];
      const testWindow = window as Window & {
        __portfolioScrollCalls?: Array<{ top: number; behavior: ScrollBehavior | undefined }>;
      };
      testWindow.__portfolioScrollCalls = calls;

      const originalScrollTo = HTMLElement.prototype.scrollTo;
      HTMLElement.prototype.scrollTo = function (
        optionsOrX?: ScrollToOptions | number,
        y?: number
      ) {
        if (
          this.hasAttribute('data-scroll-root') &&
          typeof optionsOrX === 'object'
        ) {
          calls.push({ top: optionsOrX.top ?? 0, behavior: optionsOrX.behavior });
          if (optionsOrX.behavior === 'smooth') return;
        }

        Reflect.apply(
          originalScrollTo,
          this,
          typeof optionsOrX === 'number'
            ? [optionsOrX, y ?? 0]
            : optionsOrX
              ? [optionsOrX]
              : []
        );
      };
    });
    await page.goto('/');
    await expect
      .poll(() =>
        page.evaluate(() => {
          const testWindow = window as Window & {
            __portfolioScrollCalls?: Array<{
              top: number;
              behavior: ScrollBehavior | undefined;
            }>;
          };
          return (testWindow.__portfolioScrollCalls ?? []).some(
            (call) => call.behavior === 'auto'
          );
        })
      )
      .toBe(true);

    await page.evaluate(() => {
      const testWindow = window as Window & {
        __portfolioScrollCalls?: Array<{ top: number; behavior: ScrollBehavior | undefined }>;
      };
      if (testWindow.__portfolioScrollCalls) {
        testWindow.__portfolioScrollCalls.length = 0;
      }
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
      );
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
      );
    });
    await page.waitForTimeout(650);

    const result = await page.evaluate(() => {
      const testWindow = window as Window & {
        __portfolioScrollCalls?: Array<{ top: number; behavior: ScrollBehavior | undefined }>;
      };
      const automaticCalls = (testWindow.__portfolioScrollCalls ?? []).filter(
        (call) => call.behavior === 'auto'
      );
      const stackTop = document.getElementById('stack')?.offsetTop;
      return { automaticCalls, stackTop };
    });

    expect(result.automaticCalls).toEqual([{ top: result.stackTop, behavior: 'auto' }]);
  });
});

test.describe('partial script failure', () => {
  test('keeps content usable when bundled enhancements are blocked', async ({ page }) => {
    await blockInlineEnhancements(page);
    await page.goto('/');

    await expect(page.locator('html')).toHaveClass(/\bjs\b/);
    await expect(page.locator('html')).not.toHaveClass(/\bnav-enhanced\b/);
    await expectKnownContent(page);
    await expectAllProjectPanelsVisible(page);
    await expectPageScrollable(page);
    await expect(page.locator('#copy-email')).toBeHidden();
  });

  test('recovers when only the early bootstrap fails', async ({ page }) => {
    await page.route('**/js/init.js', (route) => route.abort());
    await page.goto('/');

    await expect(page.locator('html')).toHaveClass(/\bjs\b/);
    await expect(page.locator('html')).toHaveClass(/\bnav-enhanced\b/);
    await expect(page.locator('[data-project-deck]')).toHaveClass(/\bis-enhanced\b/);
    await expect(page.locator('[role="tabpanel"]:not([hidden])')).toHaveCount(1);
  });

  test('falls back to the ordinary document when all scripts fail', async ({ page }) => {
    await blockInlineEnhancements(page);
    await page.route('**/js/init.js', (route) => route.abort());
    await page.goto('/');

    await expect(page.locator('html')).not.toHaveClass(/\bjs\b/);
    await expectKnownContent(page);
    await expectAllProjectPanelsVisible(page);
    await expectPageScrollable(page);
  });
});

test.describe('responsive and alternate presentation modes', () => {
  test.use({ viewport: { width: 320, height: 667 } });

  test('avoids page-level overflow and keeps primary controls large enough', async ({ page }) => {
    await page.goto('/');

    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole('heading', { name: 'SELECTED WORK' })).toBeVisible();

    const targetBoxes = await page
      .locator('header .nav-jump, .project-tab, #copy-email')
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            const style = window.getComputedStyle(element);
            return style.display !== 'none' && style.visibility !== 'hidden';
          })
          .map((element) => {
            const box = element.getBoundingClientRect();
            return { width: box.width, height: box.height };
          })
      );

    for (const box of targetBoxes) {
      expect(box.width).toBeGreaterThanOrEqual(24);
      expect(box.height).toBeGreaterThanOrEqual(24);
    }
  });
});

test('honors reduced motion and exposes every project when printing', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.locator('html')).not.toHaveClass(/\breveal-enabled\b/);
  for (const reveal of await page.locator('.reveal').all()) {
    await expect(reveal).toBeVisible();
  }

  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  await expectAllProjectPanelsVisible(page);
});

test('has no serious or critical Axe violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  const severeViolations = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical'
  );

  expect(
    severeViolations,
    severeViolations
      .map((violation) => `${violation.id}: ${violation.help}`)
      .join('\n')
  ).toEqual([]);
});

test('serves an indexed-safe 404 with a recovery link', async ({ page }) => {
  const response = await page.goto('/definitely-not-a-real-route');

  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle(/404 - Page not found/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow'
  );
  await expect(page.getByRole('link', { name: 'return home' })).toHaveAttribute('href', '/');
});
