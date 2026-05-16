import { Page, expect } from '@playwright/test';
import { CartPage } from '../pages/cart-page';
import { AppConstants } from '../data/constants';

export class PurchaseFlow {
  private readonly page: Page;
  private readonly cartPage: CartPage;

  constructor(page: Page) {
    this.page = page;
    this.cartPage = new CartPage(page);
  }

  /**
   * Executes the complete checkout process using dynamic data from the test execution.
   */
  async completeCheckoutWithCashOnDelivery(user: any) {
    // 1. Anti-overlap protection
    const successToast = this.page.locator('#toast-container, .toast-message').first();
    if (await successToast.isVisible()) {
      await successToast
        .waitFor({ state: 'hidden', timeout: AppConstants.TIMEOUTS.SHORT })
        .catch(() => {});
    }

    // 2. Navigate to cart using POM method
    await this.cartPage.navigateToCart();

    // 3. Initiate checkout wizard
    await this.cartPage.proceedToCheckout();

    // Step 1: Sign in step validation
    const step1Btn = this.page.getByRole('button', { name: 'Proceed to checkout' });
    await step1Btn.waitFor({ state: 'visible', timeout: AppConstants.TIMEOUTS.SHORT });
    await step1Btn.click();

    // Step 2: Billing Address step populated dynamically from user-factory object
    await this.cartPage.fillBillingAddress(
      user?.address || '123 Default St',
      user?.city || 'Test City',
      user?.state || 'Test State',
      'US',
      user?.postCode || '12345',
      '42', // House number can remain standard or added to factory later
    );

    // Click step 2 action button
    const step2Btn = this.page.getByRole('button', { name: 'Proceed to checkout' });
    await step2Btn.waitFor({ state: 'visible', timeout: AppConstants.TIMEOUTS.SHORT });
    await step2Btn.click();

    // Step 3: Select payment option
    const paymentMethodSelect = this.page.locator('[data-test="payment-method"]');
    await paymentMethodSelect.waitFor({ state: 'visible', timeout: AppConstants.TIMEOUTS.SHORT });
    await paymentMethodSelect.selectOption({ value: 'cash-on-delivery' });

    // Step 4: Finalize the order
    await this.page.locator('[data-test="finish"]').click();

    // Final Assertion
    const successMessage = this.page.locator('.alert-success, [data-test="order-confirmation"]');
    await expect(successMessage).toBeVisible({ timeout: AppConstants.TIMEOUTS.MEDIUM });
    await expect(successMessage).toContainText('Payment was successful', { ignoreCase: true });
  }
}
