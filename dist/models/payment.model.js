"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const booking_model_1 = require("./booking.model");
const user_model_1 = require("./user.model");
class Payment extends sequelize_1.Model {
    id;
    bookingId;
    userId;
    provider;
    providerReference;
    type;
    amount;
    currency;
    status;
    paidAt;
    createdAt;
    updatedAt;
}
exports.Payment = Payment;
Payment.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: booking_model_1.Booking, key: 'id' } },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    provider: { type: sequelize_1.DataTypes.ENUM('paystack', 'flutterwave'), allowNull: false },
    providerReference: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    type: {
        type: sequelize_1.DataTypes.ENUM('rental', 'deposit', 'rental_and_deposit'),
        allowNull: false,
    },
    amount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    currency: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: 'NGN' },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'successful', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
    },
    paidAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'Payment', tableName: 'payments' });
//# sourceMappingURL=payment.model.js.map