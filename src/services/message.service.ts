import { ConversationRepository } from '../repositories/conversation.repository';
import { MessageRepository } from '../repositories/message.repository';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';
import { emitToUser, emitToConversation } from '../realtime/emitter';
import { Conversation } from '../models/conversation.model';
import { StartConversationInput } from '../validators/message.validator';

const conversationRepository = new ConversationRepository();
const messageRepository = new MessageRepository();
const userRepository = new UserRepository();

function otherParticipant(conversation: Conversation, userId: string): string {
  return conversation.participantOneId === userId
    ? conversation.participantTwoId
    : conversation.participantOneId;
}

/**
 * Exported standalone (not a method on messageService) so it works
 * identically whether called from a controller or a socket event handler,
 * with no risk of losing `this` binding if it's ever destructured.
 */
export async function assertParticipant(userId: string, conversationId: string): Promise<Conversation> {
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation) throw AppError.notFound('Conversation not found');
  if (conversation.participantOneId !== userId && conversation.participantTwoId !== userId) {
    throw AppError.forbidden('You are not part of this conversation');
  }
  return conversation;
}

export const messageService = {
  async startConversation(userId: string, input: StartConversationInput) {
    if (input.recipientId === userId) {
      throw AppError.badRequest("You can't start a conversation with yourself");
    }

    const recipient = await userRepository.findById(input.recipientId);
    if (!recipient) throw AppError.notFound('Recipient not found');

    const equipmentId = input.equipmentId ?? null;

    const existing = await conversationRepository.findBetween(userId, input.recipientId, equipmentId);
    if (existing) return existing;

    return conversationRepository.create({
      participantOneId: userId,
      participantTwoId: input.recipientId,
      equipmentId,
    } as never);
  },

  async listConversations(userId: string) {
    const conversations = await conversationRepository.findForUser(userId);

    return Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await messageRepository.countUnreadInConversation(conversation.id, userId);
        return { ...conversation.toJSON(), unreadCount };
      }),
    );
  },

  async listMessages(userId: string, conversationId: string, page: number, limit: number) {
    await assertParticipant(userId, conversationId);

    const { rows, count } = await messageRepository.findByConversation(
      conversationId,
      limit,
      (page - 1) * limit,
    );

    return { messages: rows, total: count, page, limit };
  },

  /**
   * The single place a message actually gets created — called from the
   * REST controller (POST /conversations/:id/messages) AND from the
   * socket 'message:send' handler, so both paths behave identically and
   * both trigger the same real-time push.
   */
  async sendMessage(senderId: string, conversationId: string, body: string) {
    const conversation = await assertParticipant(senderId, conversationId);

    const message = await messageRepository.create({ conversationId, senderId, body } as never);
    await conversationRepository.touchLastMessage(conversationId, body);

    const recipientId = otherParticipant(conversation, senderId);
    const payload = { message, conversationId };

    // Push to anyone actively viewing this thread right now, AND to the
    // recipient's user-level room — so they're notified even if they're
    // not currently looking at this specific conversation (e.g. a badge
    // count elsewhere in the app).
    emitToConversation(conversationId, 'message:new', payload);
    emitToUser(recipientId, 'message:new', payload);

    return message;
  },

  async markConversationRead(userId: string, conversationId: string) {
    const conversation = await assertParticipant(userId, conversationId);
    await messageRepository.markAllReadInConversation(conversationId, userId);

    const otherId = otherParticipant(conversation, userId);
    emitToUser(otherId, 'conversation:read', { conversationId, readByUserId: userId });
  },
};
