import { z } from 'zod';

export const initializePaymentSchema = z.object({
  bookingId: z.string().uuid(),
  type: z.enum(['rental', 'deposit', 'rental_and_deposit']),
});

export const paymentIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const refundPaymentSchema = z.object({
  reason: z.string().min(3).max(500),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>;
