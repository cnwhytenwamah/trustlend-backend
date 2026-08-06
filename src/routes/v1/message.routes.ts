import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { messageController } from '../../controllers/message.controller';
import {
  startConversationSchema,
  sendMessageSchema,
  conversationIdParamSchema,
  paginationQuerySchema,
} from '../../validators/message.validator';

const router = Router();

router.post(
  '/conversations',
  requireAuth,
  validate(startConversationSchema),
  asyncHandler(messageController.startConversation),
);

router.get('/conversations', requireAuth, asyncHandler(messageController.listConversations));

router.get(
  '/conversations/:id/messages',
  requireAuth,
  validate(conversationIdParamSchema, 'params'),
  validate(paginationQuerySchema, 'query'),
  asyncHandler(messageController.listMessages),
);

router.post(
  '/conversations/:id/messages',
  requireAuth,
  validate(conversationIdParamSchema, 'params'),
  validate(sendMessageSchema),
  asyncHandler(messageController.sendMessage),
);

router.patch(
  '/conversations/:id/read',
  requireAuth,
  validate(conversationIdParamSchema, 'params'),
  asyncHandler(messageController.markRead),
);

export default router;
