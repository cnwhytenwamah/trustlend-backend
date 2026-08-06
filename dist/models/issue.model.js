"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Issue = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const booking_model_1 = require("./booking.model");
const user_model_1 = require("./user.model");
class Issue extends sequelize_1.Model {
    id;
    bookingId;
    reporterId;
    description;
    photoUrls;
    status;
    resolutionNotes;
    createdAt;
    updatedAt;
}
exports.Issue = Issue;
Issue.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: booking_model_1.Booking, key: 'id' } },
    reporterId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: user_model_1.User, key: 'id' } },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    photoUrls: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), allowNull: false, defaultValue: [] },
    status: {
        type: sequelize_1.DataTypes.ENUM('open', 'in_review', 'resolved', 'closed'),
        allowNull: false,
        defaultValue: 'open',
    },
    resolutionNotes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'Issue', tableName: 'issues' });
//# sourceMappingURL=issue.model.js.map