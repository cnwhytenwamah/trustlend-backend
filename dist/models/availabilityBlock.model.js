"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityBlock = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const equipment_model_1 = require("./equipment.model");
class AvailabilityBlock extends sequelize_1.Model {
    id;
    equipmentId;
    startDate;
    endDate;
    reason;
    createdAt;
    updatedAt;
}
exports.AvailabilityBlock = AvailabilityBlock;
AvailabilityBlock.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    equipmentId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: equipment_model_1.Equipment, key: 'id' } },
    startDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    endDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    reason: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: 'AvailabilityBlock', tableName: 'availability_blocks' });
//# sourceMappingURL=availabilityBlock.model.js.map