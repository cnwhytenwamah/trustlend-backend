import { z } from 'zod';

export const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const reviewIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export const equipmentReviewsParamSchema = z.object({
  equipmentId: z.string().uuid(),
});

export const userReviewsParamSchema = z.object({
  userId: z.string().uuid(),
});