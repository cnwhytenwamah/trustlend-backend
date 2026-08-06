import { Op } from 'sequelize';
import { Message } from '../models';
import { BaseRepository } from './base.repository';

export class MessageRepository extends BaseRepository<Message> {
  constructor() {
    super(Message);
  }

  async findByConversation(conversationId: string, limit: number, offset: number) {
    return this.model.findAndCountAll({
      where: { conversationId },
      include: [{ association: 'sender', attributes: ['id', 'firstName', 'lastName', 'profilePhotoUrl'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  async markAllReadInConversation(conversationId: string, exceptSenderId: string) {
    // Marks read every message in the conversation NOT sent by the
    // person calling this (you don't need your own messages marked
    // "read" — this is about the other participant's unread messages
    // to you).
    return this.model.update(
      { isRead: true },
      { where: { conversationId, senderId: { [Op.ne]: exceptSenderId } } },
    );
  }

  async countUnreadInConversation(conversationId: string, forUserId: string) {
    return this.model.count({
      where: {
        conversationId,
        isRead: false,
        senderId: { [Op.ne]: forUserId },
      },
    });
  }
}
