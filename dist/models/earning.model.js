"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Earning = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const booking_model_1 = require("./booking.model");
const user_model_1 = require("./user.model");
class Earning extends sequelize_1.Model {
    id;
    ownerId;
    bookingId;
    grossAmount;
    platformFee;
    netAmount;
    status;
    paidOutAt;
    createdAt;
    updatedAt;
}
exports.Earning = Earning;
Earning.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    ownerId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    bookingId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: booking_model_1.Booking, key: 'id' } },
    grossAmount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    platformFee: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    netAmount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'available', 'paid_out'),
        allowNull: false,
        defaultValue: 'pending',
    },
    paidOutAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'Earning', tableName: 'earnings' });
//# sourceMappingURL=earning.model.js.map