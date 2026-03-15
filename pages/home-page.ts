import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    // Ищем все названия товаров и берем первое попавшееся
    this.productTitle = page.locator('[data-test="product-name"]');
    this.productPrice = page.locator('[data-test="product-price"]');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/');
  }

  async clickOnFirstProduct() {
    // Кликаем именно по первому элементу в списке
    await this.productTitle.first().click();
  }
}