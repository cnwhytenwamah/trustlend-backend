import { z } from 'zod';

export const analyticsDateRangeQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const topEquipmentQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
