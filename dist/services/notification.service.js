"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const notification_repository_1 = require("../repositories/notification.repository");
const AppError_1 = require("../utils/AppError");
const notificationRepo = new notification_repository_1.NotificationRepository();
exports.notificationService = {
    // Get all notifications for a user
    async getUserNotifications(userId) {
        const notifications = await notificationRepo.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
        return notifications;
    },
    // Mark a single notification as read
    async markAsRead(notificationId, userId) {
        const notification = await notificationRepo.findById(notificationId);
        if (!notification) {
            throw AppError_1.AppError.notFound('Notification not found');
        }
        if (notification.userId !== userId) {
            throw AppError_1.AppError.forbidden('You can only mark your own notifications as read');
        }
        const updated = await notificationRepo.update(notificationId, {
            isRead: true,
        });
        return updated;
    },
    // Mark all notifications as read for a user
    async markAllAsRead(userId) {
        await notificationRepo.updateAll({ userId }, { isRead: true });
        return { message: 'All notifications marked as read' };
    },
};
//# sourceMappingURL=notification.service.js.map