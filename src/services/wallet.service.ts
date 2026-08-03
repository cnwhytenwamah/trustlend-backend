import { EarningRepository } from '../repositories/earning.repository';
import { TransactionRepository } from '../repositories/transaction.repository';

const earningRepository = new EarningRepository();
const transactionRepository = new TransactionRepository();

/**
 * Wallet isn't its own database table — deliberately. It's a read view
 * composed from two ledgers that already exist and are the actual
 * sources of truth: Earning (for the balance itself, since that's the
 * one thing with a real "pending vs available" state machine) and
 * Transaction (for the full activity feed, since that's the only table
 * that captures BOTH directions of money movement for a user — what
 * they've paid out as a renter, and what they've earned as an owner).
 *
 * A separate persisted Wallet.balance column would risk drifting out of
 * sync with these two ledgers over time; computing it live avoids that
 * entirely at MVP scale.
 *
 * NOT included yet: an actual "withdraw to bank account" flow. That
 * needs a real payout mechanism (e.g. Paystack Transfers) and isn't in
 * the current endpoint spec — this is a read-only balance + history view
 * for now, which is what the Figma screens need to be built against.
 */
export const walletService = {
  async getBalance(userId: string) {
    const [pendingBalance, availableBalance, paidOutTotal, lifetimeGross, lifetimeNet] = await Promise.all([
      earningRepository.sumByOwnerAndStatus(userId, 'pending'),
      earningRepository.sumByOwnerAndStatus(userId, 'available'),
      earningRepository.sumByOwnerAndStatus(userId, 'paid_out'),
      earningRepository.sumGrossByOwner(userId),
      earningRepository.sumNetByOwner(userId),
    ]);

    return {
      pendingBalance,
      availableBalance,
      paidOutTotal,
      lifetimeGross,
      lifetimeNet,
      currency: 'NGN',
    };
  },

  async getTransactions(userId: string, type: string | undefined, page: number, limit: number) {
    const { rows, count } = await transactionRepository.findAndCountByUserId(
      userId,
      limit,
      (page - 1) * limit,
      type,
    );
    return { transactions: rows, total: count, page, limit };
  },
};
