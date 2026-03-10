/**
 * Unit Tests — Booking State Machine Logic
 *
 * Tests the pure booking transition rules and bookedCount side-effects
 * extracted from the API route logic.
 */
import { describe, it, expect } from 'vitest';

// ── Pure state machine helpers (mirroring actual API logic) ───────────────

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED';

interface BookingState {
  status: BookingStatus;
  bookedCount: number;
  capacity: number;
}

function applyTransition(
  current: BookingState,
  nextStatus: BookingStatus
): { ok: true; next: BookingState } | { ok: false; error: string } {
  const { status, bookedCount, capacity } = current;

  // Valid transition table  (current → next)
  const valid: Record<BookingStatus, BookingStatus[]> = {
    PENDING: ['CONFIRMED', 'DECLINED'],
    CONFIRMED: ['CANCELLED'],
    DECLINED: [],
    CANCELLED: [],
  };

  if (!valid[status].includes(nextStatus)) {
    return { ok: false, error: `Invalid transition: ${status} → ${nextStatus}` };
  }

  // Capacity guard: cannot confirm a full session
  if (nextStatus === 'CONFIRMED' && bookedCount >= capacity) {
    return { ok: false, error: 'Session is at capacity' };
  }

  // Compute new bookedCount
  let newCount = bookedCount;
  if (nextStatus === 'CONFIRMED') newCount += 1;
  if (nextStatus === 'CANCELLED' && status === 'CONFIRMED') newCount -= 1;

  return {
    ok: true,
    next: { status: nextStatus, bookedCount: Math.max(0, newCount), capacity },
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Booking State Machine', () => {
  // ── Valid transitions ──────────────────────────────────────────────────
  it('PENDING → CONFIRMED increments bookedCount', () => {
    const result = applyTransition(
      { status: 'PENDING', bookedCount: 2, capacity: 10 },
      'CONFIRMED'
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.next.status).toBe('CONFIRMED');
      expect(result.next.bookedCount).toBe(3);
    }
  });

  it('PENDING → DECLINED does not change bookedCount', () => {
    const result = applyTransition(
      { status: 'PENDING', bookedCount: 2, capacity: 10 },
      'DECLINED'
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.next.status).toBe('DECLINED');
      expect(result.next.bookedCount).toBe(2);
    }
  });

  it('CONFIRMED → CANCELLED decrements bookedCount', () => {
    const result = applyTransition(
      { status: 'CONFIRMED', bookedCount: 5, capacity: 10 },
      'CANCELLED'
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.next.status).toBe('CANCELLED');
      expect(result.next.bookedCount).toBe(4);
    }
  });

  it('bookedCount never goes below 0 on cancellation', () => {
    const result = applyTransition(
      { status: 'CONFIRMED', bookedCount: 0, capacity: 10 },
      'CANCELLED'
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.next.bookedCount).toBe(0);
    }
  });

  // ── Invalid transitions ────────────────────────────────────────────────
  it('DECLINED → CONFIRMED is invalid', () => {
    const result = applyTransition(
      { status: 'DECLINED', bookedCount: 0, capacity: 10 },
      'CONFIRMED'
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/invalid transition/i);
    }
  });

  it('CANCELLED → CONFIRMED is invalid', () => {
    const result = applyTransition(
      { status: 'CANCELLED', bookedCount: 0, capacity: 10 },
      'CONFIRMED'
    );
    expect(result.ok).toBe(false);
  });

  it('PENDING → CANCELLED is invalid', () => {
    const result = applyTransition(
      { status: 'PENDING', bookedCount: 1, capacity: 10 },
      'CANCELLED'
    );
    expect(result.ok).toBe(false);
  });

  // ── Capacity enforcement ───────────────────────────────────────────────
  it('confirming a FULL session returns an error', () => {
    const result = applyTransition(
      { status: 'PENDING', bookedCount: 10, capacity: 10 },
      'CONFIRMED'
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/capacity/i);
    }
  });

  it('confirming when one spot remains succeeds', () => {
    const result = applyTransition(
      { status: 'PENDING', bookedCount: 9, capacity: 10 },
      'CONFIRMED'
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.next.bookedCount).toBe(10);
    }
  });
});
