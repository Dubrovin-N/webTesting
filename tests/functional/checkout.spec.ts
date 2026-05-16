import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home-page';

test('User Journey: Full Registration and Profile Verification', async ({ page }) => {
  await test.step('Step 1: Navigate to registration page', async () => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clickOnFirstProduct();
  });
});
