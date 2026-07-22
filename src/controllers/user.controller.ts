import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { getParam } from '../utils/getParam';

export const userController = {
  async getMe(req: Request, res: Response) {
    const user = await userService.getMe(req.user!.userId);
    return sendSuccess(res, { message: 'Profile fetched', data: user });
  },

  async updateMe(req: Request, res: Response) {
    const user = await userService.updateMe(req.user!.userId, req.body);
    return sendSuccess(res, { message: 'Profile updated', data: user });
  },

  async updateProfilePhoto(req: Request, res: Response) {
    if (!req.file) {
      throw AppError.badRequest('No photo file provided');
    }
    const user = await userService.updateProfilePhoto(req.user!.userId, req.file.buffer);
    return sendSuccess(res, { message: 'Profile photo updated', data: user });
  },

  async deleteMe(req: Request, res: Response) {
    await userService.deleteMe(req.user!.userId);
    return sendSuccess(res, { message: 'Account deleted' });
  },

  async getById(req: Request, res: Response) {
    const user = await userService.getPublicProfile(getParam(req, "id"));
    return sendSuccess(res, { message: 'User fetched', data: user });
  },
};