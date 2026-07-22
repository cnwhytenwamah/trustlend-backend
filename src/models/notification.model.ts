import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

export type NotificationType =
  | 'booking_request'
  | 'booking_accepted'
  | 'booking_declined'
  | 'booking_cancelled'
  | 'payment_received'
  | 'deposit_released'
  | 'review_received'
  | 'dispute_update'
  | 'verification_update'
  | 'system';

export interface NotificationAttributes {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type NotificationCreationAttributes = Optional<
  NotificationAttributes,
  'id' | 'data' | 'isRead' | 'createdAt' | 'updatedAt'
>;

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: string;
  public userId!: string;
  public type!: NotificationType;
  public title!: string;
  public body!: string;
  public data!: Record<string, unknown> | null;
  public isRead!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    type: {
      type: DataTypes.ENUM(
        'booking_request',
        'booking_accepted',
        'booking_declined',
        'booking_cancelled',
        'payment_received',
        'deposit_released',
        'review_received',
        'dispute_update',
        'verification_update',
        'system',
      ),
      allowNull: false,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.STRING, allowNull: false },
    data: { type: DataTypes.JSONB, allowNull: true },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, modelName: 'Notification', tableName: 'notifications' },
);
