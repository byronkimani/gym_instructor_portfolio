import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Config
 * Run against the dev server: PORT=3001 npm run dev
 * Then: npx playwright test
 */
export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: ['**/global-setup.ts'],
  timeout: 30_000,
  fullyParallel: false, // Sequential — shared DB
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  globalSetup: './tests/e2e/global-setup.ts',

  use: {
    baseURL: 'http://127.0.0.1:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Authenticated tests — /appointments, /sessions, etc.
    {
      name: 'dashboard',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/.auth/instructor.json',
      },
      testMatch: [
        '**/instructor-confirm.spec.ts',
        '**/instructor-decline.spec.ts',
        '**/create-session.spec.ts',
        '**/capacity-enforcement.spec.ts',
      ],
    },
    // Guest / unauthenticated tests
    {
      name: 'public',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        '**/guest-booking.spec.ts',
        '**/auth-protection.spec.ts',
      ],
    },
  ],
});
