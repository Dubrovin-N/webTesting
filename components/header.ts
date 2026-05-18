import { Locator, Page, expect } from '@playwright/test';

export class Header {
  readonly page: Page;
  readonly navBar: Locator;
  readonly homeLink: Locator;
  readonly contactLink: Locator;
  readonly categoriesMenu: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Main navigation bar container
    this.navBar = page.locator('.navbar');
    // Common links in the header
    this.homeLink = page.locator('[data-test="nav-home"]');
    this.contactLink = page.locator('[data-test="nav-contact"]');
    this.categoriesMenu = page.locator('[data-test="nav-categories"]');
    this.loginLink = page.locator('[data-test="nav-sign-in"]');
  }

  /**
   * Verify that all main navigation links are visible to the user
   */
  async verifyMainNavigation() {
    await expect(this.homeLink).toBeVisible();
    await expect(this.contactLink).toBeVisible();
    await expect(this.categoriesMenu).toBeVisible();
  }

  /**
   * Verify that the Login/Sign-in link is present
   */
  async verifyLoginLinkPresence() {
    await expect(this.loginLink).toBeVisible();
  }
}
