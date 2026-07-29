"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const models_1 = require("../models");
const base_repository_1 = require("./base.repository");
class NotificationRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(models_1.Notification);
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=notification.repository.js.map