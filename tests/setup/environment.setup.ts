import { test as setup, expect } from '@playwright/test';

setup('Environment Health Check', async ({ page, request }) => {
  console.log('--- Starting Infrastructure Setup ---');

  // 1. Check if the Front-end is accessible
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  console.log('✅ Front-end is UP (Status 200)');

  // 2. Check if the Back-end API is responding
  // We make a direct light API call to fetch products
  const apiResponse = await request.get('/api/products');
  expect(apiResponse.status()).toBe(200);
  console.log('✅ Back-end API is RESPONDING (Status 200)');

  // 3. Confirm the page title layout is correct
  await expect(page).toHaveTitle(/Practice Software Testing/i);

  console.log('--- Environment is healthy. Ready for tests! ---');
});
