import { z } from 'zod';

export const createDamageClaimSchema = z.object({
  bookingId: z.string().uuid(),
  description: z.string().min(10).max(2000),
  amountClaimed: z.coerce.number().positive(),
});

export const rejectDamageClaimSchema = z.object({
  reason: z.string().min(3).max(500),
});

export const damageClaimIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const adminListDamageClaimsQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
