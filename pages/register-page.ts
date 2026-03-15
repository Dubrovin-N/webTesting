import { type Locator, type Page } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly dob: Locator;
  readonly address: Locator;
  readonly postCode: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly country: Locator;
  readonly phone: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly registerBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    // Мы находим элементы по "data-test" атрибутам — это самый надежный способ!
    this.firstName = page.locator('[data-test="first-name"]');
    this.lastName = page.locator('[data-test="last-name"]');
    this.dob = page.locator('[data-test="dob"]');
    this.address = page.locator('[data-test="street"]');
    this.postCode = page.locator('[data-test="postal_code"]');
    this.city = page.locator('[data-test="city"]');
    this.state = page.locator('[data-test="state"]');
    this.country = page.locator('[data-test="country"]');
    this.phone = page.locator('[data-test="phone"]');
    this.email = page.locator('[data-test="email"]');
    this.password = page.locator('[data-test="password"]');
    this.registerBtn = page.locator('[data-test="register-submit"]');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/auth/register');
  }


async registerUser(userData: any) {
  await this.firstName.fill(userData.firstName);
  await this.lastName.fill(userData.lastName);
  await this.dob.fill(userData.dob);
  await this.address.fill(userData.address);
  await this.postCode.fill(userData.postCode);
  await this.city.fill(userData.city);
  await this.state.fill(userData.state);
  await this.country.selectOption(userData.country);
  await this.phone.fill(userData.phone);
  await this.email.fill(userData.email);
  await this.password.fill(userData.password);
  await this.registerBtn.click();
}
}