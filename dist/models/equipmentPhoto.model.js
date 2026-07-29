"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentPhoto = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const equipment_model_1 = require("./equipment.model");
class EquipmentPhoto extends sequelize_1.Model {
}
exports.EquipmentPhoto = EquipmentPhoto;
EquipmentPhoto.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    equipmentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: equipment_model_1.Equipment,
            key: "id",
        },
    },
    url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cloudinaryPublicId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isPrimary: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    sortOrder: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "EquipmentPhoto",
    tableName: "equipment_photos",
});
//# sourceMappingURL=equipmentPhoto.model.js.map