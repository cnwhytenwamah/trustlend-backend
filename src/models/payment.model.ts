import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Booking } from './booking.model';
import { User } from './user.model';

export type PaymentProvider = 'paystack' | 'flutterwave';
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded';
export type PaymentType = 'rental' | 'deposit' | 'rental_and_deposit';

export interface PaymentAttributes {
  id: string;
  bookingId: string;
  userId: string;
  provider: PaymentProvider;
  providerReference: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type PaymentCreationAttributes = Optional<
  PaymentAttributes,
  'id' | 'status' | 'paidAt' | 'currency' | 'createdAt' | 'updatedAt'
>;

export class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: string;
  public bookingId!: string;
  public userId!: string;
  public provider!: PaymentProvider;
  public providerReference!: string;
  public type!: PaymentType;
  public amount!: number;
  public currency!: string;
  public status!: PaymentStatus;
  public paidAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.UUID, allowNull: false, references: { model: Booking, key: 'id' } },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    provider: { type: DataTypes.ENUM('paystack', 'flutterwave'), allowNull: false },
    providerReference: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: {
      type: DataTypes.ENUM('rental', 'deposit', 'rental_and_deposit'),
      allowNull: false,
    },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'NGN' },
    status: {
      type: DataTypes.ENUM('pending', 'successful', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paidAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Payment', tableName: 'payments' },
);
