"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deposit = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const booking_model_1 = require("./booking.model");
const payment_model_1 = require("./payment.model");
class Deposit extends sequelize_1.Model {
    id;
    bookingId;
    paymentId;
    amount;
    status;
    heldAt;
    releasedAt;
    refundedAt;
    createdAt;
    updatedAt;
}
exports.Deposit = Deposit;
Deposit.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: booking_model_1.Booking, key: 'id' } },
    paymentId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: payment_model_1.Payment, key: 'id' } },
    amount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM('held', 'released', 'refunded', 'claimed'),
        allowNull: false,
        defaultValue: 'held',
    },
    heldAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    releasedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    refundedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'Deposit', tableName: 'deposits' });
//# sourceMappingURL=deposit.model.js.map