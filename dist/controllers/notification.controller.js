"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const notification_service_1 = require("../services/notification.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.notificationController = {
    // GET /notifications
    async getMyNotifications(req, res) {
        const userId = req.user.userId;
        const notifications = await notification_service_1.notificationService.getUserNotifications(userId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Notifications fetched successfully',
            data: notifications,
        });
    },
    // PATCH /notifications/:id/read
    async markAsRead(req, res) {
        const notificationId = req.params.id;
        const userId = req.user.userId;
        const result = await notification_service_1.notificationService.markAsRead(notificationId, userId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'Notification marked as read',
            data: result,
        });
    },
    // PATCH /notifications/read-all
    async markAllAsRead(req, res) {
        const userId = req.user.userId;
        const result = await notification_service_1.notificationService.markAllAsRead(userId);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'All notifications marked as read',
            data: result,
        });
    },
};
//# sourceMappingURL=notification.controller.js.map