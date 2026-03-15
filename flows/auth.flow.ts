import { Page, expect } from '@playwright/test';
import { RegisterPage } from '../pages/register-page';
import { LoginPage } from '../pages/login-page';


export class AuthFlow {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Этот метод делает "грязную работу":
   * Регистрирует юзера и сразу логинит его, чтобы тест начался уже в системе.
   */
  async registerAndLogin(userData: any) {
    const registerPage = new RegisterPage(this.page);
    const loginPage = new LoginPage(this.page);

    // 1. Идем на регистрацию и заполняем форму
    await registerPage.goto();
    await registerPage.registerUser(userData);
    await expect(this.page).toHaveURL(/.*login/);

    // 2. Сайт перекинул нас на логин — входим под новыми данными
    await loginPage.login(userData.email, userData.password);
    await expect(this.page).toHaveURL(/.*account/);
  }


  /**
   * Просто логин существующего пользователя.
   */
  async login(email: string, pass: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login(email, pass);
    await expect(this.page).toHaveURL(/.*account/);
  }

  /**
   * Выход из системы.
   */
  async logout() {
    // Кликаем по меню и кнопке выхода
    await this.page.locator('[data-test="nav-menu"]').click();
    await this.page.locator('[data-test="nav-logout"]').click();
    
    // Проверяем, что вернулись на главную или страницу логина
    await expect(this.page).toHaveURL(/.*|.*login/);
  }
}