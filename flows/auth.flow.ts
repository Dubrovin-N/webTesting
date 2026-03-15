import { Page, expect, request } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

export class AuthFlow {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * SDET Approach: Полный обход UI-авторизации через API.
   * Это решает проблему с Cloudflare в GitHub Actions.
   */
  async registerAndLogin(userData: any) {
    const apiContext = await request.newContext();

    // 1. РЕГИСТРАЦИЯ ЧЕРЕЗ API
    // Используем snake_case для ключей, как требует сервер
    const regResponse = await apiContext.post('https://api.practicesoftwaretesting.com/users/register', {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        address: [userData.address], // Оборачиваем в массив (требование API)
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

    // Проверяем статус 201 (Created)
    expect(regResponse.status(), `API Registration failed: ${await regResponse.text()}`).toBe(201);

    // 2. ЛОГИН ЧЕРЕЗ API ДЛЯ ПОЛУЧЕНИЯ ТОКЕНА
    const loginResponse = await apiContext.post('https://api.practicesoftwaretesting.com/users/login', {
      data: {
        email: userData.email,
        password: userData.password
      }
    });

    expect(loginResponse.status(), 'API Login failed').toBe(200);
    const loginData = await loginResponse.json();
    const token = loginData.access_token;

    if (!token) {
      throw new Error('API login success, but no access_token received');
    }

    // 3. ИНЪЕКЦИЯ ТОКЕНА В БРАУЗЕР (ОБХОД CLOUDFLARE)
    // Заходим на главную, чтобы инициализировать домен для LocalStorage
    await this.page.goto('/favicon.ico');
    
    // Выполняем скрипт внутри браузера для записи токена
    await this.page.evaluate((t) => {
      localStorage.setItem('auth-token', t);
    }, token);

    // 4. ПЕРЕХОД В АККАУНТ
    // Теперь сайт считает нас авторизованными без ввода пароля в UI
    await this.page.goto('/account', { waitUntil: 'networkidle' });
    
    // Проверка успешности входа
    const pageTitle = this.page.locator('[data-test="page-title"]');
    await expect(pageTitle).toBeVisible({ timeout: 15000 });
    await expect(pageTitle).toContainText('My account');
  }

  /**
   * Просто логин существующего пользователя (через UI, если нужно проверить саму форму)
   */
  async loginViaUI(email: string, pass: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login(email, pass);
    await expect(this.page).toHaveURL(/.*account/);
  }

  async login(email: string, pass: string) {
    const apiContext = await request.newContext();

    // 1. Получаем токен через API
    const loginResponse = await apiContext.post('https://api.practicesoftwaretesting.com/users/login', {
      data: { email, password: pass }
    });

    expect(loginResponse.status(), `API Login failed for ${email}`).toBe(200);
    const loginData = await loginResponse.json();
    const token = loginData.access_token;

    // 2. Инъекция в браузер
    await this.page.goto('/');
    await this.page.evaluate((t) => {
      localStorage.setItem('auth-token', t);
    }, token);

    // 3. Переход в аккаунт для проверки
    await this.page.goto('/account');
    await expect(this.page.locator('[data-test="page-title"]')).toContainText('My account');
  }

  /**
   * Выход из системы
   */
  async logout() {
    // Открываем меню и жмем выход
    await this.page.locator('[data-test="nav-menu"]').click();
    await this.page.locator('[data-test="nav-logout"]').click();
    
    // Проверяем, что токен удалился и мы на странице логина/главной
    await expect(this.page).toHaveURL(/.*|.*login/);
    
    // Проверяем, что токен стерся из памяти
    const token = await this.page.evaluate(() => localStorage.getItem('auth-token'));
    expect(token).toBeNull();
  }
}