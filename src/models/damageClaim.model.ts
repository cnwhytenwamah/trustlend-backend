import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Booking } from './booking.model';
import { User } from './user.model';

export type DamageClaimStatus = 'pending' | 'approved' | 'rejected';

export interface DamageClaimAttributes {
  id: string;
  bookingId: string;
  claimantId: string; // the owner filing the claim
  description: string;
  amountClaimed: number;
  evidencePhotoUrls: string[];
  status: DamageClaimStatus;
  rejectionReason: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type DamageClaimCreationAttributes = Optional<
  DamageClaimAttributes,
  'id' | 'evidencePhotoUrls' | 'status' | 'rejectionReason' | 'createdAt' | 'updatedAt'
>;

export class DamageClaim
  extends Model<DamageClaimAttributes, DamageClaimCreationAttributes>
  implements DamageClaimAttributes
{
  public id!: string;
  public bookingId!: string;
  public claimantId!: string;
  public description!: string;
  public amountClaimed!: number;
  public evidencePhotoUrls!: string[];
  public status!: DamageClaimStatus;
  public rejectionReason!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DamageClaim.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.UUID, allowNull: false, references: { model: Booking, key: 'id' } },
    claimantId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    description: { type: DataTypes.TEXT, allowNull: false },
    amountClaimed: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    evidencePhotoUrls: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    rejectionReason: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'DamageClaim', tableName: 'damage_claims' },
);
