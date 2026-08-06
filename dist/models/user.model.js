"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class User extends sequelize_1.Model {
    id;
    firstName;
    lastName;
    email;
    phone;
    passwordHash;
    role;
    profilePhotoUrl;
    status;
    isEmailVerified;
    emailVerifiedAt;
    isIdentityVerified;
    identityVerifiedAt;
    createdAt;
    updatedAt;
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    lastName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    phone: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    passwordHash: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    role: {
        type: sequelize_1.DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
    },
    profilePhotoUrl: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'suspended', 'deleted'),
        allowNull: false,
        defaultValue: 'active',
    },
    isEmailVerified: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    emailVerifiedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    isIdentityVerified: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    identityVerifiedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, {
    sequelize: database_1.sequelize,
    modelName: 'User',
    tableName: 'users',
    defaultScope: {
        attributes: { exclude: ['passwordHash'] },
    },
    scopes: {
        withPassword: { attributes: { include: ['passwordHash'] } },
    },
});
//# sourceMappingURL=user.model.js.map