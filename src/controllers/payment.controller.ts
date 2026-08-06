import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service';
import { sendSuccess } from '../utils/apiResponse';

export const paymentController = {
  async initialize(req: Request, res: Response) {
    const result = await paymentService.initialize(req.user!.userId, req.body);
    return sendSuccess(res, { statusCode: 201, message: 'Payment initialized', data: result });
  },

  async webhook(req: Request, res: Response) {
    const signature = req.headers['x-paystack-signature'] as string | undefined;
    await paymentService.handleWebhook(req.body as Buffer, signature);
    // Paystack just needs a fast 2xx acknowledgment — no body required.
    res.sendStatus(200);
  },

  async getById(req: Request, res: Response) {
    const payment = await paymentService.getById(req.user!.userId, req.params.id as string);
    return sendSuccess(res, { message: 'Payment fetched', data: payment });
  },

  async myPayments(req: Request, res: Response) {
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const result = await paymentService.myPayments(req.user!.userId, page, limit);
    return sendSuccess(res, {
      message: 'Payments fetched',
      data: result.payments,
      meta: { page: result.page, limit: result.limit, total: result.total },
    });
  },

  async refund(req: Request, res: Response) {
    const refund = await paymentService.requestRefund(
      req.user!.userId,
      req.params.id as string,
      req.body.reason,
    );
    return sendSuccess(res, { statusCode: 201, message: 'Refund requested', data: refund });
  },
};
