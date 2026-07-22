import { Transaction } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add Transaction-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super(Transaction);
  }
}
