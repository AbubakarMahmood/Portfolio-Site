import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 1280, height: 600 }, { width: 640, height: 360 }, { width: 320, height: 667 }]) {
  test(`real keyboard reading stays reachable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('[data-project-deck]')).toHaveClass(/is-enhanced/);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
    const scrollTop = () => page.locator('[data-scroll-root]').evaluate(el => el.scrollTop);
    const start = await scrollTop();
    await page.keyboard.press('ArrowDown');
    await expect.poll(scrollTop).toBeGreaterThan(start);
    expect(await scrollTop() - start).toBeLessThanOrEqual(41);
    await page.keyboard.press('PageDown');
    await expect.poll(scrollTop).toBeGreaterThan(start + 50);
    const afterPage = await scrollTop();
    await page.keyboard.press('Space');
    await expect.poll(scrollTop).toBeGreaterThan(afterPage);
    await page.keyboard.press('Shift+Space');
    await expect.poll(scrollTop).toBeLessThan(afterPage + 1);
    await page.keyboard.press('End');
    await expect(page.locator('#contact')).toBeInViewport();
    await page.keyboard.press('Home');
    await expect.poll(scrollTop).toBe(0);
    await expect(page.locator('#intro a[href^="mailto:"]')).toBeVisible();
    await page.locator('header a[href="#contact"]').focus();
    await page.keyboard.press('PageDown');
    await expect.poll(scrollTop).toBeGreaterThan(50);
    await page.getByRole('tab', { name: /PakConnect/ }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('tab', { name: /Inventory & Work Order API/ })).toBeFocused();
  });
}
