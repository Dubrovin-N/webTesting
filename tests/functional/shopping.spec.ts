import { test } from '@playwright/test';
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
  });

  test('User can add a product to the cart and successfully complete a purchase', async ({
    page,
  }) => {
    const user = createRandomUser();
    const targetProduct = 'Combination Pliers'; // Example product name from Toolshop

    // 1. Setup: Register and log in via API for maximum stability
    await authFlow.registerAndLogin(user);
    await page.goto('/');

    // 2. Act: Search and add the tool to the cart using ShopFlow
    await shopFlow.addProductToCart(targetProduct, 1);

    // 3. Act & Assert: Go through the checkout steps and verify the purchase
    await purchaseFlow.completeCheckoutWithCashOnDelivery();
  });
});
