import { DamageClaim } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add DamageClaim-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class DamageClaimRepository extends BaseRepository<DamageClaim> {
  constructor() {
    super(DamageClaim);
  }
}
