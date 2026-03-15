import { test, expect } from '@playwright/test';
import { createRandomUser } from '../../data/user-factory';
import { AuthFlow } from '../../flows/auth.flow';

test('User Journey: Full Registration and Profile Verification', async ({ page }) => {
  const randomUser = createRandomUser();
  const authFlow = new AuthFlow(page);

  await test.step('Register and Login', async () => {
    // Весь твой прошлый Step 2 и Step 3 теперь здесь:
    await authFlow.registerAndLogin(randomUser);
    await expect(page).not.toHaveURL(/.*login/);
  });

  await test.step('Verify profile data in My Account', async () => {
    const pageTitle = page.locator('[data-test="page-title"]');
    await expect(pageTitle).toBeVisible();
    await expect(pageTitle).toContainText('My account');
    
    const pageUserName = page.locator('[data-test="nav-menu"]');
    await expect(pageUserName).toHaveText(
      new RegExp(`${randomUser.firstName}\\s+${randomUser.lastName}`), 
      { ignoreCase: true }
    );
  });
});