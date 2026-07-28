import { Notification } from "../models";
import { BaseRepository } from "./base.repository";

export class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super(Notification);
  }
}