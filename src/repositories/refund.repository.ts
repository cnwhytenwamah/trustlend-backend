import { Refund } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add Refund-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class RefundRepository extends BaseRepository<Refund> {
  constructor() {
    super(Refund);
  }
}
