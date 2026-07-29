import { z } from 'zod';

export const adminUserIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(['active', 'suspended', 'deleted']),
});

export const adminListUsersQuerySchema = z.object({
  status: z.enum(['active', 'suspended', 'deleted']).optional(),
  search: z.string().min(1).max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
