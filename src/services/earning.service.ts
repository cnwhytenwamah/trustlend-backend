import { EarningRepository } from "../repositories/earning.repository";
import { TransactionRepository } from "../repositories/transaction.repository";

const earningRepository = new EarningRepository();
const transactionRepository = new TransactionRepository();

class EarningService {
  async getEarnings(ownerId: string, page: number, limit: number) {
    const { rows, count } = await earningRepository.findByOwnerId(ownerId, limit, (page - 1) * limit);
    return { earnings: rows, total: count, page, limit };
  }

  async getEarningsSummary(ownerId: string) {
    const [pending, available, paidOut, lifetimeGross, lifetimeNet] = await Promise.all([
      earningRepository.sumByOwnerAndStatus(ownerId, "pending"),
      earningRepository.sumByOwnerAndStatus(ownerId, "available"),
      earningRepository.sumByOwnerAndStatus(ownerId, "paid_out"),
      earningRepository.sumGrossByOwner(ownerId),
      earningRepository.sumNetByOwner(ownerId),
    ]);

    return {
      pendingBalance: pending,
      availableBalance: available,
      paidOutTotal: paidOut,
      lifetimeGross,
      lifetimeNet,
      currency: "NGN",
    };
  }

  async getEarningTransactions(ownerId: string, page: number, limit: number) {
    // Reuses TransactionRepository.findByUserId — written but never
    // wired up anywhere before this. Gives a full audit trail (rental
    // payments, deposit holds/releases/refunds, payouts) for this owner,
    // not just the Earning summary rows.
    const { rows, count } = await transactionRepository.findAndCountByUserId(
      ownerId,
      limit,
      (page - 1) * limit,
    );
    return { transactions: rows, total: count, page, limit };
  }
}

export const earningService = new EarningService();
