import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly phoneField: Locator;
  readonly updateBtn: Locator;
  
  // Локаторы для смены пароля
  readonly currentPasswordField: Locator;
  readonly newPasswordField: Locator;
  readonly confirmPasswordField: Locator;
  readonly eyeIcon: Locator;
  readonly changePasswordBtn: Locator;

  // Локатор для QR-кода
  readonly qrCodeCanvas: Locator;

  constructor(page: Page) {
    this.page = page;
    // Поля профиля
    this.firstNameField = page.locator('[data-test="first-name"]');
    this.lastNameField = page.locator('[data-test="last-name"]');
    this.emailField = page.locator('[data-test="email"]');
    this.phoneField = page.locator('[data-test="phone"]');
    this.updateBtn = page.locator('[data-test="update-profile-submit"]');

    // Поля пароля
    this.currentPasswordField = page.locator('[data-test="current-password"]');
    this.newPasswordField = page.locator('[data-test="new-password"]');
    this.confirmPasswordField = page.locator('[data-test="new-password-confirm"]');
    this.eyeIcon = page.locator('.input-group >> button').last(); 
    this.changePasswordBtn = page.locator('[data-test="change-password-submit"]');

    // Локатор для QR-кода (если он есть на странице)
    this.qrCodeCanvas = page.locator('.qrcode canvas');
  }

  async updateContactInfo(firstName: string, lastName: string) {
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

// 1. Кликаем на "глаз", чтобы показать пароль
    // На этом сайте у кнопок глаз обычно есть селектор или они внутри .input-group
  
    await this.eyeIcon.click();

    // 2. Умное ожидание: проверяем, что пароль в поле стал видимым
    // Это действие само по себе займет 100-300мс, что даст Angular время "продышаться"
    await expect(this.confirmPasswordField).toHaveValue(newPass);
    await expect(this.confirmPasswordField).toHaveAttribute('type', 'text');
    await this.eyeIcon.click(); // Скрываем пароль обратно


   await this.changePasswordBtn.click(); 

  }
}