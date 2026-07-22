import { Booking } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add Booking-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class BookingRepository extends BaseRepository<Booking> {
  constructor() {
    super(Booking);
  }
}
