import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    // searching for product and choosing the first one in the list to avoid issues with dynamic content and multiple products with same name
    this.productTitle = page.locator('[data-test="product-name"]');
    this.productPrice = page.locator('[data-test="product-price"]');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/');
  }

  async clickOnFirstProduct() {
    // clicking on the first product in the list
    await this.productTitle.first().click();
  }
}
