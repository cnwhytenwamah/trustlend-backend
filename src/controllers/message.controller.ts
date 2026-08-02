import { Request, Response } from 'express';
import { messageService } from '../services/message.service';
import { sendSuccess } from '../utils/apiResponse';

export const messageController = {
  async startConversation(req: Request, res: Response) {
    const conversation = await messageService.startConversation(req.user!.userId, req.body);
    return sendSuccess(res, { statusCode: 201, message: 'Conversation ready', data: conversation });
  },

  async listConversations(req: Request, res: Response) {
    const conversations = await messageService.listConversations(req.user!.userId);
    return sendSuccess(res, { message: 'Conversations fetched', data: conversations });
  },

  async listMessages(req: Request, res: Response) {
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const result = await messageService.listMessages(req.user!.userId, req.params.id as string, page, limit);
    return sendSuccess(res, {
      message: 'Messages fetched',
      data: result.messages,
      meta: { page: result.page, limit: result.limit, total: result.total },
    });
  },

  async sendMessage(req: Request, res: Response) {
    const message = await messageService.sendMessage(
      req.user!.userId,
      req.params.id as string,
      req.body.body,
    );
    return sendSuccess(res, { statusCode: 201, message: 'Message sent', data: message });
  },

  async markRead(req: Request, res: Response) {
    await messageService.markConversationRead(req.user!.userId, req.params.id as string);
    return sendSuccess(res, { message: 'Conversation marked as read' });
  },
};
