import { test as setup, expect } from '@playwright/test';

setup('Environment Health Check', async ({ page, request }) => {
  console.log('--- Starting Infrastructure Setup ---');

  // 1. Check if the Front-end is accessible
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  console.log('✅ Front-end is UP (Status 200)');

  // 2. Check if the Back-end API is responding
  const isCloudEnvironment = process.env.CI || process.env.BROWSERSTACK_USERNAME;

  if (isCloudEnvironment) {
    console.log(
      '⚠️ Running in Cloud/CI/BrowserStack environment: Skipping direct API check to bypass Cloudflare 403.',
    );
  } else {
    console.log('💻 Running locally on physical machine: Executing full API health check...');
    const apiResponse = await request.get('/api/products', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
    });

    expect(
      apiResponse.status(),
      `Backend API health check failed with status ${apiResponse.status()}`,
    ).toBe(200);
    console.log('✅ Back-end API is RESPONDING (Status 200)');
  }

  // 3. Confirm the page title layout is correct
  await expect(page).toHaveTitle(/Practice Software Testing/i);

  console.log('--- Environment is healthy. Ready for tests! ---');
});
