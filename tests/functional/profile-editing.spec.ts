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
    
    // Переход в профиль через меню
    await page.locator('[data-test="nav-menu"]').click();
    await page.locator('[data-test="nav-profile"]').click();

    await test.step('Update name and verify', async () => {
      await profilePage.updateContactInfo(newFirstName, user.lastName);
      // Проверяем, что значение в поле обновилось
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
      
      // Даем чуть больше времени на появление (10 сек вместо стандартных 5)
      await expect(successMessage).toBeVisible({ timeout: 10000 });
      await expect(successMessage).toContainText('Your password is successfully updated!', { ignoreCase: true });
    });
    // 4. ПРОВЕРКА: Выходим и заходим с НОВЫМ паролем
  await test.step('Verify new password works', async () => {
  // automatically logs out after password change, so we just need to login again
    await authFlow.login(user.email, newPassword);
    
    // Если мы снова видим "My account" — значит пароль реально сменился!
    await expect(page.locator('[data-test="page-title"]')).toContainText('My account');
  });

  });
});