"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equipment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const user_model_1 = require("./user.model");
class Equipment extends sequelize_1.Model {
}
exports.Equipment = Equipment;
Equipment.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    ownerId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    category: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    brand: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    model: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    condition: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    dailyRate: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    weeklyRate: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: true },
    securityDepositAmount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    address: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    latitude: { type: sequelize_1.DataTypes.DECIMAL(9, 6), allowNull: true },
    longitude: { type: sequelize_1.DataTypes.DECIMAL(9, 6), allowNull: true },
    status: {
        type: sequelize_1.DataTypes.ENUM('draft', 'pending_review', 'approved', 'rejected', 'active', 'inactive'),
        allowNull: false,
        defaultValue: 'draft',
    },
    rejectionReason: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'Equipment', tableName: 'equipment' });
//# sourceMappingURL=equipment.model.js.map