"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const transaction_service_1 = require("../services/transaction.service");
class TransactionController {
    async getMyTransactions(req, res) {
        const result = await transaction_service_1.transactionService.getMyTransactions(req);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Transactions retrieved successfully",
            data: result,
        });
    }
    async getAllTransactions(req, res) {
        const result = await transaction_service_1.transactionService.getAllTransactions();
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "All transactions retrieved successfully",
            data: result,
        });
    }
    async getTransactionById(req, res) {
        const result = await transaction_service_1.transactionService.getTransactionById(req.params.id);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: "Transaction retrieved successfully",
            data: result,
        });
    }
}
exports.transactionController = new TransactionController();
//# sourceMappingURL=transaction.controller.js.map