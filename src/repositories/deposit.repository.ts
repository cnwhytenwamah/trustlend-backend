import { Deposit } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add Deposit-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class DepositRepository extends BaseRepository<Deposit> {
  constructor() {
    super(Deposit);
  }
}
