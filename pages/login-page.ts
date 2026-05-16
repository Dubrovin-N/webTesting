import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly loginBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.locator('[data-test="email"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginBtn = page.locator('[data-test="login-submit"]');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/auth/login');
  }

  async login(email: string, pass: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(pass);
    await this.loginBtn.click();
  }
}
