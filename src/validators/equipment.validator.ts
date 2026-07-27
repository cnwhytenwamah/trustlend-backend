import { z } from 'zod';

export const createEquipmentSchema = z.object({
  title: z.string().min(3).max(100),

  description: z.string().min(10).max(1000),

  category: z.string().min(2).max(100),

  brand: z.string().max(100).optional(),

  model: z.string().max(100).optional(),

  condition: z.string().max(100).optional(),

  dailyRate: z.coerce.number().positive(),

  weeklyRate: z.coerce.number().positive().optional(),

  securityDepositAmount: z.coerce.number().min(0),

  address: z.string().max(255).optional(),

  latitude: z.coerce.number().optional(),

  longitude: z.coerce.number().optional(),
});

export const updateEquipmentSchema = createEquipmentSchema.partial();

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;

export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;