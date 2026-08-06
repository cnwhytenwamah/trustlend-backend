"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const models_1 = require("../models");
const base_repository_1 = require("./base.repository");
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(models_1.User);
    }
    /**
     * Auth flows need the passwordHash, which is excluded by the
     * model's defaultScope — so this explicitly opts back into it.
     */
    async findByEmailWithPassword(email) {
        return models_1.User.scope('withPassword').findOne({ where: { email } });
    }
    async findByEmail(email) {
        return this.model.findOne({ where: { email } });
    }
    async emailExists(email) {
        const count = await this.model.count({ where: { email } });
        return count > 0;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map