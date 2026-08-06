import { analyticsRepository } from '../repositories/analytics.repository';

const DEFAULT_RANGE_DAYS = 30;

function resolveRange(from?: Date, to?: Date): { from: Date; to: Date } {
  const resolvedTo = to ?? new Date();
  const resolvedFrom = from ?? new Date(resolvedTo.getTime() - DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000);
  return { from: resolvedFrom, to: resolvedTo };
}

export const analyticsService = {
  /**
   * High-level counts an admin would want at a glance. Deliberately kept
   * cheap (counts, not time series) since this is likely the first thing
   * that loads on the admin dashboard.
   */
  async dashboard() {
    const [
      totalUsers,
      activeUsers,
      totalEquipment,
      activeEquipment,
      pendingEquipmentApprovals,
      totalBookings,
      inProgressBookings,
      completedBookings,
      totalRevenue,
      heldDeposits,
      pendingVerifications,
      openDisputes,
      pendingDamageClaims,
    ] = await Promise.all([
      analyticsRepository.countUsers(),
      analyticsRepository.countUsersByStatus('active'),
      analyticsRepository.countEquipment(),
      analyticsRepository.countEquipmentByStatus('active'),
      analyticsRepository.countPendingEquipmentApprovals(),
      analyticsRepository.countBookings(),
      analyticsRepository.countBookingsByStatus('in_progress'),
      analyticsRepository.countBookingsByStatus('completed'),
      analyticsRepository.sumSuccessfulPayments(),
      analyticsRepository.sumHeldDeposits(),
      analyticsRepository.countPendingVerifications(),
      analyticsRepository.countOpenDisputes(),
      analyticsRepository.countPendingDamageClaims(),
    ]);

    return {
      users: { total: totalUsers, active: activeUsers },
      equipment: {
        total: totalEquipment,
        active: activeEquipment,
        pendingApproval: pendingEquipmentApprovals,
      },
      bookings: { total: totalBookings, inProgress: inProgressBookings, completed: completedBookings },
      revenue: { totalCollected: totalRevenue, depositsHeld: heldDeposits },
      // "Needs attention" items owned by other modules — surfaced here for
      // convenience, not editable from Analytics.
      pendingActions: {
        verifications: pendingVerifications,
        disputes: openDisputes,
        damageClaims: pendingDamageClaims,
      },
    };
  },

  async revenue(fromInput?: Date, toInput?: Date) {
    const { from, to } = resolveRange(fromInput, toInput);

    const [totalRental, totalDeposit, totalRentalAndDeposit, dailySeries] = await Promise.all([
      analyticsRepository.sumSuccessfulPaymentsByType('rental'),
      analyticsRepository.sumSuccessfulPaymentsByType('deposit'),
      analyticsRepository.sumSuccessfulPaymentsByType('rental_and_deposit'),
      analyticsRepository.revenueOverTime(from, to),
    ]);

    return {
      range: { from, to },
      totalsByType: {
        rental: totalRental,
        deposit: totalDeposit,
        rentalAndDeposit: totalRentalAndDeposit,
      },
      grandTotal: totalRental + totalDeposit + totalRentalAndDeposit,
      dailySeries,
    };
  },

  async bookings(fromInput?: Date, toInput?: Date) {
    const { from, to } = resolveRange(fromInput, toInput);

    const statuses = ['pending', 'accepted', 'declined', 'cancelled', 'in_progress', 'completed'] as const;
    const [countsByStatus, dailySeries, total] = await Promise.all([
      Promise.all(statuses.map((status) => analyticsRepository.countBookingsByStatus(status))),
      analyticsRepository.bookingsOverTime(from, to),
      analyticsRepository.countBookings(),
    ]);

    const byStatus = Object.fromEntries(statuses.map((status, i) => [status, countsByStatus[i]]));

    return { range: { from, to }, total, byStatus, dailySeries };
  },

  async users(fromInput?: Date, toInput?: Date) {
    const { from, to } = resolveRange(fromInput, toInput);

    const [total, active, suspended, deleted, identityVerified, emailVerified, dailySeries] =
      await Promise.all([
        analyticsRepository.countUsers(),
        analyticsRepository.countUsersByStatus('active'),
        analyticsRepository.countUsersByStatus('suspended'),
        analyticsRepository.countUsersByStatus('deleted'),
        analyticsRepository.countIdentityVerifiedUsers(),
        analyticsRepository.countEmailVerifiedUsers(),
        analyticsRepository.newUsersOverTime(from, to),
      ]);

    return {
      range: { from, to },
      total,
      byStatus: { active, suspended, deleted },
      verification: { identityVerified, emailVerified },
      newSignupsDailySeries: dailySeries,
    };
  },

  async equipment(topLimit: number) {
    const [total, byStatusEntries, byCategory, topBooked] = await Promise.all([
      analyticsRepository.countEquipment(),
      Promise.all(
        (['draft', 'pending_review', 'approved', 'rejected', 'active', 'inactive'] as const).map(
          async (status) => [status, await analyticsRepository.countEquipmentByStatus(status)] as const,
        ),
      ),
      analyticsRepository.equipmentCountByCategory(10),
      analyticsRepository.topBookedEquipment(topLimit),
    ]);

    return {
      total,
      byStatus: Object.fromEntries(byStatusEntries),
      byCategory,
      topBooked,
    };
  },
};
