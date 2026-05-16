import { Page, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { ProductPage } from '../pages/product-page';
import { CartPage } from '../pages/cart-page';

export class ShopFlow {
  readonly page: Page;
  readonly homePage: HomePage;
  readonly productPage: ProductPage;
  readonly cartPage: CartPage;

  constructor(page: Page) {
    this.page = page;
    this.homePage = new HomePage(page);
    this.productPage = new ProductPage(page);
    this.cartPage = new CartPage(page);
  }

  /**
   * Search for a product, select it, and add to cart
   * @param productName - Exact name of the product
   * @param quantity - Number of items to add
   */
  async addProductToCart(productName: string, quantity: number = 1) {
    // 1. Find and click the product on the home page
    // Using the card locator with text for maximum reliability
    await this.page.locator('.card', { hasText: productName }).click();

    // 2. Verify we are on the correct product page
    await this.productPage.verifyProductDetails(productName);

    // 3. Set quantity and add to cart
    if (quantity > 1) {
      await this.productPage.setQuantity(quantity);
    }
    await this.productPage.addToCart();
  }

  /**
   * Navigate to cart and verify items
   * @param productName - Product expected to be in cart
   */
  async verifyCartContents(productName: string) {
    // 1. Click the cart icon
    await this.page.locator('[data-test="nav-cart"]').click();

    // 2. Ensure we are actually on the checkout page before proceeding
    await this.page.waitForURL(/.*checkout/, { waitUntil: 'networkidle' });

    // 3. Now run the verification logic
    await this.cartPage.verifyProductInCart(productName);
  }

  /**
   * Complete the checkout process (Guest version)
   * This handles the multi-step UI wizard
   */
  async proceedToCheckout() {
    await this.cartPage.proceedToCheckout();
    // In Toolshop, guest checkout requires filling details or logging in
    // This flow can be extended as we add more pages
  }
}
