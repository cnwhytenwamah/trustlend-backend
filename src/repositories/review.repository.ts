import { Review } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add Review-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class ReviewRepository extends BaseRepository<Review> {
  constructor() {
    super(Review);
  }
}
