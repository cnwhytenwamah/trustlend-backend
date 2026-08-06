import { TransactionRepository } from "../repositories/transaction.repository";
import { AppError } from "../utils/AppError";

const transactionRepository = new TransactionRepository();

class TransactionService {
  async getMyTransactions(userId: string, page: number, limit: number) {
    const { rows, count } = await transactionRepository.findAndCountByUserId(
      userId,
      limit,
      (page - 1) * limit,
    );
    return { transactions: rows, total: count, page, limit };
  }

  async getAllTransactions(page: number, limit: number) {
    const { rows, count } = await transactionRepository.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });
    return { transactions: rows, total: count, page, limit };
  }

  async getTransactionById(id: string) {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) throw AppError.notFound("Transaction not found");
    return transaction;
  }
}

export const transactionService = new TransactionService();
