import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly phoneField: Locator;
  readonly updateBtn: Locator;

  // locators for password change fields
  readonly currentPasswordField: Locator;
  readonly newPasswordField: Locator;
  readonly confirmPasswordField: Locator;
  readonly eyeIcon: Locator;
  readonly changePasswordBtn: Locator;

  // locators for QR code
  readonly qrCodeCanvas: Locator;

  constructor(page: Page) {
    this.page = page;
    // profile fields
    this.firstNameField = page.locator('[data-test="first-name"]');
    this.lastNameField = page.locator('[data-test="last-name"]');
    this.emailField = page.locator('[data-test="email"]');
    this.phoneField = page.locator('[data-test="phone"]');
    this.updateBtn = page.locator('[data-test="update-profile-submit"]');

    // locators for password change fields
    this.currentPasswordField = page.locator('[data-test="current-password"]');
    this.newPasswordField = page.locator('[data-test="new-password"]');
    this.confirmPasswordField = page.locator('[data-test="new-password-confirm"]');
    this.eyeIcon = page.locator('.input-group >> button').last();
    this.changePasswordBtn = page.locator('[data-test="change-password-submit"]');

    // locators for QR code (if it exists on the page)
    this.qrCodeCanvas = page.locator('.qrcode canvas');
  }

  async updateContactInfo(firstName: string, lastName: string) {
    await this.page
      .waitForFunction(
        (input) => (input as HTMLInputElement).value !== '',
        await this.firstNameField.elementHandle(),
      )
      .catch(() => {});

    // if there was an error loading profile data, we might see an error toast. In that case, we reload the page
    const errorToast = this.page.locator('.toast-error, .alert-danger, [role="alert"]');
    if (await errorToast.isVisible()) {
      await this.page.reload();
      await this.firstNameField.waitFor({ state: 'visible' });
    }

    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.updateBtn.click();
  }

  async changePassword(oldPass: string, newPass: string) {
    await this.currentPasswordField.fill(oldPass);
    await this.newPasswordField.fill(newPass);
    await this.confirmPasswordField.fill(newPass);
    await expect(this.changePasswordBtn).toBeEnabled({ timeout: 25000 });

    await expect(this.qrCodeCanvas).toBeVisible({ timeout: 15000 });

    await this.eyeIcon.click();

    await expect(this.confirmPasswordField).toHaveValue(newPass);
    await expect(this.confirmPasswordField).toHaveAttribute('type', 'text');
    await this.eyeIcon.click();

    await this.changePasswordBtn.click();
  }
}
