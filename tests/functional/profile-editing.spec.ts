import { test, expect } from '@playwright/test';
import { createRandomUser, getRandomPassword } from '../../data/user-factory';
import { AuthFlow } from '../../flows/auth.flow';
import { ProfilePage } from '../../pages/profile-page';
import { get } from 'node:http';

test.describe('Profile Management', () => {
  let authFlow: AuthFlow;
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    authFlow = new AuthFlow(page);
    profilePage = new ProfilePage(page);
  });

  test('User can update first and last name', async ({ page }) => {
    const user = createRandomUser();
    const newFirstName = 'UpdatedName';

    await authFlow.registerAndLogin(user);

    await page.locator('[data-test="nav-menu"]').click();
    await page.locator('[data-test="nav-profile"]').click();

    await test.step('Update name and verify', async () => {
      await profilePage.updateContactInfo(newFirstName, user.lastName);
      await expect(profilePage.firstNameField).toHaveValue(newFirstName);
    });
  });

  test('User can change their password and re-login with new password', async ({ page }) => {
    const user = createRandomUser();
    const newPassword = getRandomPassword();

    await authFlow.registerAndLogin(user);
    const profilePage = new ProfilePage(page);

    await page.locator('[data-test="nav-menu"]').click();
    await page.locator('[data-test="nav-profile"]').click();

    await test.step('Change password', async () => {
      await profilePage.changePassword(user.password, newPassword);
      const successMessage = page.locator('.alert-success, [role="alert"]');

      await expect(successMessage).toBeVisible({ timeout: 10000 });
      await expect(successMessage).toContainText('Your password is successfully updated!', {
        ignoreCase: true,
      });
    });

    // automatically logs out after password change, so we just need to login again
    await test.step('Verify new password works', async () => {
      await authFlow.login(user.email, newPassword);

      // if we see the profile page, it means login was successful
      await expect(page.locator('[data-test="page-title"]')).toContainText('My account');
    });
  });
});
