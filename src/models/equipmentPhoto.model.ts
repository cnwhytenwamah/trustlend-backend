import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Equipment } from './equipment.model';

export interface EquipmentPhotoAttributes {
  id: string;
  equipmentId: string;
  url: string;
  cloudinaryPublicId: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type EquipmentPhotoCreationAttributes = Optional<
  EquipmentPhotoAttributes,
  'id' | 'isPrimary' | 'sortOrder' | 'createdAt' | 'updatedAt'
>;

export class EquipmentPhoto
  extends Model<EquipmentPhotoAttributes, EquipmentPhotoCreationAttributes>
  implements EquipmentPhotoAttributes
{
  public id!: string;
  public equipmentId!: string;
  public url!: string;
  public cloudinaryPublicId!: string;
  public isPrimary!: boolean;
  public sortOrder!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EquipmentPhoto.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    equipmentId: { type: DataTypes.UUID, allowNull: false, references: { model: Equipment, key: 'id' } },
    url: { type: DataTypes.STRING, allowNull: false },
    cloudinaryPublicId: { type: DataTypes.STRING, allowNull: false },
    isPrimary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { sequelize, modelName: 'EquipmentPhoto', tableName: 'equipment_photos' },
);
