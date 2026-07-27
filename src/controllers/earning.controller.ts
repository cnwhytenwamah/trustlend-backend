import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { earningService } from "../services/earning.service";
import { AppError } from "../utils/AppError";

class EarningController {
    async getEarnings(req: Request, res: Response) {
        if (!req.user) {
            throw AppError.unauthorized("Authentication required");
        }

        const result = await earningService.getEarnings(
            req.user.userId
        );

        return sendSuccess(res, {
            message: "Earnings retrieved successfully",
            data: result,
        });
    }

    async getEarningsSummary(req: Request, res: Response) {
    if (!req.user) {
        throw AppError.unauthorized("Authentication required");
    }

    const result = await earningService.getEarningsSummary(
        req.user.userId
    );

    return sendSuccess(res, {
        message: "Earnings summary retrieved successfully",
        data: result,
    });
}

    async getEarningTransactions(req: Request, res: Response) {
    if (!req.user) {
        throw AppError.unauthorized("Authentication required");
    }

    const result = await earningService.getEarningTransactions(
        req.user.userId
    );

    return sendSuccess(res, {
        message: "Earning transactions retrieved successfully",
        data: result,
    });
}
}

export const earningController = new EarningController();