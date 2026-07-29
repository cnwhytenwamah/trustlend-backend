"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const user_model_1 = require("./user.model");
class Transaction extends sequelize_1.Model {
    id;
    userId;
    type;
    amount;
    currency;
    reference;
    status;
    relatedBookingId;
    relatedPaymentId;
    metadata;
    createdAt;
    updatedAt;
}
exports.Transaction = Transaction;
Transaction.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    type: {
        type: sequelize_1.DataTypes.ENUM('rental_payment', 'deposit_hold', 'deposit_release', 'deposit_refund', 'payout', 'refund', 'platform_fee'),
        allowNull: false,
    },
    amount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    currency: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: 'NGN' },
    reference: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'successful', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
    },
    relatedBookingId: { type: sequelize_1.DataTypes.UUID, allowNull: true },
    relatedPaymentId: { type: sequelize_1.DataTypes.UUID, allowNull: true },
    metadata: { type: sequelize_1.DataTypes.JSONB, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'Transaction', tableName: 'transactions' });
//# sourceMappingURL=transaction.model.js.map