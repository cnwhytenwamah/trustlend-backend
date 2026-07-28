import { z } from "zod";

export const createIssueSchema = z.object({
  bookingId: z.string().uuid(),

  description: z
    .string()
    .min(10)
    .max(2000),

  photoUrls: z
    .array(z.string().url())
    .optional(),
});

export const updateIssueSchema = z.object({
  description: z
    .string()
    .min(10)
    .max(2000)
    .optional(),

  photoUrls: z
    .array(z.string().url())
    .optional(),

  status: z
    .enum([
      "open",
      "in_review",
      "resolved",
      "closed",
    ])
    .optional(),

  resolutionNotes: z
    .string()
    .max(2000)
    .nullable()
    .optional(),
});

export type CreateIssueInput = z.infer<
  typeof createIssueSchema
>;

export type UpdateIssueInput = z.infer<
  typeof updateIssueSchema
>;