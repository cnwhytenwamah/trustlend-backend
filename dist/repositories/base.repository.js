"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
/**
 * Generic Sequelize repository. Every entity-specific repository
 * (UserRepository, EquipmentRepository, BookingRepository, ...) extends
 * this instead of re-writing the same CRUD boilerplate.
 *
 * Repositories are the ONLY layer allowed to talk to Sequelize models
 * directly. Services call repositories; they never import a model.
 *
 * Example of extending it:
 *
 *   export class EquipmentRepository extends BaseRepository<Equipment> {
 *     constructor() { super(Equipment); }
 *
 *     // add equipment-specific queries here, e.g.:
 *     findNearby(lat: number, lng: number, radiusKm: number) { ... }
 *   }
 */
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findById(id, options = {}) {
        return this.model.findByPk(id, options);
    }
    async findOne(where, options = {}) {
        return this.model.findOne({ where, ...options });
    }
    async findAll(options = {}) {
        return this.model.findAll(options);
    }
    async findAndCountAll(options = {}) {
        return this.model.findAndCountAll(options);
    }
    async create(data) {
        return this.model.create(data);
    }
    async update(id, data) {
        const record = await this.model.findByPk(id);
        if (!record)
            return null;
        return record.update(data);
    }
    async delete(id) {
        const deletedCount = await this.model.destroy({
            where: { id },
        });
        return deletedCount > 0;
    }
    async count(where = {}) {
        return this.model.count({ where });
    }
    /**
     * Update multiple records matching a condition
     * @param where - The condition to match records
     * @param data - The data to update
     * @returns The number of updated records
     */
    async updateAll(where, data) {
        const [count] = await this.model.update(data, {
            where,
        });
        return count;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map