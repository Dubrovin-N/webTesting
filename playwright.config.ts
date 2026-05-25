import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname functionality for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load local variables from .env ONLY if we are NOT running on GitHub Actions (CI)
if (!process.env.CI) {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}

const username = process.env.BROWSERSTACK_USERNAME || '';
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY || '';

// Route traffic: 'local' (PC/Docker) or 'browserstack' (Cloud)
const testTarget = process.env.TEST_TARGET || 'local';
const isBrowserStack = testTarget === 'browserstack';

export default defineConfig({
  testDir: './tests',
  timeout: process.env.CI ? 60000 : 30000,
  expect: {
    timeout: process.env.CI ? 20000 : 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: isBrowserStack ? 1 : process.env.CI ? 1 : undefined, // Concurrency control

  // Clean, built-in native HTML reporter
  reporter: 'html',

  use: {
    // Retaining your original anti-bot evasion and setup parameters
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: true,
    permissions: ['geolocation'],

    launchOptions: {
      args: [
        '--disable-blink-features=AutomationControlled',
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
      ],
    },

    baseURL: 'https://practicesoftwaretesting.com',
    video: 'retain-on-failure',
    actionTimeout: process.env.CI ? 25000 : 10000,
    trace: 'retain-on-failure',
  },

  // Dynamic pipeline orchestration
  projects: [
    // 1. Core global authorization dependency (Runs everywhere)
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // 2. Local/Docker standard project execution
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/,
    },

    // 3. Dedicated BrowserStack Cloud orchestration
    {
      name: 'browserstack_chrome_mac',
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/,
      use: {
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
            JSON.stringify({
              browser: 'chrome',
              browser_version: 'latest',
              os: 'osx',
              os_version: 'Sonoma',
              // FIXED FORMAT: Flat root keys for naming, dotted keys for credentials
              build: process.env.CI
                ? `CI Build #${process.env.GITHUB_RUN_NUMBER}`
                : 'Local Dev Build',
              name: 'E2E Test Run',
              'browserstack.username': username,
              'browserstack.key': accessKey,
            }),
          )}`,
        },
      },
    },
  ].filter((project) => {
    // Elegant filtering: isolates local run from cloud runs cleanly
    if (isBrowserStack) {
      return project.name === 'setup' || project.name === 'browserstack_chrome_mac';
    }
    return project.name === 'setup' || project.name === 'chromium';
  }),
});
