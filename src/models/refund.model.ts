import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Payment } from './payment.model';

export type RefundStatus = 'pending' | 'processed' | 'rejected';

export interface RefundAttributes {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  providerReference: string | null;
  processedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type RefundCreationAttributes = Optional<
  RefundAttributes,
  'id' | 'status' | 'providerReference' | 'processedAt' | 'createdAt' | 'updatedAt'
>;

export class Refund
  extends Model<RefundAttributes, RefundCreationAttributes>
  implements RefundAttributes
{
  public id!: string;
  public paymentId!: string;
  public amount!: number;
  public reason!: string;
  public status!: RefundStatus;
  public providerReference!: string | null;
  public processedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Refund.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    paymentId: { type: DataTypes.UUID, allowNull: false, references: { model: Payment, key: 'id' } },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    reason: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'processed', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    providerReference: { type: DataTypes.STRING, allowNull: true },
    processedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Refund', tableName: 'refunds' },
);
