import { Request, Response } from 'express';
import { walletService } from '../services/wallet.service';
import { sendSuccess } from '../utils/apiResponse';

export const walletController = {
  async getBalance(req: Request, res: Response) {
    const balance = await walletService.getBalance(req.user!.userId);
    return sendSuccess(res, { message: 'Wallet balance fetched', data: balance });
  },

  async getTransactions(req: Request, res: Response) {
    const { type, page, limit } = req.query as unknown as {
      type?: string;
      page: number;
      limit: number;
    };
    const result = await walletService.getTransactions(req.user!.userId, type, page, limit);
    return sendSuccess(res, {
      message: 'Wallet transactions fetched',
      data: result.transactions,
      meta: { page: result.page, limit: result.limit, total: result.total },
    });
  },
};
