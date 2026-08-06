import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';
import { Equipment } from './equipment.model';

/**
 * One conversation per (participantOneId, participantTwoId, equipmentId)
 * combination — participants can have separate threads per listing they're
 * discussing, or a general thread with equipmentId left null. Dedup/lookup
 * logic (normalizing which participant is "one" vs "two") lives in
 * message.repository.ts, not here.
 */
export interface ConversationAttributes {
  id: string;
  participantOneId: string;
  participantTwoId: string;
  equipmentId: string | null;
  lastMessageAt: Date | null;
  lastMessagePreview: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type ConversationCreationAttributes = Optional<
  ConversationAttributes,
  'id' | 'equipmentId' | 'lastMessageAt' | 'lastMessagePreview' | 'createdAt' | 'updatedAt'
>;

export class Conversation
  extends Model<ConversationAttributes, ConversationCreationAttributes>
  implements ConversationAttributes
{
  public id!: string;
  public participantOneId!: string;
  public participantTwoId!: string;
  public equipmentId!: string | null;
  public lastMessageAt!: Date | null;
  public lastMessagePreview!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Conversation.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    participantOneId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    participantTwoId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    equipmentId: { type: DataTypes.UUID, allowNull: true, references: { model: Equipment, key: 'id' } },
    lastMessageAt: { type: DataTypes.DATE, allowNull: true },
    lastMessagePreview: { type: DataTypes.STRING(140), allowNull: true },
  },
  {
    sequelize,
    modelName: 'Conversation',
    tableName: 'conversations',
    indexes: [{ fields: ['participantOneId', 'participantTwoId', 'equipmentId'] }],
  },
);
