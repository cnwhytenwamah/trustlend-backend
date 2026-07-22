import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Booking } from './booking.model';
import { User } from './user.model';

export type IssueStatus = 'open' | 'in_review' | 'resolved' | 'closed';

export interface IssueAttributes {
  id: string;
  bookingId: string;
  reporterId: string;
  description: string;
  photoUrls: string[];
  status: IssueStatus;
  resolutionNotes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type IssueCreationAttributes = Optional<
  IssueAttributes,
  'id' | 'photoUrls' | 'status' | 'resolutionNotes' | 'createdAt' | 'updatedAt'
>;

export class Issue
  extends Model<IssueAttributes, IssueCreationAttributes>
  implements IssueAttributes
{
  public id!: string;
  public bookingId!: string;
  public reporterId!: string;
  public description!: string;
  public photoUrls!: string[];
  public status!: IssueStatus;
  public resolutionNotes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Issue.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.UUID, allowNull: false, references: { model: Booking, key: 'id' } },
    reporterId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    description: { type: DataTypes.TEXT, allowNull: false },
    photoUrls: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
    status: {
      type: DataTypes.ENUM('open', 'in_review', 'resolved', 'closed'),
      allowNull: false,
      defaultValue: 'open',
    },
    resolutionNotes: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: 'Issue', tableName: 'issues' },
);
