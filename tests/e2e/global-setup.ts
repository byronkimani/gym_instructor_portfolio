/**
 * Playwright Global Setup
 *
 * Runs ONCE before the full test suite:
 * 1. Resets and re-seeds the database
 * 2. Logs in as instructor and saves auth state to disk
 *    so authenticated tests can reuse the session cookie.
 */
import { chromium, FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const BASE_URL = 'http://127.0.0.1:3001';
const AUTH_FILE = path.join(__dirname, '.auth', 'instructor.json');

export default async function globalSetup(config: FullConfig) {
  // ── 1. Reset database and re-seed ──────────────────────────────────────
  console.log('\n[GlobalSetup] Resetting and re-seeding database...');
  try {
    // Prisma v7: --skip-seed not supported but reset doesn't automatically run seed when called directly from execSync in this environment.
    // We run reset --force then explicitly seed.
    execSync('npx prisma migrate reset --force && npx ts-node --compiler-options \'{"module":"CommonJS"}\' prisma/seed.ts', {
      cwd: path.resolve(__dirname, '../..'),
      stdio: 'inherit',
      env: { ...process.env },
    });
    console.log('[GlobalSetup] Database ready.');
  } catch (e) {
    console.error('[GlobalSetup] DB reset failed:', e);
    throw e;
  }

  // ── 2. Log in as instructor and save auth state ─────────────────────────
  console.log('[GlobalSetup] Saving instructor auth state...');

  // Ensure the .auth directory exists
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to NextAuth sign‑in page
    await page.goto(`${BASE_URL}/api/auth/signin`);

    // NextAuth credentials provider form
    await page.fill('input[name="email"]', 'instructor@gym.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait until redirected to /dashboard on successful login
    await page.waitForURL((url) => url.pathname.includes('/dashboard'), {
      timeout: 15_000,
    });

    // Save storage state (cookies + localStorage)
    await page.context().storageState({ path: AUTH_FILE });
    console.log('[GlobalSetup] Auth state saved to', AUTH_FILE);
  } finally {
    await browser.close();
  }
}
