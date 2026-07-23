import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { earningService } from "../services/earning.service";

class EarningController {
    async getEarnings(req: Request, res: Response) {
        const result = await earningService.getEarnings();

        return sendSuccess(res,{
            message: "Earnings retrieved successfully",
            data: result,
        });
    }

    async getEarningsSummary(req: Request, res: Response) {
        const result = await earningService.getEarningsSummary();

        return sendSuccess(res, {
            message: "Earnings summary retrieved successfully",
            data: result,
        });
    }

    async getEarningTransactions(req: Request, res: Response) {
        const result = await earningService.getEarningTransactions();

        return sendSuccess(res,{
            message: "Earning transactions retrieved successfully",
            data: result,
        })
    }
}

export const earningController = new EarningController();