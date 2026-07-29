import { Op, fn, col, literal } from 'sequelize';
import {
  User,
  Equipment,
  Booking,
  Payment,
  Deposit,
  Refund,
  Verification,
  Dispute,
  DamageClaim,
} from '../models';

/**
 * Analytics doesn't belong to a single entity the way every other
 * repository does — it reads across nearly every table in the system.
 * Rather than bolt aggregate methods onto everyone else's
 * <entity>.repository.ts (risking merge conflicts on files they own),
 * all cross-cutting reporting queries live here in one place.
 *
 * Every method here is read-only. If a query needs data from a table
 * another module owns, that's expected and fine — just don't WRITE to
 * another domain's table from this file.
 */
export const analyticsRepository = {
  // ---------- Users ----------
  async countUsers(): Promise<number> {
    return User.count();
  },
  async countUsersByStatus(status: string): Promise<number> {
    return User.count({ where: { status } });
  },
  async countIdentityVerifiedUsers(): Promise<number> {
    return User.count({ where: { isIdentityVerified: true } });
  },
  async countEmailVerifiedUsers(): Promise<number> {
    return User.count({ where: { isEmailVerified: true } });
  },
  async countUsersCreatedSince(since: Date): Promise<number> {
    return User.count({ where: { createdAt: { [Op.gte]: since } } });
  },

  // ---------- Equipment ----------
  async countEquipment(): Promise<number> {
    return Equipment.count();
  },
  async countEquipmentByStatus(status: string): Promise<number> {
    return Equipment.count({ where: { status } });
  },
  async equipmentCountByCategory(limit = 10): Promise<Array<{ category: string; count: number }>> {
    const rows = await Equipment.findAll({
      attributes: ['category', [fn('COUNT', col('id')), 'count']],
      group: ['category'],
      order: [[literal('count'), 'DESC']],
      limit,
      raw: true,
    });
    return rows as unknown as Array<{ category: string; count: number }>;
  },

  // ---------- Bookings ----------
  async countBookings(): Promise<number> {
    return Booking.count();
  },
  async countBookingsByStatus(status: string): Promise<number> {
    return Booking.count({ where: { status } });
  },
  async countBookingsCreatedSince(since: Date): Promise<number> {
    return Booking.count({ where: { createdAt: { [Op.gte]: since } } });
  },

  // ---------- Revenue (Payments / Deposits / Refunds) ----------
  async sumSuccessfulPayments(): Promise<number> {
    const total = await Payment.sum('amount', { where: { status: 'successful' } });
    return total ?? 0;
  },
  async sumSuccessfulPaymentsByType(type: string): Promise<number> {
    const total = await Payment.sum('amount', { where: { status: 'successful', type } });
    return total ?? 0;
  },
  async sumHeldDeposits(): Promise<number> {
    const total = await Deposit.sum('amount', { where: { status: 'held' } });
    return total ?? 0;
  },
  async sumClaimedDeposits(): Promise<number> {
    const total = await Deposit.sum('amount', { where: { status: 'claimed' } });
    return total ?? 0;
  },
  async sumProcessedRefunds(): Promise<number> {
    const total = await Refund.sum('amount', { where: { status: 'processed' } });
    return total ?? 0;
  },

  // ---------- Dashboard "at a glance" counts owned by other modules ----------
  async countPendingVerifications(): Promise<number> {
    return Verification.count({ where: { status: 'pending' } });
  },
  async countOpenDisputes(): Promise<number> {
    return Dispute.count({ where: { status: 'open' } });
  },
  async countPendingDamageClaims(): Promise<number> {
    return DamageClaim.count({ where: { status: 'pending' } });
  },
  async countPendingEquipmentApprovals(): Promise<number> {
    return Equipment.count({ where: { status: 'pending_review' } });
  },

  // ---------- Time series (grouped in JS, not SQL — see note below) ----------
  /**
   * These three intentionally group day-buckets in JS rather than with a
   * SQL date_trunc/GROUP BY. Because the DB uses underscored column names
   * (created_at, paid_at) while the JS attributes are camelCase, raw
   * fn()/col() combinations referencing those columns are easy to get
   * subtly wrong across environments. For MVP data volumes, fetching the
   * raw rows and bucketing by day in JS is simpler and safer than
   * debugging a mismatched column name in production.
   */
  async newUsersOverTime(from: Date, to: Date): Promise<Array<{ day: string; count: number }>> {
    const users = await User.findAll({
      attributes: ['id', 'createdAt'],
      where: { createdAt: { [Op.between]: [from, to] } },
      raw: true,
    });
    return groupCountByDay(users as unknown as Array<{ createdAt: Date }>, (u) => u.createdAt);
  },

  async bookingsOverTime(from: Date, to: Date): Promise<Array<{ day: string; count: number }>> {
    const bookings = await Booking.findAll({
      attributes: ['id', 'createdAt'],
      where: { createdAt: { [Op.between]: [from, to] } },
      raw: true,
    });
    return groupCountByDay(bookings as unknown as Array<{ createdAt: Date }>, (b) => b.createdAt);
  },

  async revenueOverTime(from: Date, to: Date): Promise<Array<{ day: string; total: number }>> {
    const payments = await Payment.findAll({
      attributes: ['amount', 'paidAt'],
      where: { status: 'successful', paidAt: { [Op.between]: [from, to] } },
      raw: true,
    });
    return groupSumByDay(
      payments as unknown as Array<{ amount: string; paidAt: Date }>,
      (p) => p.paidAt,
      (p) => Number(p.amount),
    );
  },

  // ---------- Cross-table join (Bookings x Equipment) ----------
  async topBookedEquipment(
    limit: number,
  ): Promise<Array<{ equipmentId: string; title: string; category: string; bookingCount: number }>> {
    const rows = (await Booking.findAll({
      attributes: ['equipmentId', [fn('COUNT', col('id')), 'bookingCount']],
      group: ['equipmentId'],
      order: [[literal('"bookingCount"'), 'DESC']],
      limit,
      raw: true,
    })) as unknown as Array<{ equipmentId: string; bookingCount: string }>;

    if (rows.length === 0) return [];

    const equipmentIds = rows.map((r) => r.equipmentId);
    const equipmentList = await Equipment.findAll({
      where: { id: equipmentIds },
      attributes: ['id', 'title', 'category'],
      raw: true,
    });
    const equipmentById = new Map(equipmentList.map((e) => [e.id, e]));

    return rows.map((r) => {
      const equipment = equipmentById.get(r.equipmentId);
      return {
        equipmentId: r.equipmentId,
        title: equipment?.title ?? 'Unknown equipment',
        category: equipment?.category ?? 'unknown',
        bookingCount: Number(r.bookingCount),
      };
    });
  },
};

function groupCountByDay<T>(rows: T[], getDate: (row: T) => Date): Array<{ day: string; count: number }> {
  const map = new Map<string, number>();
  for (const row of rows) {
    const day = new Date(getDate(row)).toISOString().slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([day, count]) => ({ day, count }));
}

function groupSumByDay<T>(
  rows: T[],
  getDate: (row: T) => Date,
  getValue: (row: T) => number,
): Array<{ day: string; total: number }> {
  const map = new Map<string, number>();
  for (const row of rows) {
    const day = new Date(getDate(row)).toISOString().slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + getValue(row));
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([day, total]) => ({ day, total }));
}
