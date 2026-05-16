import { Locator, Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartIcon: Locator; // Added
  readonly cartTable: Locator;
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly checkoutBtn: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countrySelect: Locator;
  readonly postcodeInput: Locator;
  readonly houseNumberInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTable = page.locator('table.table-hover');
    this.cartItems = page.locator('[data-test="product-title"]');
    this.totalPrice = page.locator('[data-test="cart-total"]');
    this.checkoutBtn = page.locator('[data-test="proceed-1"]');
    this.cartIcon = page.locator('[data-test="nav-cart"]');
    this.streetInput = page.getByRole('textbox', { name: 'Street' });
    this.cityInput = page.getByRole('textbox', { name: 'City' });
    this.stateInput = page.getByRole('textbox', { name: 'State' });
    this.countrySelect = page.locator('[data-test="country"]');
    this.postcodeInput = page.getByRole('textbox', { name: 'Postal code' });
    this.houseNumberInput = page.getByRole('textbox', { name: 'House number' });
  }

  /**
   * Navigates to the cart page via header icon click
   */
  async navigateToCart() {
    await this.cartIcon.click();
  }

  /**
   * Fills out the billing address form required during the checkout wizard.
   */
  async fillBillingAddress(
    street: string,
    city: string,
    state: string,
    countryCode: string,
    postcode: string,
    houseNumber: string,
  ) {
    await this.countrySelect.selectOption({ value: countryCode });
    await this.postcodeInput.fill(postcode);
    await this.houseNumberInput.fill(houseNumber);
    await this.streetInput.fill(street);
    await this.cityInput.fill(city);
    await this.stateInput.fill(state);
  }

  /**
   * Navigate directly to the cart page
   */
  async goto() {
    await this.page.goto('/checkout');
  }

  /**
   * Verify if a specific product is present in the cart
   * @param productName - The name of the product to look for
   */
  async verifyProductInCart(productName: string) {
    // Wait for the table to be attached to DOM first
    await this.cartTable.waitFor({ state: 'visible', timeout: 7000 });

    const productItem = this.cartItems.filter({ hasText: productName });

    // It's better to wait for the specific item to appear
    await expect(productItem).toBeVisible({ timeout: 7000 });
  }

  /**
   * Get the current total price from the cart UI
   * Useful for assertions after adding multiple items
   */
  async getTotalPrice(): Promise<string> {
    const total = await this.totalPrice.innerText();
    return total.replace('$', '').trim();
  }

  /**
   * Start the multi-step checkout process
   */
  async proceedToCheckout() {
    await this.checkoutBtn.click();
    // Usually, the next step would be login or address selection (data-test="proceed-2")
  }

  /**
   * Remove an item from the cart (Optional utility)
   * @param productName - Name of the product to delete
   */
  async removeItem(productName: string) {
    // Finds the row containing the product and clicks the delete button within that row
    const row = this.page.locator('tr', { hasText: productName });
    await row.locator('.btn-danger').click();
    await expect(row).not.toBeVisible();
  }
}
