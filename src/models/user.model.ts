import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Note: "owner" vs "renter" is NOT a fixed account role — any user can list
// equipment (acting as owner) and book equipment (acting as renter) on the
// same account, similar to Airbnb hosts/guests. `role` only distinguishes
// platform-level admin access.
export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  role: UserRole;
  profilePhotoUrl: string | null;
  status: UserStatus;
  isEmailVerified: boolean;
  emailVerifiedAt: Date | null;
  // Denormalized identity-verification status, distinct from isEmailVerified.
  // Set by: (a) an admin override via PATCH /admin/users/:id/verify, or
  // (b) eventually, James's Identity Verification module approving a
  // submitted Verification record — that hook isn't wired up yet, see
  // the TODO in adminUser.service.ts.
  isIdentityVerified: boolean;
  identityVerifiedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  | 'id'
  | 'phone'
  | 'profilePhotoUrl'
  | 'status'
  | 'isEmailVerified'
  | 'emailVerifiedAt'
  | 'isIdentityVerified'
  | 'identityVerifiedAt'
  | 'createdAt'
  | 'updatedAt'
>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string | null;
  public passwordHash!: string;
  public role!: UserRole;
  public profilePhotoUrl!: string | null;
  public status!: UserStatus;
  public isEmailVerified!: boolean;
  public emailVerifiedAt!: Date | null;
  public isIdentityVerified!: boolean;
  public identityVerifiedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING, allowNull: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    profilePhotoUrl: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'deleted'),
      allowNull: false,
      defaultValue: 'active',
    },
    isEmailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    emailVerifiedAt: { type: DataTypes.DATE, allowNull: true },
    isIdentityVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    identityVerifiedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    defaultScope: {
      attributes: { exclude: ['passwordHash'] },
    },
    scopes: {
      withPassword: { attributes: { include: ['passwordHash'] } },
    },
  },
);
