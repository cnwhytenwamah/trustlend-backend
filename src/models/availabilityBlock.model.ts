import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Equipment } from './equipment.model';

/**
 * Represents a date range during which an item is NOT bookable
 * (owner-blocked, e.g. for maintenance) — separate from ranges that
 * are unavailable because of an active Booking.
 */
export interface AvailabilityBlockAttributes {
  id: string;
  equipmentId: string;
  startDate: string; // DATEONLY
  endDate: string; // DATEONLY
  reason: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type AvailabilityBlockCreationAttributes = Optional<
  AvailabilityBlockAttributes,
  'id' | 'reason' | 'createdAt' | 'updatedAt'
>;

export class AvailabilityBlock
  extends Model<AvailabilityBlockAttributes, AvailabilityBlockCreationAttributes>
  implements AvailabilityBlockAttributes
{
  public id!: string;
  public equipmentId!: string;
  public startDate!: string;
  public endDate!: string;
  public reason!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AvailabilityBlock.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    equipmentId: { type: DataTypes.UUID, allowNull: false, references: { model: Equipment, key: 'id' } },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    reason: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'AvailabilityBlock', tableName: 'availability_blocks' },
);
