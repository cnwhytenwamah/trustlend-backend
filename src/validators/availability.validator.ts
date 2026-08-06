import { z } from 'zod';

export const availabilityParamSchema = z.object({
  id: z.string().uuid(),
});

export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean().optional(),
  availableFrom: z.string().datetime().optional(),
  availableTo: z.string().datetime().optional(),
});

export const blockDatesSchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
  reason: z.string().optional(),
});

export const blockIdParamSchema = z.object({
  id: z.string().uuid(),
  blockId: z.string().uuid(),
});