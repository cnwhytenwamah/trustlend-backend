"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationRepository = void 0;
const models_1 = require("../models");
const base_repository_1 = require("./base.repository");
class VerificationRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(models_1.Verification);
    }
    async findByUserId(userId) {
        return this.model.findOne({
            where: {
                userId,
            },
        });
    }
    async findById(id) {
        return this.model.findByPk(id);
    }
    async updateById(id, data) {
        const verification = await this.model.findByPk(id);
        if (!verification) {
            return null;
        }
        await verification.update(data);
        return verification;
    }
    async findAllPending() {
        return this.model.findAll({
            order: [["createdAt", "DESC"]],
        });
    }
}
exports.VerificationRepository = VerificationRepository;
//# sourceMappingURL=verification.repository.js.map