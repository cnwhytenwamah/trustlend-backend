import { z } from 'zod';

export const depositIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const refundDepositSchema = z.object({
  reason: z.string().min(3).max(500),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
