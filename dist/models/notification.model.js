"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const user_model_1 = require("./user.model");
class Notification extends sequelize_1.Model {
    id;
    userId;
    type;
    title;
    body;
    data;
    isRead;
    createdAt;
    updatedAt;
}
exports.Notification = Notification;
Notification.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    type: {
        type: sequelize_1.DataTypes.ENUM('booking_request', 'booking_accepted', 'booking_declined', 'booking_cancelled', 'payment_received', 'deposit_released', 'review_received', 'dispute_update', 'verification_update', 'system'),
        allowNull: false,
    },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    body: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    data: { type: sequelize_1.DataTypes.JSONB, allowNull: true },
    isRead: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { sequelize: database_1.sequelize, modelName: 'Notification', tableName: 'notifications' });
//# sourceMappingURL=notification.model.js.map