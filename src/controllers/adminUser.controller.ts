import { Request, Response } from 'express';
import { adminUserService } from '../services/adminUser.service';
import { sendSuccess } from '../utils/apiResponse';

export const adminUserController = {
  async list(req: Request, res: Response) {
    const { status, search, page, limit } = req.query as unknown as {
      status?: string;
      search?: string;
      page: number;
      limit: number;
    };
    const result = await adminUserService.list({ status, search, page, limit });
    return sendSuccess(res, {
      message: 'Users fetched',
      data: result.users,
      meta: { page: result.page, limit: result.limit, total: result.total },
    });
  },

  async getById(req: Request, res: Response) {
    const user = await adminUserService.getById(req.params.id as string);
    return sendSuccess(res, { message: 'User fetched', data: user });
  },

  async updateStatus(req: Request, res: Response) {
    const user = await adminUserService.updateStatus(req.params.id as string, req.body.status);
    return sendSuccess(res, { message: 'User status updated', data: user });
  },

  async verify(req: Request, res: Response) {
    const user = await adminUserService.verify(req.params.id as string);
    return sendSuccess(res, { message: 'User identity verified', data: user });
  },

  async remove(req: Request, res: Response) {
    await adminUserService.delete(req.params.id as string);
    return sendSuccess(res, { message: 'User deleted' });
  },
};
