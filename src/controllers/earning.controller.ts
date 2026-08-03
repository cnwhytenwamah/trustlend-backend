import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { earningService } from "../services/earning.service";

class EarningController {
    async getEarnings(req: Request, res: Response) {
        const { page, limit } = req.query as unknown as { page: number; limit: number };
        const result = await earningService.getEarnings(req.user!.userId, page, limit);

        return sendSuccess(res, {
            message: "Earnings retrieved successfully",
            data: result.earnings,
            meta: { page: result.page, limit: result.limit, total: result.total },
        });
    }

    async getEarningsSummary(req: Request, res: Response) {
        const result = await earningService.getEarningsSummary(req.user!.userId);

        return sendSuccess(res, {
            message: "Earnings summary retrieved successfully",
            data: result,
        });
    }

    async getEarningTransactions(req: Request, res: Response) {
        const { page, limit } = req.query as unknown as { page: number; limit: number };
        const result = await earningService.getEarningTransactions(req.user!.userId, page, limit);

        return sendSuccess(res, {
            message: "Earning transactions retrieved successfully",
            data: result.transactions,
            meta: { page: result.page, limit: result.limit, total: result.total },
        });
    }
}

export const earningController = new EarningController();
