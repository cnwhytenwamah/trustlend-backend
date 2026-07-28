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
  declare id: string;
declare ownerId: string;
declare title: string;
declare description: string;
declare category: string;
declare brand: string | null;
declare model: string | null;
declare condition: string | null;
declare dailyRate: number;
declare weeklyRate: number | null;
declare securityDepositAmount: number;
declare address: string | null;
declare latitude: number | null;
declare longitude: number | null;
declare status: EquipmentStatus;
declare rejectionReason: string | null;
declare readonly createdAt: Date;
declare readonly updatedAt: Date;
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
