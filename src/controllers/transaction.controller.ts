import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { transactionService } from "../services/transaction.service";

class TransactionController {
    async getMyTransactions(req: Request, res: Response) {
        const result = await transactionService.getMyTransactions(req);

        return sendSuccess(res, {
            message: "Transactions retrieved successfully",
            data: result,
        });
    }

    async getAllTransactions(req: Request, res: Response) {
        const result = await transactionService.getAllTransactions();

        return sendSuccess(res, {
            message: "All transactions retrieved successfully",
            data: result,
        });
    }
    async getTransactionById(req: Request, res: Response) {
        const result = await transactionService.getTransactionById(req.params.id as string);

        return sendSuccess(res,{
            message: "Transaction retrieved successfully",
            data: result,
        });
    }
}

export const transactionController = new TransactionController();