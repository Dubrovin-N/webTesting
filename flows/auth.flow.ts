import { Page, expect, request } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

export class AuthFlow {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * + Логин через UI (для создания сессии в браузере)
   */
  async registerAndLogin(userData: any) {
    const loginPage = new LoginPage(this.page);

    // 1. РЕГИСТРАЦИЯ ЧЕРЕЗ API
    const apiContext = await request.newContext();
    
    const response = await apiContext.post('https://api.practicesoftwaretesting.com/users/register', {
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
        password: userData.password
      }
    });

    // Проверка успешности API запроса
    const responseBody = await response.text();
    expect(response.status(), `API registration failed: ${responseBody}`).toBe(201);

    // 2. ЛОГИН ЧЕРЕЗ UI
    await loginPage.goto();
    
    // Небольшая пауза, чтобы сервер успел обновить индексы базы данных
    await this.page.waitForTimeout(1500); 

    // Выполняем вход
    await loginPage.login(userData.email, userData.password);
    
    // Проверяем, что попали в личный кабинет
    await expect(this.page).toHaveURL(/.*account/, { timeout: 15000 });
  }

  /**
   * Обычный логин существующего пользователя через UI
   */
  async login(email: string, pass: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login(email, pass);
    await expect(this.page).toHaveURL(/.*account/);
  }

  /**
   * Выход из системы
   */
  async logout() {
    await this.page.locator('[data-test="nav-menu"]').click();
    await this.page.locator('[data-test="nav-logout"]').click();
    await expect(this.page).toHaveURL(/.*|.*login/);
  }
}