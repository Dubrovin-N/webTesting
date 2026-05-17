import { test, expect } from '@playwright/test';
import { createRandomUser } from '../../data/user-factory';
import { AuthFlow } from '../../flows/auth.flow';
import { ShopFlow } from '../../flows/shop-flow';
import { PurchaseFlow } from '../../flows/purchase-flow';

test.describe('Shopping & Checkout Functionality', () => {
  let authFlow: AuthFlow;
  let shopFlow: ShopFlow;
  let purchaseFlow: PurchaseFlow;

  test.beforeEach(async ({ page }) => {
    authFlow = new AuthFlow(page);
    shopFlow = new ShopFlow(page);
    purchaseFlow = new PurchaseFlow(page);

    // Required mock of the products catalog to bypass Cloudflare blocks on CI environment
    await page.route('**/api/products**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '01HJMV9SAMJ687EDB9A9BMRN4A',
            name: 'Combination Pliers',
            description: 'High-quality professional pliers.',
            price: 14.5,
            is_location_offer: false,
            is_rental: false,
            image: 'assets/images/products/pliers.png',
            category: { id: '1', name: 'Hand Tools' },
          },
        ]),
      });
    });
  });

  test('Registered user can add a product to the cart and successfully complete a purchase', async ({
    page,
  }) => {
    const user = createRandomUser();
    const targetProduct = 'Combination Pliers';

    // 1. Setup: Register and log in via API token
    // This method injects the token into localStorage and navigates to the /account page
    await authFlow.registerAndLogin(user);

    // 2. Act: Navigate to the home page using a UI click on the logo
    // This avoids re-triggering the initScript and prevents Angular application race conditions
    await page.getByRole('link', { name: 'Practice Software Testing -' }).click();

    // 3. Act: Search and add the tool to the cart using ShopFlow
    await shopFlow.addProductToCart(targetProduct, 1);

    // 4. Act & Assert: Complete the checkout process with Cash on Delivery and verify success
    await purchaseFlow.completeCheckoutWithCashOnDelivery(user);
  });
});
