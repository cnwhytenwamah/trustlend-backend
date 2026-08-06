"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageClaimRepository = void 0;
const models_1 = require("../models");
const base_repository_1 = require("./base.repository");
/**
 * TODO: add DamageClaim-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
class DamageClaimRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(models_1.DamageClaim);
    }
}
exports.DamageClaimRepository = DamageClaimRepository;
//# sourceMappingURL=damageClaim.repository.js.map