import { Issue } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add Issue-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class IssueRepository extends BaseRepository<Issue> {
  constructor() {
    super(Issue);
  }
}
