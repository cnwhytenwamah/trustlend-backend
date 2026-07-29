"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const models_1 = require("../models");
const base_repository_1 = require("./base.repository");
/**
 * TODO: add Transaction-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
class TransactionRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(models_1.Transaction);
    }
}
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.repository.js.map