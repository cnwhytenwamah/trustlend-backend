import { Dispute } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add Dispute-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class DisputeRepository extends BaseRepository<Dispute> {
  constructor() {
    super(Dispute);
  }

  async findByRaisedById(raisedById: string) {
  return this.findAll({
    where: { raisedById },
    order: [["createdAt", "DESC"]],
  });
 }
};
