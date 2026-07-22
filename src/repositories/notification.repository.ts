import { Notification } from "../models";
import { BaseRepository } from "./base.repository";

/**
 * TODO: add Notification-specific queries here as they are needed
 * (e.g. filters, joins, geo lookups). The generic CRUD from
 * BaseRepository already covers findById, findAll, create, update, delete.
 */
export class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super(Notification);
  }
}
