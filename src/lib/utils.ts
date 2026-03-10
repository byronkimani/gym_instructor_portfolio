// src/lib/utils.ts
// Shared utility functions

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS class names, resolving conflicts correctly.
 * Uses clsx for conditional classes + tailwind-merge for conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a human-readable string.
 * @example formatDate(new Date()) => "Mon, 10 Apr 2026 at 07:00"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dayName}, ${day} ${month} ${year} at ${hours}:${minutes}`;
}

/**
 * Formats a date to a 12-hour time string.
 * @example formatTime(new Date()) => "07:00 AM"
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Returns the number of spots remaining in a session.
 */
export function getSpotsLeft(capacity: number, bookedCount: number): number {
  return Math.max(0, capacity - bookedCount);
}

/**
 * Returns true if a session has no remaining spots.
 */
export function isSessionFull(capacity: number, bookedCount: number): boolean {
  return bookedCount >= capacity;
}
