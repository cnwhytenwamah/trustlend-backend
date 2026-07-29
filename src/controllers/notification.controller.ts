import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/apiResponse';

export const notificationController = {
  // GET /notifications
  async getMyNotifications(req: Request, res: Response) {
    const userId = req.user!.userId;
    const notifications = await notificationService.getUserNotifications(userId);
    return sendSuccess(res, {
      message: 'Notifications fetched successfully',
      data: notifications,
    });
  },

  // PATCH /notifications/:id/read
  async markAsRead(req: Request, res: Response) {
    const notificationId = req.params.id as string;
    const userId = req.user!.userId;
    const result = await notificationService.markAsRead(notificationId, userId);
    return sendSuccess(res, {
      message: 'Notification marked as read',
      data: result,
    });
  },

  // PATCH /notifications/read-all
  async markAllAsRead(req: Request, res: Response) {
    const userId = req.user!.userId;
    const result = await notificationService.markAllAsRead(userId);
    return sendSuccess(res, {
      message: 'All notifications marked as read',
      data: result,
    });
  },
};