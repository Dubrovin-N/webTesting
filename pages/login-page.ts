import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly loginBtn: Locator;
  readonly continueAsGuestTab: Locator;
  readonly proceedAsGuestButton: Locator;
  private readonly guestEmailInput: Locator;
  private readonly guestFirstNameInput: Locator;
  private readonly guestLastNameInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.locator('[data-test="email"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginBtn = page.locator('[data-test="login-submit"]');
    this.continueAsGuestTab = page.getByRole('tab', { name: 'Continue as Guest' });
    this.guestEmailInput = page.locator('[data-test="guest-email"]');
    this.guestFirstNameInput = page.locator('[data-test="guest-first-name"]');
    this.guestLastNameInput = page.locator('[data-test="guest-last-name"]');
    this.proceedAsGuestButton = page.locator('[data-test="guest-submit"]');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/auth/login');
  }

  async login(email: string, pass: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(pass);
    await this.loginBtn.click();
  }

  /**
   * Checks if the guest checkout option is available and navigates through it.
   */
  async selectGuestCheckoutOption(user?: any): Promise<boolean> {
    if (await this.continueAsGuestTab.isVisible()) {
      await this.continueAsGuestTab.click();

      await this.guestEmailInput.fill(user?.email || 'guest@example.com');
      await this.guestFirstNameInput.fill(user?.firstName || 'Guest');
      await this.guestLastNameInput.fill(user?.lastName || 'User');
      await this.page.keyboard.press('Tab');
      await this.proceedAsGuestButton.click();
      return true;
    }
    return false;
  }
}
