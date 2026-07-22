import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  phone: z.string().min(7).max(20).optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;