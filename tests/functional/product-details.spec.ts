import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home-page';
import { ProductPage } from '../../pages/product-page';
import { AppConstants } from '../../data/constants';

test('User Journey: View Product Details and Verify UI Elements', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);

  await test.step('Navigate to Home Page and open the first product', async () => {
    await homePage.goto();
    await homePage.clickOnFirstProduct();
  });

  await test.step('Verify that product details loaded correctly', async () => {
    await expect(productPage.productName).toBeVisible({ timeout: AppConstants.TIMEOUTS.SHORT });
    await expect(productPage.productPrice).toBeVisible();
    await expect(productPage.productDescription).toBeVisible();
    await expect(productPage.addToCartBtn).toBeVisible();

    await expect(productPage.quantityInput).toHaveValue('1');
  });
});
