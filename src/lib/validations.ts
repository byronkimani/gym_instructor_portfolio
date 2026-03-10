import { z } from 'zod';

export const CreateBookingSchema = z.object({
  sessionId:   z.string().cuid(),
  clientName:  z.string().min(2).max(100),
  clientEmail: z.string().email(),
  clientPhone: z.string().regex(/^\+?[0-9\s\-]{7,15}$/).optional(),
  notes:       z.string().max(500).optional(),
});

export const UpdateBookingStatusSchema = z.object({
  status:     z.enum(['CONFIRMED', 'DECLINED', 'CANCELLED']),
  statusNote: z.string().max(300).optional(),
});

export const CreateSessionSchema = z.object({
  serviceId:   z.string().cuid(),
  title:       z.string().max(100).optional(),
  startTime:   z.string().datetime(),
  endTime:     z.string().datetime(),
  capacity:    z.number().int().min(1).max(100),
  location:    z.string().max(200).optional(),
  notes:       z.string().max(500).optional(),
});

export const ContactFormSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  message: z.string().min(10).max(1000),
});
