/**
 * Scenario 2 — Instructor Confirms a Pending Booking
 *
 * Uses saved instructor auth state.
 * Navigates to /appointments → Pending tab → confirms first pending booking.
 */
import { test, expect } from '@playwright/test';

test.describe('Instructor — Confirm Booking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/appointments');
    await page.waitForURL(/\/appointments/, { timeout: 10_000 });
  });

  test('should display the appointments page after login', async ({ page }) => {
    await expect(page).toHaveURL(/\/appointments/);
    await expect(page.locator('h1, [class*="title"]').first()).toBeVisible();
  });

  test('should confirm a pending booking', async ({ page }) => {
    // Click "Pending" tab filter
    const pendingTab = page.locator('button:has-text("Pending"), [role="tab"]:has-text("Pending")').first();
    if (await pendingTab.count() > 0) {
      await pendingTab.click();
      await page.waitForTimeout(500); // let filter apply
    }

    // Assert at least one pending row exists
    const confirmBtn = page.locator(
      'button[title="Confirm request"]'
    ).first();
    await expect(confirmBtn).toBeVisible({ timeout: 10_000 });

    // Click Confirm
    await confirmBtn.click();

    // Modal should appear
    const modal = page.locator('div:has-text("Confirm booking for")').last();
    await expect(modal).toBeVisible({ timeout: 5_000 });

    // Optionally fill in a note
    const noteInput = modal.locator('textarea, input[placeholder*="note" i]');
    if (await noteInput.count() > 0) {
      await noteInput.fill('Confirmed via E2E test');
    }

    // Click the confirm/submit button inside the modal
    const modalConfirmBtn = modal.locator(
      'button:has-text("Confirm Booking")'
    ).last();
    await modalConfirmBtn.click();

    // Modal should close
    await expect(modal).not.toBeVisible({ timeout: 8_000 });

    // The row should now show "Confirmed" status badge
    const confirmedBadge = page.locator(
      '[class*="badge"]:has-text("Confirmed"), span:has-text("Confirmed")'
    ).first();
    await expect(confirmedBadge).toBeVisible({ timeout: 8_000 });
  });
});
