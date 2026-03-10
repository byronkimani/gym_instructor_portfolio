/**
 * Scenario 1 — Guest Booking Flow
 *
 * Tests the full public booking journey:
 * Visit /schedule → click Book Now → fill form → submit → confirm page
 */
import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } }); // No auth — guest flow

test.describe('Guest Booking Flow', () => {
  test('should show session cards on the schedule page', async ({ page }) => {
    await page.goto('/schedule');
    await expect(page.locator('a:has-text("Book Now")').first()).toBeVisible({ timeout: 10_000 });
  });

  test('should complete the booking flow end-to-end', async ({ page }) => {
    // 1. Visit the schedule
    await page.goto('/schedule');

    // Find first "Book Now" / booking link — try data-testid first, fall back to text
    const bookButton = page.locator('[data-testid="book-now-btn"]').first()
      .or(page.locator('a:has-text("Book Now")').first())
      .or(page.locator('button:has-text("Book Now")').first());
    await expect(bookButton).toBeVisible({ timeout: 10_000 });

    // Get the session title for later verication
    const sessionCard = page.locator('[data-testid="session-card"]').first()
      .or(page.locator('article, .session-card, [class*="session"]').first());

    // 2. Click Book Now — navigate to /book
    await bookButton.click();
    await page.waitForURL(/\/book/, { timeout: 10_000 });

    // 3. Assert booking form is visible with a session summary
    await expect(page.locator('form')).toBeVisible();

    // 4. Fill in guest details
    await page.fill('input[name="clientName"], input[placeholder*="name" i], #clientName', 'E2E Test User');
    await page.fill('input[name="clientEmail"], input[type="email"], #clientEmail', 'e2e-test@example.com');

    const phoneInput = page.locator('input[name="clientPhone"], input[type="tel"], #clientPhone');
    if (await phoneInput.count() > 0) {
      await phoneInput.fill('+254700000001');
    }

    // 5. Submit the form
    await page.click('button[type="submit"]');

    // 6. Assert redirect to /book/confirm
    await page.waitForURL(/\/book\/confirm/, { timeout: 15_000 });

    // 7. Assert confirmation page content
    await expect(page.locator('h1, [class*="title"]').first()).toBeVisible();
    // Either M-Pesa block visible, or at least success state shown
    const successIndicator = page.locator(
      '[class*="mpesa"], [class*="green"], h1:has-text("Received"), h1:has-text("Confirm")'
    ).first();
    await expect(successIndicator).toBeVisible({ timeout: 10_000 });
  });
});
