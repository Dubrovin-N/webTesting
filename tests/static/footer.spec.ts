import { test } from '@playwright/test';
import { Footer } from '../../components/footer';

test.describe('Static Content - Footer', () => {
  let footer: Footer;

  test.beforeEach(async ({ page }) => {
    footer = new Footer(page);
    // Navigation to home page
    await page.goto('/');
  });

  test('should display the demo application disclaimer', async () => {
    await footer.verifyDisclaimer();
  });

  test('should display the privacy policy link', async () => {
    await footer.verifyPrivacyLink();
  });
});
