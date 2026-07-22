import { AvailabilityBlock } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add AvailabilityBlock-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class AvailabilityBlockRepository extends BaseRepository<AvailabilityBlock> {
  constructor() {
    super(AvailabilityBlock);
  }
}
