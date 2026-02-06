import { test, expect } from '@playwright/test';

test('get to the first page', async ({ page }) => {
   await page.goto('/');

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('link', { name: 'Practice Software Testing -' })).toBeVisible();
});
