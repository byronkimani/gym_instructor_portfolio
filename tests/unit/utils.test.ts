/**
 * Unit Tests — src/lib/utils.ts
 *
 * Tests formatDate, formatTime, getSpotsLeft, and isSessionFull
 * with deterministic inputs.
 */
import { describe, it, expect } from 'vitest';
import { formatDate, formatTime, getSpotsLeft, isSessionFull } from '../../src/lib/utils';

// ── formatDate ────────────────────────────────────────────────────────────

describe('formatDate', () => {
  // Use a fixed ISO date so tests are deterministic regardless of timezone.
  // We only check the structural pattern (day, month, year present)
  // because locale rendering depends on the OS.

  it('returns a non-empty string for a valid Date', () => {
    const result = formatDate(new Date('2026-04-10T07:00:00'));
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('accepts a date string input', () => {
    const result = formatDate('2026-01-15T08:30:00');
    expect(typeof result).toBe('string');
    expect(result).toMatch(/2026/); // year should appear
  });

  it('includes the time portion', () => {
    const result = formatDate('2026-04-10T07:00:00');
    // Should contain "07:00" or similar time representation
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it('includes the month abbreviation', () => {
    const result = formatDate('2026-04-10T07:00:00');
    // Should contain a 3-letter month abbreviation (Apr) or numeric
    expect(result).toMatch(/Apr|04|10/i);
  });
});

// ── formatTime ────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('returns a 12-hour time string with AM/PM', () => {
    // Using noon for unambiguous AM/PM
    const result = formatTime(new Date('2026-04-10T12:00:00'));
    expect(result).toMatch(/PM|AM/i);
  });

  it('accepts a date string input', () => {
    const result = formatTime('2026-04-10T07:30:00');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('formats midnight as 12:00 AM', () => {
    const result = formatTime(new Date('2026-04-10T00:00:00'));
    // Various locales may render as "12:00 AM" or "12:00 am"
    expect(result.toLowerCase()).toMatch(/12:00\s*am/);
  });

  it('formats noon as 12:00 PM', () => {
    const result = formatTime(new Date('2026-04-10T12:00:00'));
    expect(result.toLowerCase()).toMatch(/12:00\s*pm/);
  });
});

// ── getSpotsLeft ──────────────────────────────────────────────────────────

describe('getSpotsLeft', () => {
  it('returns capacity minus bookedCount', () => {
    expect(getSpotsLeft(10, 3)).toBe(7);
  });

  it('returns 0 when session is exactly full', () => {
    expect(getSpotsLeft(5, 5)).toBe(0);
  });

  it('returns 0 (not negative) when overbooked', () => {
    expect(getSpotsLeft(5, 6)).toBe(0);
  });

  it('returns full capacity when no bookings', () => {
    expect(getSpotsLeft(8, 0)).toBe(8);
  });

  it('handles capacity of 1', () => {
    expect(getSpotsLeft(1, 0)).toBe(1);
    expect(getSpotsLeft(1, 1)).toBe(0);
  });
});

// ── isSessionFull ─────────────────────────────────────────────────────────

describe('isSessionFull', () => {
  it('returns true when bookedCount equals capacity', () => {
    expect(isSessionFull(10, 10)).toBe(true);
  });

  it('returns true when bookedCount exceeds capacity', () => {
    expect(isSessionFull(10, 11)).toBe(true);
  });

  it('returns false when there are spots available', () => {
    expect(isSessionFull(10, 9)).toBe(false);
  });

  it('returns false for empty session', () => {
    expect(isSessionFull(10, 0)).toBe(false);
  });

  it('handles single-spot session that is full', () => {
    expect(isSessionFull(1, 1)).toBe(true);
  });

  it('handles single-spot session with no bookings', () => {
    expect(isSessionFull(1, 0)).toBe(false);
  });
});
