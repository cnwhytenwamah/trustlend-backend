import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Booking } from './booking.model';
import { Equipment } from './equipment.model';
import { User } from './user.model';

export interface ReviewAttributes {
  id: string;
  bookingId: string;
  equipmentId: string;
  reviewerId: string;
  revieweeId: string; // the owner being reviewed, or the renter (owner->renter review)
  rating: number; // 1-5
  comment: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, 'id' | 'comment' | 'createdAt' | 'updatedAt'>;

export class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  public id!: string;
  public bookingId!: string;
  public equipmentId!: string;
  public reviewerId!: string;
  public revieweeId!: string;
  public rating!: number;
  public comment!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Review.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.UUID, allowNull: false, references: { model: Booking, key: 'id' } },
    equipmentId: { type: DataTypes.UUID, allowNull: false, references: { model: Equipment, key: 'id' } },
    reviewerId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    revieweeId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: 'Review', tableName: 'reviews' },
);
