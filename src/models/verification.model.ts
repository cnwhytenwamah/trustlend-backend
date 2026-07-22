import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface VerificationAttributes {
  id: string;
  userId: string;
  documentType: string; // e.g. 'national_id', 'drivers_license', 'passport'
  documentUrl: string;
  selfieUrl: string | null;
  status: VerificationStatus;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type VerificationCreationAttributes = Optional<
  VerificationAttributes,
  'id' | 'selfieUrl' | 'status' | 'rejectionReason' | 'reviewedBy' | 'reviewedAt' | 'createdAt' | 'updatedAt'
>;

export class Verification
  extends Model<VerificationAttributes, VerificationCreationAttributes>
  implements VerificationAttributes
{
  public id!: string;
  public userId!: string;
  public documentType!: string;
  public documentUrl!: string;
  public selfieUrl!: string | null;
  public status!: VerificationStatus;
  public rejectionReason!: string | null;
  public reviewedBy!: string | null;
  public reviewedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Verification.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    documentType: { type: DataTypes.STRING, allowNull: false },
    documentUrl: { type: DataTypes.STRING, allowNull: false },
    selfieUrl: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    rejectionReason: { type: DataTypes.STRING, allowNull: true },
    reviewedBy: { type: DataTypes.UUID, allowNull: true },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Verification', tableName: 'verifications' },
);
