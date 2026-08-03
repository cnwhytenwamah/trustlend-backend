import { z } from 'zod';

export const walletTransactionsQuerySchema = z.object({
  type: z
    .enum([
      'rental_payment',
      'deposit_hold',
      'deposit_release',
      'deposit_refund',
      'payout',
      'refund',
      'platform_fee',
    ])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
