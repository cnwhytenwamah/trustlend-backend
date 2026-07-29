"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispute = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const booking_model_1 = require("./booking.model");
const user_model_1 = require("./user.model");
class Dispute extends sequelize_1.Model {
    id;
    bookingId;
    raisedById;
    againstId;
    reason;
    description;
    status;
    resolutionNotes;
    resolvedBy;
    resolvedAt;
    createdAt;
    updatedAt;
}
exports.Dispute = Dispute;
Dispute.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: booking_model_1.Booking, key: 'id' } },
    raisedById: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    againstId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    reason: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM('open', 'under_review', 'resolved', 'closed'),
        allowNull: false,
        defaultValue: 'open',
    },
    resolutionNotes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    resolvedBy: { type: sequelize_1.DataTypes.UUID, allowNull: true },
    resolvedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'Dispute', tableName: 'disputes' });
//# sourceMappingURL=dispute.model.js.map