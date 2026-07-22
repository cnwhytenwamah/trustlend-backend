import { Payment } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add Payment-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super(Payment);
  }
}
