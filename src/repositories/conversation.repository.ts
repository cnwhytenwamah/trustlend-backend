import { Op } from 'sequelize';
import { Conversation } from '../models';
import { BaseRepository } from './base.repository';

export class ConversationRepository extends BaseRepository<Conversation> {
  constructor() {
    super(Conversation);
  }

  /**
   * Finds an existing conversation between two users (regardless of which
   * one is "participantOne" vs "participantTwo" — that ordering is just an
   * implementation detail, not meaningful to callers), optionally scoped
   * to a specific equipment listing.
   */
  async findBetween(userIdA: string, userIdB: string, equipmentId: string | null) {
    return this.model.findOne({
      where: {
        equipmentId,
        [Op.or]: [
          { participantOneId: userIdA, participantTwoId: userIdB },
          { participantOneId: userIdB, participantTwoId: userIdA },
        ],
      },
    });
  }

  async findForUser(userId: string) {
    return this.model.findAll({
      where: {
        [Op.or]: [{ participantOneId: userId }, { participantTwoId: userId }],
      },
      include: [
        { association: 'participantOne', attributes: ['id', 'firstName', 'lastName', 'profilePhotoUrl'] },
        { association: 'participantTwo', attributes: ['id', 'firstName', 'lastName', 'profilePhotoUrl'] },
        { association: 'equipment', attributes: ['id', 'title'] },
      ],
      order: [['lastMessageAt', 'DESC']],
    });
  }

  async touchLastMessage(conversationId: string, preview: string) {
    return this.update(conversationId, {
      lastMessageAt: new Date(),
      lastMessagePreview: preview.slice(0, 140),
    } as never);
  }
}
