import { TransactionRepository } from "../repositories/transaction.repository";

const transactionRespository = new TransactionRepository();

class TransactionService {
    async getMyTransactions(userId: string) {
        return transactionRespository.findByUserId(userId) ;
    }

    async getAllTransactions() {
        return[];
    }

    async getTransactionById(id: string) {
        return null;
    }
}

export const transactionService = new TransactionService();
