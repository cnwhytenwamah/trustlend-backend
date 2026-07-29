"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refund = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const payment_model_1 = require("./payment.model");
class Refund extends sequelize_1.Model {
    id;
    paymentId;
    amount;
    reason;
    status;
    providerReference;
    processedAt;
    createdAt;
    updatedAt;
}
exports.Refund = Refund;
Refund.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    paymentId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: payment_model_1.Payment, key: 'id' } },
    amount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    reason: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'processed', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
    },
    providerReference: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    processedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'Refund', tableName: 'refunds' });
//# sourceMappingURL=refund.model.js.map