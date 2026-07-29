"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const models_1 = require("../models");
const base_repository_1 = require("./base.repository");
/**
 * TODO: add Booking-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
class BookingRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(models_1.Booking);
    }
}
exports.BookingRepository = BookingRepository;
//# sourceMappingURL=booking.repository.js.map