import { test } from '@playwright/test';
import { Header } from '../../components/header';

test.describe('Static Content - Navigation Header', () => {
  let header: Header;

  test.beforeEach(async ({ page }) => {
    header = new Header(page);
    await page.goto('/');
  });

  test('should display main navigation menu items', async () => {
    await header.verifyMainNavigation();
  });

  test('should display sign-in link in the header', async () => {
    await header.verifyLoginLinkPresence();
  });
});
