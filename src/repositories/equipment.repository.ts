import { Equipment } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add Equipment-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class EquipmentRepository extends BaseRepository<Equipment> {
  constructor() {
    super(Equipment);
  }
}
