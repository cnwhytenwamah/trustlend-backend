import { z } from 'zod';

export const createBookingSchema = z.object({
  equipmentId: z.string().uuid(),
  startDate: z.string().date(),
  endDate: z.string().date(),
});

export const bookingIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().min(1).max(255).optional(),
});

export const declineBookingSchema = z.object({
  reason: z.string().min(1).max(255),
});