"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verification = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const user_model_1 = require("./user.model");
class Verification extends sequelize_1.Model {
    id;
    userId;
    documentType;
    documentUrl;
    selfieUrl;
    status;
    rejectionReason;
    reviewedBy;
    reviewedAt;
    createdAt;
    updatedAt;
}
exports.Verification = Verification;
Verification.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    documentType: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    documentUrl: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    selfieUrl: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
    },
    rejectionReason: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    reviewedBy: { type: sequelize_1.DataTypes.UUID, allowNull: true },
    reviewedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'Verification', tableName: 'verifications' });
//# sourceMappingURL=verification.model.js.map