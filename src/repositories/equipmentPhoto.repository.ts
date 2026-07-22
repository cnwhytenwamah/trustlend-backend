import { EquipmentPhoto } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add EquipmentPhoto-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class EquipmentPhotoRepository extends BaseRepository<EquipmentPhoto> {
  constructor() {
    super(EquipmentPhoto);
  }
}
