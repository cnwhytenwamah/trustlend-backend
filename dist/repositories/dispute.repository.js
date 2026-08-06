"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeRepository = void 0;
const models_1 = require("../models");
const base_repository_1 = require("./base.repository");
/**
 * TODO: add Dispute-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
class DisputeRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(models_1.Dispute);
    }
    async findByRaisedById(raisedById) {
        return this.findAll({
            where: { raisedById },
            order: [["createdAt", "DESC"]],
        });
    }
}
exports.DisputeRepository = DisputeRepository;
;
//# sourceMappingURL=dispute.repository.js.map