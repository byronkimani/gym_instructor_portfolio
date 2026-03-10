/**
 * Scenario 4 — Instructor Creates a New Session, Guest Sees It
 *
 * Uses saved instructor auth state for creation.
 * Verifies new session appears on public /schedule.
 */
import { test, expect } from '@playwright/test';

// Use a unique title so we can find it after creation
const SESSION_TITLE = `E2E HIIT Session ${Date.now()}`;

test.describe('Create Session', () => {
  test('should create a new session and show it on the public schedule', async ({ browser }) => {
    // ── Step 1: Instructor creates a session ─────────────────────────────
    const authContext = await browser.newContext({
      storageState: 'tests/e2e/.auth/instructor.json',
    });
    const instructorPage = await authContext.newPage();
    instructorPage.on('console', msg => console.log('[BROWSER LOG]', msg.type(), msg.text()));
    instructorPage.on('pageerror', err => console.log('[BROWSER ERROR]', err.message));

    await instructorPage.goto('/sessions/new');
    await instructorPage.waitForURL(/\/sessions\/new/, { timeout: 10_000 });

    // Select service (Group HIIT)
    const serviceSelect = instructorPage.locator('select[name="serviceId"], #serviceId');
    await serviceSelect.waitFor({ timeout: 8_000 });
    // Select Group HIIT (index 2, since index 0 is placeholder and 1 is 1-on-1)
    await serviceSelect.selectOption({ index: 2 });

    // Fill title if there's a title field
    const titleInput = instructorPage.locator('input[name="title"], #title');
    if (await titleInput.count() > 0) {
      await titleInput.fill(SESSION_TITLE);
    }

    // Set a future date/time (tomorrow at 08:00)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    tomorrow.setHours(8, 0, 0, 0);
    const isoDateTime = tomorrow.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"

    const startTimeInput = instructorPage.locator('input[name="startTime"], #startTime, input[type="datetime-local"]').first();
    await startTimeInput.fill(isoDateTime);

    const endHour = new Date(tomorrow);
    endHour.setHours(9);
    const endIso = endHour.toISOString().slice(0, 16);
    const endTimeInput = instructorPage.locator('input[name="endTime"], #endTime').first();
    if (await endTimeInput.count() > 0) {
      await endTimeInput.fill(endIso);
    }

    // Set capacity to 8
    const capacityInput = instructorPage.locator('input[name="capacity"], #capacity');
    await capacityInput.fill('8');

    // Submit
    await instructorPage.click('button[type="submit"]');

    // Assert redirect to /sessions list
    await instructorPage.waitForURL(/\/sessions$/, { timeout: 15_000 });

    // Assert the new session appears (by title or within the table)
    const newSessionRow = instructorPage.locator(`text=${SESSION_TITLE}`).first();
    if (await newSessionRow.count() > 0) {
      await expect(newSessionRow).toBeVisible({ timeout: 8_000 });
    } else {
      // Fallback: at least one session row in the upcoming table
      const rows = instructorPage.locator('tbody tr');
      await expect(rows.first()).toBeVisible({ timeout: 8_000 });
    }

    await authContext.close();

    // ── Step 2: Guest visits /schedule and sees it ────────────────────────
    const guestContext = await browser.newContext();
    const guestPage = await guestContext.newPage();

    await guestPage.goto('/schedule');

    // The new session card must appear on the public schedule
    const newSessionCard = guestPage.locator(`text=${SESSION_TITLE}`).first();
    await expect(newSessionCard).toBeVisible({ timeout: 10_000 });

    await guestContext.close();
  });
});
