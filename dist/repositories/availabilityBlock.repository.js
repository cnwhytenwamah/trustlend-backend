"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityBlockRepository = void 0;
const models_1 = require("../models");
const base_repository_1 = require("./base.repository");
/**
 * TODO: add AvailabilityBlock-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
class AvailabilityBlockRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(models_1.AvailabilityBlock);
    }
}
exports.AvailabilityBlockRepository = AvailabilityBlockRepository;
//# sourceMappingURL=availabilityBlock.repository.js.map