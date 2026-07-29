"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentPhotoRepository = void 0;
const models_1 = require("../models");
const base_repository_1 = require("./base.repository");
class EquipmentPhotoRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(models_1.EquipmentPhoto);
    }
    async countByEquipmentId(equipmentId) {
        return this.model.count({
            where: {
                equipmentId,
            },
        });
    }
    async createPhoto(data) {
        return this.model.create(data);
    }
    async findById(id) {
        return this.model.findByPk(id);
    }
    async findByEquipmentId(equipmentId) {
        return this.model.findAll({
            where: {
                equipmentId,
            },
            order: [["sortOrder", "ASC"]],
        });
    }
    async findPrimaryPhoto(equipmentId) {
        return this.model.findOne({
            where: {
                equipmentId,
                isPrimary: true,
            },
        });
    }
    async clearPrimary(equipmentId) {
        await this.model.update({
            isPrimary: false,
        }, {
            where: {
                equipmentId,
            },
        });
    }
    async setPrimary(photoId) {
        await this.model.update({
            isPrimary: true,
        }, {
            where: {
                id: photoId,
            },
        });
    }
    async deleteById(id) {
        const photo = await this.findById(id);
        if (!photo) {
            return null;
        }
        await photo.destroy();
        return true;
    }
}
exports.EquipmentPhotoRepository = EquipmentPhotoRepository;
//# sourceMappingURL=equipmentPhoto.repository.js.map