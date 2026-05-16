import { Locator, Page, expect } from '@playwright/test';
import { AppConstants } from '../data/constants';
export class Footer {
  readonly page: Page;
  readonly footerContainer: Locator;
  readonly disclaimerText: Locator;
  readonly privacyPolicyLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footerContainer = page.locator('footer');
    this.disclaimerText = page.getByText(/This is a DEMO application/i);
    this.privacyPolicyLink = page.locator('a', { hasText: /Privacy Policy/i });
  }

  /**
   * Ensure footer is in view by scrolling to the bottom
   */
  async scrollToFooter() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Brief wait to ensure any lazy-loaded elements appear
    await this.disclaimerText.waitFor({ state: 'visible', timeout: AppConstants.TIMEOUTS.MEDIUM });
  }

  /**
   * Verify the demo disclaimer text is present and correct
   */
  async verifyDisclaimer() {
    await this.scrollToFooter();
    console.log('--- Checking Disclaimer Text ---');
    await expect(this.disclaimerText).toBeVisible();
    await expect(this.disclaimerText).toContainText(AppConstants.EXPECTED_TEXTS.TRAINING_PURPOSE);
  }

  /**
   * Verify the Privacy Policy link is visible and has a link
   */
  async verifyPrivacyLink() {
    await this.scrollToFooter();
    await expect(this.privacyPolicyLink).toBeVisible();
    await expect(this.privacyPolicyLink).toHaveAttribute('href');
  }
}
