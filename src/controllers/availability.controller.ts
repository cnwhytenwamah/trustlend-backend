import { Request, Response } from 'express';
import { availabilityService } from '../services/availability.service';
import { sendSuccess } from '../utils/apiResponse';

export const availabilityController = {
  async getAvailability(req: Request, res: Response) {
    const equipmentId = req.params.id as string;
    const result = await availabilityService.getAvailability(equipmentId);
    return sendSuccess(res, {
      message: 'Availability fetched successfully',
      data: result,
    });
  },

  async updateAvailability(req: Request, res: Response) {
    const equipmentId = req.params.id as string;
    const result = await availabilityService.updateAvailability(equipmentId, req.body);
    return sendSuccess(res, {
      message: 'Availability updated successfully',
      data: result,
    });
  },

  async blockDates(req: Request, res: Response) {
    const equipmentId = req.params.id as string;
    const result = await availabilityService.blockDates(equipmentId, req.body);
    return sendSuccess(res, {
      message: 'Dates blocked successfully',
      data: result,
    });
  },

  async deleteBlock(req: Request, res: Response) {
    const equipmentId = req.params.id as string;
    const blockId = req.params.blockId as string;
    const result = await availabilityService.deleteBlock(equipmentId, blockId);
    return sendSuccess(res, {
      message: 'Blocked date removed successfully',
      data: result,
    });
  },
};