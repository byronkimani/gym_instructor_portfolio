'use client';

/**
 * CalendarView — thin re-export wrapper around CalendarComponent.
 * The actual calendar implementation lives in:
 *   src/app/(dashboard)/calendar/CalendarComponent.tsx
 *
 * This component exists in the components/dashboard/ tree for
 * import consistency across the dashboard. It simply forwards props.
 */
export { default } from '@/app/(dashboard)/calendar/CalendarComponent';
