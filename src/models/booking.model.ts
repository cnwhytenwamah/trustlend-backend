import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Equipment } from './equipment.model';
import { User } from './user.model';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'cancelled'
  | 'in_progress'
  | 'completed';

export interface BookingAttributes {
  id: string;
  renterId: string;
  equipmentId: string;
  ownerId: string; // denormalized for fast "owner bookings" queries
  startDate: string;
  endDate: string;
  dailyRate: number; // snapshotted at booking time
  rentalAmount: number;
  depositAmount: number;
  totalAmount: number;
  status: BookingStatus;
  cancellationReason: string | null;
  declineReason: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookingCreationAttributes = Optional<
  BookingAttributes,
  'id' | 'status' | 'cancellationReason' | 'declineReason' | 'createdAt' | 'updatedAt'
>;

export class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  public id!: string;
  public renterId!: string;
  public equipmentId!: string;
  public ownerId!: string;
  public startDate!: string;
  public endDate!: string;
  public dailyRate!: number;
  public rentalAmount!: number;
  public depositAmount!: number;
  public totalAmount!: number;
  public status!: BookingStatus;
  public cancellationReason!: string | null;
  public declineReason!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    renterId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    equipmentId: { type: DataTypes.UUID, allowNull: false, references: { model: Equipment, key: 'id' } },
    ownerId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    dailyRate: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    rentalAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    depositAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    totalAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined', 'cancelled', 'in_progress', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    cancellationReason: { type: DataTypes.STRING, allowNull: true },
    declineReason: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'Booking', tableName: 'bookings' },
);
