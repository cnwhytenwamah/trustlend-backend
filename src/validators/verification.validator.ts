import { z } from "zod";

export const createVerificationSchema = z.object({
  documentType: z
    .string()
    .min(2)
    .max(100),

  documentUrl: z
    .string()
    .url(),

  selfieUrl: z
    .string()
    .url()
    .optional(),
});

export const updateVerificationSchema =
  createVerificationSchema.partial();

export const rejectVerificationSchema = z.object({
  rejectionReason: z
    .string()
    .min(3)
    .max(500),
});

export type CreateVerificationInput =
  z.infer<typeof createVerificationSchema>;

export type UpdateVerificationInput =
  z.infer<typeof updateVerificationSchema>;

export type RejectVerificationInput =
  z.infer<typeof rejectVerificationSchema>;