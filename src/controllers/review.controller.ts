import { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { sendSuccess } from '../utils/apiResponse';

export const reviewController = {
  async create(req: Request, res: Response) {
    const result = await reviewService.createReview(req.user!.userId, req.body);
    return sendSuccess(res, {
      message: 'Review created successfully',
      data: result,
    });
  },

  async getEquipmentReviews(req: Request, res: Response) {
    const equipmentId = req.params.equipmentId as string;
    const result = await reviewService.getEquipmentReviews(equipmentId);
    return sendSuccess(res, {
      message: 'Equipment reviews fetched successfully',
      data: result,
    });
  },

  async getUserReviews(req: Request, res: Response) {
    const userId = req.params.userId as string;
    const result = await reviewService.getUserReviews(userId);
    return sendSuccess(res, {
      message: 'User reviews fetched successfully',
      data: result,
    });
  },

  async update(req: Request, res: Response) {
    const reviewId = req.params.id as string;
    const result = await reviewService.updateReview(reviewId, req.user!.userId, req.body);
    return sendSuccess(res, {
      message: 'Review updated successfully',
      data: result,
    });
  },

  async delete(req: Request, res: Response) {
    const reviewId = req.params.id as string;
    const result = await reviewService.deleteReview(reviewId, req.user!.userId);
    return sendSuccess(res, {
      message: 'Review deleted successfully',
      data: result,
    });
  },
};
