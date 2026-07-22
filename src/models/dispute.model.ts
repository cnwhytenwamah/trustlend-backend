import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Booking } from './booking.model';
import { User } from './user.model';

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed';

export interface DisputeAttributes {
  id: string;
  bookingId: string;
  raisedById: string;
  againstId: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  resolutionNotes: string | null;
  resolvedBy: string | null;
  resolvedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type DisputeCreationAttributes = Optional<
  DisputeAttributes,
  'id' | 'status' | 'resolutionNotes' | 'resolvedBy' | 'resolvedAt' | 'createdAt' | 'updatedAt'
>;

export class Dispute
  extends Model<DisputeAttributes, DisputeCreationAttributes>
  implements DisputeAttributes
{
  public id!: string;
  public bookingId!: string;
  public raisedById!: string;
  public againstId!: string;
  public reason!: string;
  public description!: string;
  public status!: DisputeStatus;
  public resolutionNotes!: string | null;
  public resolvedBy!: string | null;
  public resolvedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Dispute.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.UUID, allowNull: false, references: { model: Booking, key: 'id' } },
    raisedById: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    againstId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    reason: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('open', 'under_review', 'resolved', 'closed'),
      allowNull: false,
      defaultValue: 'open',
    },
    resolutionNotes: { type: DataTypes.TEXT, allowNull: true },
    resolvedBy: { type: DataTypes.UUID, allowNull: true },
    resolvedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Dispute', tableName: 'disputes' },
);
