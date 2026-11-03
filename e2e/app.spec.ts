import { expect, test } from '@playwright/test';

test.describe('Pokédex Application', () => {
  test('redirects from root to tabs/list and displays Pokédex title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*tabs\/list/);
    await expect(page.locator('.brand-title')).toContainText('Pokédex');
  });

  test('displays search bar and type filter chips', async ({ page }) => {
    await page.goto('/tabs/list');
    await expect(page.locator('.custom-searchbar')).toBeVisible();
    await expect(page.locator('app-type-filter')).toBeVisible();
  });

  test('navigates to favorites page', async ({ page }) => {
    await page.goto('/tabs/list');
    await page.click('a[routerLink="/tabs/favorites"]');
    await expect(page).toHaveURL(/.*tabs\/favorites/);
    await expect(page.locator('.brand-title')).toContainText('Favorite Pokémon');
  });
});
