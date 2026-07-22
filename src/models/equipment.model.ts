import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

export type EquipmentStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'inactive';

export interface EquipmentAttributes {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  brand: string | null;
  model: string | null;
  condition: string | null;
  dailyRate: number;
  weeklyRate: number | null;
  securityDepositAmount: number;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: EquipmentStatus;
  rejectionReason: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type EquipmentCreationAttributes = Optional<
  EquipmentAttributes,
  | 'id'
  | 'brand'
  | 'model'
  | 'condition'
  | 'weeklyRate'
  | 'address'
  | 'latitude'
  | 'longitude'
  | 'status'
  | 'rejectionReason'
  | 'createdAt'
  | 'updatedAt'
>;

export class Equipment
  extends Model<EquipmentAttributes, EquipmentCreationAttributes>
  implements EquipmentAttributes
{
  public id!: string;
  public ownerId!: string;
  public title!: string;
  public description!: string;
  public category!: string;
  public brand!: string | null;
  public model!: string | null;
  public condition!: string | null;
  public dailyRate!: number;
  public weeklyRate!: number | null;
  public securityDepositAmount!: number;
  public address!: string | null;
  public latitude!: number | null;
  public longitude!: number | null;
  public status!: EquipmentStatus;
  public rejectionReason!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Equipment.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ownerId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: true },
    model: { type: DataTypes.STRING, allowNull: true },
    condition: { type: DataTypes.STRING, allowNull: true },
    dailyRate: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    weeklyRate: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    securityDepositAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    address: { type: DataTypes.STRING, allowNull: true },
    latitude: { type: DataTypes.DECIMAL(9, 6), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(9, 6), allowNull: true },
    status: {
      type: DataTypes.ENUM('draft', 'pending_review', 'approved', 'rejected', 'active', 'inactive'),
      allowNull: false,
      defaultValue: 'draft',
    },
    rejectionReason: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'Equipment', tableName: 'equipment' },
);
