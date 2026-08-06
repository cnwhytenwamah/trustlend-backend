import { Request, Response } from 'express';
import { depositService } from '../services/deposit.service';
import { sendSuccess } from '../utils/apiResponse';

export const depositController = {
  async myDeposits(req: Request, res: Response) {
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const result = await depositService.myDeposits(req.user!.userId, page, limit);
    return sendSuccess(res, {
      message: 'Deposits fetched',
      data: result.deposits,
      meta: { page: result.page, limit: result.limit, total: result.total },
    });
  },

  async getById(req: Request, res: Response) {
    const deposit = await depositService.getById(req.user!.userId, req.params.id as string);
    return sendSuccess(res, { message: 'Deposit fetched', data: deposit });
  },

  async hold(req: Request, res: Response) {
    const deposit = await depositService.hold(req.params.id as string);
    return sendSuccess(res, { message: 'Deposit held', data: deposit });
  },

  async release(req: Request, res: Response) {
    const refund = await depositService.release(
      req.user!.userId,
      req.user!.role,
      req.params.id as string,
    );
    return sendSuccess(res, {
      message: 'Deposit released — refund to the renter has been queued',
      data: refund,
    });
  },

  async refund(req: Request, res: Response) {
    const refund = await depositService.refund(req.params.id as string, req.body.reason);
    return sendSuccess(res, { message: 'Deposit refund initiated', data: refund });
  },
};
