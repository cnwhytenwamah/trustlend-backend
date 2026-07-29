class TransactionService {
    async getMyTransactions(req: any) {
        return [];
    }

    async getAllTransactions() {
        return[];
    }

    async getTransactionById(id: string) {
        return null;
    }
}

export const transactionService = new TransactionService();
