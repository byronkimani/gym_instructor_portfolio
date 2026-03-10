/**
 * Unit Tests — Zod Validation Schemas
 *
 * Tests CreateBookingSchema, UpdateBookingStatusSchema,
 * CreateSessionSchema, and ContactFormSchema with valid and invalid inputs.
 */
import { describe, it, expect } from 'vitest';
import {
  CreateBookingSchema,
  UpdateBookingStatusSchema,
  CreateSessionSchema,
  ContactFormSchema,
} from '../../src/lib/validations';

// ── CreateBookingSchema ───────────────────────────────────────────────────

describe('CreateBookingSchema', () => {
  const validBooking = {
    sessionId: 'clzfake0000000000000000001',
    clientName: 'Jane Doe',
    clientEmail: 'jane@example.com',
    clientPhone: '+254712345678',
    notes: 'Looking forward to it!',
  };

  it('accepts valid input', () => {
    const result = CreateBookingSchema.safeParse(validBooking);
    expect(result.success).toBe(true);
  });

  it('accepts input without optional phone and notes', () => {
    const { clientPhone, notes, ...minimal } = validBooking;
    expect(CreateBookingSchema.safeParse(minimal).success).toBe(true);
  });

  it('rejects missing sessionId', () => {
    const { sessionId, ...rest } = validBooking;
    expect(CreateBookingSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects invalid email format', () => {
    expect(
      CreateBookingSchema.safeParse({ ...validBooking, clientEmail: 'not-an-email' }).success
    ).toBe(false);
  });

  it('rejects name shorter than 2 characters', () => {
    expect(
      CreateBookingSchema.safeParse({ ...validBooking, clientName: 'A' }).success
    ).toBe(false);
  });

  it('rejects name longer than 100 characters', () => {
    expect(
      CreateBookingSchema.safeParse({ ...validBooking, clientName: 'A'.repeat(101) }).success
    ).toBe(false);
  });

  it('rejects notes longer than 500 characters', () => {
    expect(
      CreateBookingSchema.safeParse({ ...validBooking, notes: 'x'.repeat(501) }).success
    ).toBe(false);
  });

  it('rejects invalid phone format', () => {
    expect(
      CreateBookingSchema.safeParse({ ...validBooking, clientPhone: 'abc' }).success
    ).toBe(false);
  });
});

// ── UpdateBookingStatusSchema ────────────────────────────────────────────

describe('UpdateBookingStatusSchema', () => {
  it('accepts CONFIRMED', () => {
    expect(UpdateBookingStatusSchema.safeParse({ status: 'CONFIRMED' }).success).toBe(true);
  });

  it('accepts DECLINED', () => {
    expect(UpdateBookingStatusSchema.safeParse({ status: 'DECLINED' }).success).toBe(true);
  });

  it('accepts CANCELLED', () => {
    expect(UpdateBookingStatusSchema.safeParse({ status: 'CANCELLED' }).success).toBe(true);
  });

  it('accepts optional statusNote within limit', () => {
    expect(
      UpdateBookingStatusSchema.safeParse({ status: 'CONFIRMED', statusNote: 'Payment received' }).success
    ).toBe(true);
  });

  it('rejects invalid status value', () => {
    expect(UpdateBookingStatusSchema.safeParse({ status: 'PENDING' }).success).toBe(false);
  });

  it('rejects statusNote longer than 300 chars', () => {
    expect(
      UpdateBookingStatusSchema.safeParse({ status: 'CONFIRMED', statusNote: 'x'.repeat(301) }).success
    ).toBe(false);
  });
});

// ── CreateSessionSchema ──────────────────────────────────────────────────

describe('CreateSessionSchema', () => {
  const future = new Date(Date.now() + 86_400_000); // tomorrow
  const validSession = {
    serviceId: 'clzfake0000000000000000002',
    startTime: future.toISOString(),
    endTime: new Date(future.getTime() + 3_600_000).toISOString(),
    capacity: 8,
    title: 'Morning HIIT',
    location: 'Studio B',
  };

  it('accepts valid session input', () => {
    expect(CreateSessionSchema.safeParse(validSession).success).toBe(true);
  });

  it('accepts without optional title and location', () => {
    const { title, location, ...minimal } = validSession;
    expect(CreateSessionSchema.safeParse(minimal).success).toBe(true);
  });

  it('rejects missing serviceId', () => {
    const { serviceId, ...rest } = validSession;
    expect(CreateSessionSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects empty startTime', () => {
    expect(
      CreateSessionSchema.safeParse({ ...validSession, startTime: '' }).success
    ).toBe(false);
  });

  it('rejects capacity 0', () => {
    expect(CreateSessionSchema.safeParse({ ...validSession, capacity: 0 }).success).toBe(false);
  });

  it('rejects capacity > 100', () => {
    expect(CreateSessionSchema.safeParse({ ...validSession, capacity: 101 }).success).toBe(false);
  });

  it('rejects title longer than 100 chars', () => {
    expect(
      CreateSessionSchema.safeParse({ ...validSession, title: 'T'.repeat(101) }).success
    ).toBe(false);
  });
});

// ── ContactFormSchema ────────────────────────────────────────────────────

describe('ContactFormSchema', () => {
  const validContact = {
    name: 'John Kamau',
    email: 'john@gym.com',
    message: 'I am interested in your group HIIT sessions.',
  };

  it('accepts valid contact form', () => {
    expect(ContactFormSchema.safeParse(validContact).success).toBe(true);
  });

  it('rejects message shorter than 10 chars', () => {
    expect(
      ContactFormSchema.safeParse({ ...validContact, message: 'Hi there' }).success
    ).toBe(false);
  });

  it('rejects message longer than 1000 chars', () => {
    expect(
      ContactFormSchema.safeParse({ ...validContact, message: 'm'.repeat(1001) }).success
    ).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(
      ContactFormSchema.safeParse({ ...validContact, email: 'bad-email' }).success
    ).toBe(false);
  });

  it('rejects name shorter than 2 chars', () => {
    expect(
      ContactFormSchema.safeParse({ ...validContact, name: 'J' }).success
    ).toBe(false);
  });

  it('rejects name longer than 100 chars', () => {
    expect(
      ContactFormSchema.safeParse({ ...validContact, name: 'N'.repeat(101) }).success
    ).toBe(false);
  });
});
