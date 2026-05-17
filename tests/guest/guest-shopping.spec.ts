import { test } from '@playwright/test';
import { createRandomUser } from '../../data/user-factory';
import { ShopFlow } from '../../flows/shop-flow';
import { PurchaseFlow } from '../../flows/purchase-flow';

test.describe('Shopping & Checkout Functionality', () => {
  let shopFlow: ShopFlow;
  let purchaseFlow: PurchaseFlow;

  test.beforeEach(async ({ page }) => {
    shopFlow = new ShopFlow(page);
    purchaseFlow = new PurchaseFlow(page);

    //CLOUDFLARE BYPASS: Intercepting product request and instantly serving in-memory JSON --- IGNORE ---
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

  test('Guest user can add a product to the cart and successfully complete a purchase', async ({
    page,
  }) => {
    const user = createRandomUser();
    const targetProduct = 'Combination Pliers';

    await page.goto('/');
    await shopFlow.addProductToCart(targetProduct, 1);
    await purchaseFlow.completeCheckoutWithCashOnDelivery(user);
  });
});
