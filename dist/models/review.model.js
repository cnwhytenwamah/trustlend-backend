"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const booking_model_1 = require("./booking.model");
const equipment_model_1 = require("./equipment.model");
const user_model_1 = require("./user.model");
class Review extends sequelize_1.Model {
    id;
    bookingId;
    equipmentId;
    reviewerId;
    revieweeId;
    rating;
    comment;
    createdAt;
    updatedAt;
}
exports.Review = Review;
Review.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: booking_model_1.Booking, key: 'id' } },
    equipmentId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: equipment_model_1.Equipment, key: 'id' } },
    reviewerId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    revieweeId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    rating: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'Review', tableName: 'reviews' });
//# sourceMappingURL=review.model.js.map