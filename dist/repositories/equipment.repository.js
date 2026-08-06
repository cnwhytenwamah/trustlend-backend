"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentRepository = void 0;
const models_1 = require("../models");
const base_repository_1 = require("./base.repository");
class EquipmentRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(models_1.Equipment);
    }
    async findAll() {
        return this.model.findAll({
            where: {
                status: "active",
            },
            include: [
                {
                    association: "photos",
                    attributes: [
                        "id",
                        "url",
                        "isPrimary",
                        "sortOrder",
                    ],
                    where: {
                        isPrimary: true,
                    },
                    required: false,
                },
                {
                    association: "owner",
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "profilePhotoUrl",
                    ],
                },
            ],
            order: [
                ["createdAt", "DESC"],
            ],
        });
    }
    async findByOwnerId(ownerId) {
        return this.model.findAll({
            where: {
                ownerId,
            },
            order: [["createdAt", "DESC"]],
        });
    }
    async findAllEquipment() {
        return this.model.findAll({
            order: [["createdAt", "DESC"]],
        });
    }
    async approveEquipment(id) {
        return this.update(id, {
            status: "approved",
        });
    }
    async rejectEquipment(id) {
        return this.update(id, {
            status: "rejected",
        });
    }
    async adminDeleteEquipment(id) {
        return this.delete(id);
    }
    async findById(id) {
        return this.model.findByPk(id, {
            include: [
                {
                    association: "photos",
                    attributes: [
                        "id",
                        "url",
                        "isPrimary",
                        "sortOrder",
                    ],
                    order: [
                        ["sortOrder", "ASC"],
                    ],
                },
                {
                    association: "owner",
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "profilePhotoUrl",
                    ],
                },
            ],
        });
    }
    async updateById(id, data) {
        const equipment = await this.model.findByPk(id);
        if (!equipment) {
            return null;
        }
        await equipment.update(data);
        return equipment;
    }
    async deleteById(id) {
        const equipment = await this.model.findByPk(id);
        if (!equipment) {
            return null;
        }
        await equipment.destroy();
        return true;
    }
}
exports.EquipmentRepository = EquipmentRepository;
//# sourceMappingURL=equipment.repository.js.map