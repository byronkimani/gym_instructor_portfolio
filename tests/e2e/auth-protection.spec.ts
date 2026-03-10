/**
 * Scenario 6 — Authentication Protection
 *
 * Verifies that:
 * - /dashboard and /appointments redirect unauthenticated users to the login page
 * - PATCH /api/bookings/[id]/status returns 401 without a session cookie
 */
import { test, expect, request as playwrightRequest } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } }); // No auth — guest context

const BASE_URL = 'http://127.0.0.1:3001';

test.describe('Auth Protection', () => {
  test('GET /dashboard redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    // Wait for either a redirect to /login or NextAuth's /api/auth/signin
    await page.waitForURL(
      (url) => url.pathname.includes('/login') || url.pathname.includes('/signin'),
      { timeout: 10_000 }
    );
    expect(
      page.url().includes('/login') || page.url().includes('/signin')
    ).toBeTruthy();
  });

  test('GET /appointments redirects to login', async ({ page }) => {
    await page.goto('/appointments');
    await page.waitForURL(
      (url) => url.pathname.includes('/login') || url.pathname.includes('/signin'),
      { timeout: 10_000 }
    );
    expect(
      page.url().includes('/login') || page.url().includes('/signin')
    ).toBeTruthy();
  });

  test('PATCH /api/bookings/[id]/status returns 401 without auth', async () => {
    const apiCtx = await playwrightRequest.newContext({ baseURL: BASE_URL });

    // Use a plausible-but-nonexistent CUID so the auth check fires before the DB lookup
    const fakeId = 'clzfakeideee000000000000';
    const res = await apiCtx.patch(`/api/bookings/${fakeId}/status`, {
      data: { status: 'CONFIRMED' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(res.status()).toBe(401);

    await apiCtx.dispose();
  });
});
