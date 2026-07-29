"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const equipment_model_1 = require("./equipment.model");
const user_model_1 = require("./user.model");
class Booking extends sequelize_1.Model {
    id;
    renterId;
    equipmentId;
    ownerId;
    startDate;
    endDate;
    dailyRate;
    rentalAmount;
    depositAmount;
    totalAmount;
    status;
    cancellationReason;
    declineReason;
    createdAt;
    updatedAt;
}
exports.Booking = Booking;
Booking.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    renterId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    equipmentId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: equipment_model_1.Equipment, key: 'id' } },
    ownerId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    startDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    endDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    dailyRate: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    rentalAmount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    depositAmount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    totalAmount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'accepted', 'declined', 'cancelled', 'in_progress', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
    },
    cancellationReason: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    declineReason: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'Booking', tableName: 'bookings' });
//# sourceMappingURL=booking.model.js.map