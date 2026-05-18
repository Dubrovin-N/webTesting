import { test, expect } from '@playwright/test';
import { createRandomUser } from '../../data/user-factory';
import { AuthFlow } from '../../flows/auth.flow';
import { ProfilePage } from '../../pages/profile-page';

test('User Journey: Full Registration and Profile Verification', async ({ page }) => {
  const randomUser = createRandomUser();
  const authFlow = new AuthFlow(page);
  const profilePage = new ProfilePage(page);

  await test.step('Register and Login', async () => {
    await authFlow.registerAndLogin(randomUser);
    await expect(page).not.toHaveURL(/.*login/);
  });

  await test.step('Verify profile data in My Account', async () => {
    await expect(profilePage.pageTitle).toBeVisible();
    await expect(profilePage.pageTitle).toContainText('My account');

    await expect(profilePage.navMenu).toHaveText(
      new RegExp(`${randomUser.firstName}\\s+${randomUser.lastName}`),
      { ignoreCase: true },
    );
  });
});
