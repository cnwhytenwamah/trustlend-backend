import { Request, Response } from 'express';
import { analyticsService } from '../services/analytics.service';
import { sendSuccess } from '../utils/apiResponse';

export const analyticsController = {
  async dashboard(_req: Request, res: Response) {
    const data = await analyticsService.dashboard();
    return sendSuccess(res, { message: 'Dashboard summary fetched', data });
  },

  async revenue(req: Request, res: Response) {
    const { from, to } = req.query as unknown as { from?: Date; to?: Date };
    const data = await analyticsService.revenue(from, to);
    return sendSuccess(res, { message: 'Revenue analytics fetched', data });
  },

  async bookings(req: Request, res: Response) {
    const { from, to } = req.query as unknown as { from?: Date; to?: Date };
    const data = await analyticsService.bookings(from, to);
    return sendSuccess(res, { message: 'Booking analytics fetched', data });
  },

  async users(req: Request, res: Response) {
    const { from, to } = req.query as unknown as { from?: Date; to?: Date };
    const data = await analyticsService.users(from, to);
    return sendSuccess(res, { message: 'User analytics fetched', data });
  },

  async equipment(req: Request, res: Response) {
    const { limit } = req.query as unknown as { limit: number };
    const data = await analyticsService.equipment(limit);
    return sendSuccess(res, { message: 'Equipment analytics fetched', data });
  },
};
