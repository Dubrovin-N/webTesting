import { Page, expect, request } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

export class AuthFlow {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   *  authorization via API with token injection to bypass Cloudflare and UI login
   */
  async registerAndLogin(userData: any) {
    const apiContext = await request.newContext();

    const regResponse = await apiContext.post(
      'https://api.practicesoftwaretesting.com/users/register',
      {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          address: [userData.address],
          city: userData.city,
          state: userData.state,
          country: userData.country,
          postcode: userData.postCode,
          phone: userData.phone,
          dob: userData.dob,
          email: userData.email,
          password: userData.password,
        },
      },
    );

    // check 201 status
    expect(regResponse.status(), `API Registration failed: ${await regResponse.text()}`).toBe(201);

    // login via API to get token
    const loginResponse = await apiContext.post(
      'https://api.practicesoftwaretesting.com/users/login',
      {
        data: {
          email: userData.email,
          password: userData.password,
        },
      },
    );

    expect(loginResponse.status(), 'API Login failed').toBe(200);
    const loginData = await loginResponse.json();
    const token = loginData.access_token;

    if (!token) {
      throw new Error('API login success, but no access_token received');
    }

    // inject token into browser's localStorage to bypass Cloudflare and UI login
    /*     await this.page.goto('/favicon.ico');

    await this.page.evaluate((t) => {
      localStorage.setItem('auth-token', t);
    }, token); */

    // Alternative approach using context to set token before any page loads, ensuring it's available immediately
    const context = this.page.context();
    await context.addInitScript((t) => {
      window.localStorage.setItem('auth-token', t);
    }, token);

    //navigate to account page to verify login success
    await this.page.goto('/account');

    const pageTitle = this.page.locator('[data-test="page-title"]');
    await expect(pageTitle).toBeVisible({ timeout: 15000 });
    await expect(pageTitle).toContainText('My account');
  }

  /**
   * login via UI, used for negative tests and to verify that UI login works as expected
   */
  async loginViaUI(email: string, pass: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login(email, pass);
    await expect(this.page).toHaveURL(/.*account/);
  }

  async login(email: string, pass: string) {
    const apiContext = await request.newContext();

    // get token via API login
    const loginResponse = await apiContext.post(
      'https://api.practicesoftwaretesting.com/users/login',
      {
        data: { email, password: pass },
      },
    );

    expect(loginResponse.status(), `API Login failed for ${email}`).toBe(200);
    const loginData = await loginResponse.json();
    const token = loginData.access_token;

    // injectiing token
    await this.page.goto('/');
    await this.page.evaluate((t) => {
      localStorage.setItem('auth-token', t);
    }, token);

    // navigate to account page to verify login success
    await this.page.goto('/account');
    await expect(this.page.locator('[data-test="page-title"]')).toContainText('My account');
  }

  /**
   * logout via UI, used to verify that logout works as expected and token is removed from storage
   */
  async logout() {
    await this.page.locator('[data-test="nav-menu"]').click();
    await this.page.locator('[data-test="nav-logout"]').click();

    // ckeck that we are redirected to login page after logout
    await expect(this.page).toHaveURL(/.*|.*login/);

    // ckeck that token is removed from localStorage after logout
    const token = await this.page.evaluate(() => localStorage.getItem('auth-token'));
    expect(token).toBeNull();
  }
}
