// src/types/index.ts
// Shared TypeScript enums and interfaces derived from the LLTD data model (Section 2)

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum ServiceType {
  ONE_ON_ONE = 'ONE_ON_ONE',
  GROUP = 'GROUP',
}

export enum SessionStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  description: string;
  type: ServiceType;
  durationMins: number;
  priceNote?: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Session {
  id: string;
  serviceId: string;
  service?: Service;
  title?: string | null;
  startTime: Date | string;
  endTime: Date | string;
  capacity: number;
  bookedCount: number;
  spotsLeft?: number; // Computed field — not stored in DB
  location?: string | null;
  notes?: string | null;
  status: SessionStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  bookings?: Booking[];
}

export interface Booking {
  id: string;
  sessionId: string;
  session?: Session;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  notes?: string | null;
  status: BookingStatus;
  statusNote?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/** Derived client view — built by grouping Booking records by clientEmail (LLTD Section 2.2) */
export interface ClientSummary {
  clientEmail: string;
  clientName: string;
  clientPhone?: string | null;
  totalBookings: number;
  confirmedBookings?: number;
  firstBookingDate: Date | string;
}
