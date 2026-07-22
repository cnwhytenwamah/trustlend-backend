import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Booking } from './booking.model';
import { Payment } from './payment.model';

export type DepositStatus = 'held' | 'released' | 'refunded' | 'claimed';

export interface DepositAttributes {
  id: string;
  bookingId: string;
  paymentId: string;
  amount: number;
  status: DepositStatus;
  heldAt: Date | null;
  releasedAt: Date | null;
  refundedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type DepositCreationAttributes = Optional<
  DepositAttributes,
  'id' | 'status' | 'heldAt' | 'releasedAt' | 'refundedAt' | 'createdAt' | 'updatedAt'
>;

export class Deposit
  extends Model<DepositAttributes, DepositCreationAttributes>
  implements DepositAttributes
{
  public id!: string;
  public bookingId!: string;
  public paymentId!: string;
  public amount!: number;
  public status!: DepositStatus;
  public heldAt!: Date | null;
  public releasedAt!: Date | null;
  public refundedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Deposit.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.UUID, allowNull: false, references: { model: Booking, key: 'id' } },
    paymentId: { type: DataTypes.UUID, allowNull: false, references: { model: Payment, key: 'id' } },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM('held', 'released', 'refunded', 'claimed'),
      allowNull: false,
      defaultValue: 'held',
    },
    heldAt: { type: DataTypes.DATE, allowNull: true },
    releasedAt: { type: DataTypes.DATE, allowNull: true },
    refundedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Deposit', tableName: 'deposits' },
);
