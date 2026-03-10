/**
 * Scenario 3 — Instructor Declines a Pending Booking
 *
 * Uses saved instructor auth state.
 * Navigates to /appointments → Pending tab → declines first pending booking.
 */
import { test, expect } from '@playwright/test';

test.describe('Instructor — Decline Booking', () => {
  test('should decline a pending booking and show Declined badge', async ({ page }) => {
    await page.goto('/appointments');
    await page.waitForURL(/\/appointments/, { timeout: 10_000 });

    // Filter to Pending tab
    const pendingTab = page.locator('button:has-text("Pending"), [role="tab"]:has-text("Pending")').first();
    if (await pendingTab.count() > 0) {
      await pendingTab.click();
      await page.waitForTimeout(500);
    }

    // Find and click the Decline button
    const declineBtn = page.locator(
      'button[title="Decline request"]'
    ).first();
    await expect(declineBtn).toBeVisible({ timeout: 10_000 });
    await declineBtn.click();

    // Modal should appear
    const modal = page.locator('div:has-text("Decline request from")').last();
    await expect(modal).toBeVisible({ timeout: 5_000 });

    // Submit without adding a note (note is optional)
    const submitBtn = modal.locator(
      'button:has-text("Decline Request")'
    ).last();
    await submitBtn.click();

    // Modal closes
    await expect(modal).not.toBeVisible({ timeout: 8_000 });

    // Assert Declined badge is shown
    const declinedBadge = page.locator(
      '[class*="badge"]:has-text("Declined"), span:has-text("Declined")'
    ).first();
    await expect(declinedBadge).toBeVisible({ timeout: 8_000 });

    // Assert no Confirm or Decline buttons remain on that row
    // (The row stays visible but action buttons should be gone)
    const actionBtnsOnRow = page.locator(
      'tr:has(span:has-text("Declined")) button:has-text("Confirm"), ' +
      'tr:has(span:has-text("Declined")) button:has-text("Decline")'
    );
    await expect(actionBtnsOnRow).toHaveCount(0);
  });
});
