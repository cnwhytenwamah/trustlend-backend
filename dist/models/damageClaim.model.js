"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageClaim = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const booking_model_1 = require("./booking.model");
const user_model_1 = require("./user.model");
class DamageClaim extends sequelize_1.Model {
    id;
    bookingId;
    claimantId;
    description;
    amountClaimed;
    evidencePhotoUrls;
    status;
    rejectionReason;
    createdAt;
    updatedAt;
}
exports.DamageClaim = DamageClaim;
DamageClaim.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: booking_model_1.Booking, key: 'id' } },
    claimantId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    amountClaimed: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    evidencePhotoUrls: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), allowNull: false, defaultValue: [] },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
    },
    rejectionReason: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'DamageClaim', tableName: 'damage_claims' });
//# sourceMappingURL=damageClaim.model.js.map