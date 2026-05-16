import { Locator, Page, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly quantityUpBtn: Locator;
  readonly quantityDownBtn: Locator;
  readonly quantityInput: Locator;
  readonly addToCartBtn: Locator;
  readonly addToWishlistBtn: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // UI Selectors using data-test attributes for stability
    this.productName = page.locator('[data-test="product-name"]');
    this.productPrice = page.locator('[data-test="unit-price"]');
    this.productDescription = page.locator('[data-test="product-description"]');
    this.quantityUpBtn = page.locator('[data-test="increase-quantity"]');
    this.quantityDownBtn = page.locator('[data-test="decrease-quantity"]');
    this.quantityInput = page.locator('[data-test="quantity"]');
    this.addToCartBtn = page.locator('[data-test="add-to-cart"]');
    this.addToWishlistBtn = page.locator('[data-test="add-to-wishlist"]');
    this.successMessage = page.locator('div[role="status"], div[role="alert"], .toast-body');
  }

  /**
   * Adjust product quantity using '+' and '-' buttons
   * @param count - target quantity (must be 1 or higher)
   */
  async setQuantity(count: number) {
    if (count < 1) throw new Error('Quantity must be at least 1');

    // Default quantity is usually 1, so we click '+' (count - 1) times
    for (let i = 1; i < count; i++) {
      await this.quantityUpBtn.click();
    }
  }

  /**
   * Add the current product to the shopping cart
   */
  async addToCart() {
    await this.addToCartBtn.click();

    // 1. Wait for the element to actually exist in DOM
    await this.successMessage.waitFor({ state: 'attached', timeout: 5000 });

    // 2. Now check the text
    await expect(this.successMessage).toContainText('Product added to shopping cart');

    // 3. Log it to console for debugging
    console.log('Success toast detected!');
  }

  /**
   * Verify that product details are loaded correctly
   * @param expectedName - Expected product title
   */
  async verifyProductDetails(expectedName: string) {
    await expect(this.productName).toBeVisible();
    await expect(this.productName).toHaveText(expectedName);
    await expect(this.productPrice).toBeVisible();
  }
}
