import * as z from 'zod';
import { BookingStatus } from '@prisma/client';

export const bookingStatusPatchSchema = z.object({
  status: z.nativeEnum(BookingStatus),
  statusNote: z.string().max(500, "Notes cannot exceed 500 characters").optional().nullable(),
});

export type BookingStatusPatchInput = z.infer<typeof bookingStatusPatchSchema>;
