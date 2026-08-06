import { z } from 'zod';

export const startConversationSchema = z.object({
  recipientId: z.string().uuid(),
  equipmentId: z.string().uuid().optional(),
});

export const sendMessageSchema = z.object({
  body: z.string().min(1).max(2000),
});

export const conversationIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

export type StartConversationInput = z.infer<typeof startConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
