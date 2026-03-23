/**
 * Scenario 5 — Capacity Enforcement
 *
 * Uses the Playwright API request fixture to call a protected endpoint and
 * the global setup to ensure there is a full session in the DB.
 *
 * Strategy: We book the 1-on-1 session (capacity 1) via the API first to fill it,
 * then verify the UI shows "Fully Booked" and the API returns 400.
 */
import { test, expect, request as playwrightRequest } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:3001';

async function getFirstOpenSession() {
  const apiCtx = await playwrightRequest.newContext({ baseURL: BASE_URL });
  const res = await apiCtx.get('/api/sessions?status=OPEN');
  const json = await res.json();
  await apiCtx.dispose();
  return (json.sessions ?? [])[0] as { id: string; capacity: number; bookedCount: number } | undefined;
}

test.describe('Capacity Enforcement', () => {
  test('full session shows "Fully Booked" on schedule and API returns 400', async ({ page, request }) => {
    // Get an open session
    const session = await getFirstOpenSession();
    // If all sessions are already full from a previous run skip gracefully
    if (!session) {
      test.skip();
      return;
    }

    // Fill the session by updating its bookedCount directly in the DB
    const { execSync } = require('child_process');
    execSync(`pnpm exec prisma db execute --stdin <<EOF
UPDATE "Session" SET "bookedCount" = "capacity" WHERE id = '${session.id}';
EOF`, { cwd: process.cwd(), stdio: 'ignore' });

    // Verify the API now rejects the next booking with 400
    const overflowRes = await request.post('/api/bookings', {
      data: {
        sessionId: session.id,
        clientName: 'Overflow User',
        clientEmail: 'overflow@test.com',
      },
    });
    expect(overflowRes.status()).toBe(400);
    const body = await overflowRes.json();
    expect(body.error ?? body.message ?? '').toMatch(/full|capacity/i);

    // Visit the /schedule and verify "Fully Booked" is shown
    await page.goto('/schedule');

    // Allow up to 10 s for the page to load
    await page.waitForTimeout(2_000); // let server‑side rendering settle

    const fullyBookedLabel = page.getByText(/fully booked/i).first();
    await expect(fullyBookedLabel).toBeVisible({ timeout: 10_000 });
  });
});
