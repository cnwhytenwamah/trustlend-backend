import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

export type TransactionType =
  | 'rental_payment'
  | 'deposit_hold'
  | 'deposit_release'
  | 'deposit_refund'
  | 'payout'
  | 'refund'
  | 'platform_fee';

export type TransactionStatus = 'pending' | 'successful' | 'failed';

/**
 * Immutable audit trail of every money movement on the platform.
 * Payments/Deposits/Refunds/Earnings hold the "live" state; Transaction
 * is the append-only ledger used for admin reporting and reconciliation.
 */
export interface TransactionAttributes {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  reference: string;
  status: TransactionStatus;
  relatedBookingId: string | null;
  relatedPaymentId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type TransactionCreationAttributes = Optional<
  TransactionAttributes,
  'id' | 'currency' | 'status' | 'relatedBookingId' | 'relatedPaymentId' | 'metadata' | 'createdAt' | 'updatedAt'
>;

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: string;
  public userId!: string;
  public type!: TransactionType;
  public amount!: number;
  public currency!: string;
  public reference!: string;
  public status!: TransactionStatus;
  public relatedBookingId!: string | null;
  public relatedPaymentId!: string | null;
  public metadata!: Record<string, unknown> | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    type: {
      type: DataTypes.ENUM(
        'rental_payment',
        'deposit_hold',
        'deposit_release',
        'deposit_refund',
        'payout',
        'refund',
        'platform_fee',
      ),
      allowNull: false,
    },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'NGN' },
    reference: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: {
      type: DataTypes.ENUM('pending', 'successful', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    relatedBookingId: { type: DataTypes.UUID, allowNull: true },
    relatedPaymentId: { type: DataTypes.UUID, allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: true },
  },
  { sequelize, modelName: 'Transaction', tableName: 'transactions' },
);
