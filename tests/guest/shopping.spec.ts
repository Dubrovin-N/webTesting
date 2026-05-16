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
    const user = createRandomUser(); // Dynamic user created here
    const targetProduct = 'Combination Pliers';

    // 1. Register and log in via API
    await authFlow.registerAndLogin(user);
    await page.goto('/');

    // 2. Add item to cart
    await shopFlow.addProductToCart(targetProduct, 1);

    // 3. Complete checkout using the SAME user object data
    await purchaseFlow.completeCheckoutWithCashOnDelivery(user);
  });
});
