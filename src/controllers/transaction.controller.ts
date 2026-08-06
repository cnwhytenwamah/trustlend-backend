import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { transactionService } from "../services/transaction.service";

class TransactionController {
    async getMyTransactions(req: Request, res: Response) {
        const { page, limit } = req.query as unknown as { page: number; limit: number };
        const result = await transactionService.getMyTransactions(req.user!.userId, page, limit);

        return sendSuccess(res, {
            message: "Transactions retrieved successfully",
            data: result.transactions,
            meta: { page: result.page, limit: result.limit, total: result.total },
        });
    }

    async getAllTransactions(req: Request, res: Response) {
        const { page, limit } = req.query as unknown as { page: number; limit: number };
        const result = await transactionService.getAllTransactions(page, limit);

        return sendSuccess(res, {
            message: "All transactions retrieved successfully",
            data: result.transactions,
            meta: { page: result.page, limit: result.limit, total: result.total },
        });
    }

    async getTransactionById(req: Request, res: Response) {
        const result = await transactionService.getTransactionById(req.params.id as string);

        return sendSuccess(res, {
            message: "Transaction retrieved successfully",
            data: result,
        });
    }
}

export const transactionController = new TransactionController();
