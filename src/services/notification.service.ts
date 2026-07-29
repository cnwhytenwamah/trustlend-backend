import { NotificationRepository } from '../repositories/notification.repository';
import { AppError } from '../utils/AppError';

const notificationRepo = new NotificationRepository();

export const notificationService = {
  // Get all notifications for a user
  async getUserNotifications(userId: string) {
    const notifications = await notificationRepo.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return notifications;
  },

  // Mark a single notification as read
  async markAsRead(notificationId: string, userId: string) {
    const notification = await notificationRepo.findById(notificationId);
    if (!notification) {
      throw AppError.notFound('Notification not found');
    }

    if (notification.userId !== userId) {
      throw AppError.forbidden('You can only mark your own notifications as read');
    }

    const updated = await notificationRepo.update(notificationId, {
      isRead: true,
    });
    return updated;
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string) {
    await notificationRepo.updateAll(
      { userId },
      { isRead: true }
    );
    return { message: 'All notifications marked as read' };
  },
};