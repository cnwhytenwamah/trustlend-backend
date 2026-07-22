import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Booking } from './booking.model';
import { User } from './user.model';

export type EarningStatus = 'pending' | 'available' | 'paid_out';

export interface EarningAttributes {
  id: string;
  ownerId: string;
  bookingId: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: EarningStatus;
  paidOutAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type EarningCreationAttributes = Optional<
  EarningAttributes,
  'id' | 'status' | 'paidOutAt' | 'createdAt' | 'updatedAt'
>;

export class Earning
  extends Model<EarningAttributes, EarningCreationAttributes>
  implements EarningAttributes
{
  public id!: string;
  public ownerId!: string;
  public bookingId!: string;
  public grossAmount!: number;
  public platformFee!: number;
  public netAmount!: number;
  public status!: EarningStatus;
  public paidOutAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Earning.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ownerId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    bookingId: { type: DataTypes.UUID, allowNull: false, references: { model: Booking, key: 'id' } },
    grossAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    platformFee: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    netAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'available', 'paid_out'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paidOutAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Earning', tableName: 'earnings' },
);
