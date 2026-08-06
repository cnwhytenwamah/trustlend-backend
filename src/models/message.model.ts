import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Conversation } from './conversation.model';
import { User } from './user.model';

export interface MessageAttributes {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type MessageCreationAttributes = Optional<MessageAttributes, 'id' | 'isRead' | 'createdAt' | 'updatedAt'>;

export class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public id!: string;
  public conversationId!: string;
  public senderId!: string;
  public body!: string;
  public isRead!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Conversation, key: 'id' },
    },
    senderId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    body: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, modelName: 'Message', tableName: 'messages' },
);
