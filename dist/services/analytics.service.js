"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = void 0;
const analytics_repository_1 = require("../repositories/analytics.repository");
const DEFAULT_RANGE_DAYS = 30;
function resolveRange(from, to) {
    const resolvedTo = to ?? new Date();
    const resolvedFrom = from ?? new Date(resolvedTo.getTime() - DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000);
    return { from: resolvedFrom, to: resolvedTo };
}
exports.analyticsService = {
    /**
     * High-level counts an admin would want at a glance. Deliberately kept
     * cheap (counts, not time series) since this is likely the first thing
     * that loads on the admin dashboard.
     */
    async dashboard() {
        const [totalUsers, activeUsers, totalEquipment, activeEquipment, pendingEquipmentApprovals, totalBookings, inProgressBookings, completedBookings, totalRevenue, heldDeposits, pendingVerifications, openDisputes, pendingDamageClaims,] = await Promise.all([
            analytics_repository_1.analyticsRepository.countUsers(),
            analytics_repository_1.analyticsRepository.countUsersByStatus('active'),
            analytics_repository_1.analyticsRepository.countEquipment(),
            analytics_repository_1.analyticsRepository.countEquipmentByStatus('active'),
            analytics_repository_1.analyticsRepository.countPendingEquipmentApprovals(),
            analytics_repository_1.analyticsRepository.countBookings(),
            analytics_repository_1.analyticsRepository.countBookingsByStatus('in_progress'),
            analytics_repository_1.analyticsRepository.countBookingsByStatus('completed'),
            analytics_repository_1.analyticsRepository.sumSuccessfulPayments(),
            analytics_repository_1.analyticsRepository.sumHeldDeposits(),
            analytics_repository_1.analyticsRepository.countPendingVerifications(),
            analytics_repository_1.analyticsRepository.countOpenDisputes(),
            analytics_repository_1.analyticsRepository.countPendingDamageClaims(),
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
    async revenue(fromInput, toInput) {
        const { from, to } = resolveRange(fromInput, toInput);
        const [totalRental, totalDeposit, totalRentalAndDeposit, dailySeries] = await Promise.all([
            analytics_repository_1.analyticsRepository.sumSuccessfulPaymentsByType('rental'),
            analytics_repository_1.analyticsRepository.sumSuccessfulPaymentsByType('deposit'),
            analytics_repository_1.analyticsRepository.sumSuccessfulPaymentsByType('rental_and_deposit'),
            analytics_repository_1.analyticsRepository.revenueOverTime(from, to),
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
    async bookings(fromInput, toInput) {
        const { from, to } = resolveRange(fromInput, toInput);
        const statuses = ['pending', 'accepted', 'declined', 'cancelled', 'in_progress', 'completed'];
        const [countsByStatus, dailySeries, total] = await Promise.all([
            Promise.all(statuses.map((status) => analytics_repository_1.analyticsRepository.countBookingsByStatus(status))),
            analytics_repository_1.analyticsRepository.bookingsOverTime(from, to),
            analytics_repository_1.analyticsRepository.countBookings(),
        ]);
        const byStatus = Object.fromEntries(statuses.map((status, i) => [status, countsByStatus[i]]));
        return { range: { from, to }, total, byStatus, dailySeries };
    },
    async users(fromInput, toInput) {
        const { from, to } = resolveRange(fromInput, toInput);
        const [total, active, suspended, deleted, identityVerified, emailVerified, dailySeries] = await Promise.all([
            analytics_repository_1.analyticsRepository.countUsers(),
            analytics_repository_1.analyticsRepository.countUsersByStatus('active'),
            analytics_repository_1.analyticsRepository.countUsersByStatus('suspended'),
            analytics_repository_1.analyticsRepository.countUsersByStatus('deleted'),
            analytics_repository_1.analyticsRepository.countIdentityVerifiedUsers(),
            analytics_repository_1.analyticsRepository.countEmailVerifiedUsers(),
            analytics_repository_1.analyticsRepository.newUsersOverTime(from, to),
        ]);
        return {
            range: { from, to },
            total,
            byStatus: { active, suspended, deleted },
            verification: { identityVerified, emailVerified },
            newSignupsDailySeries: dailySeries,
        };
    },
    async equipment(topLimit) {
        const [total, byStatusEntries, byCategory, topBooked] = await Promise.all([
            analytics_repository_1.analyticsRepository.countEquipment(),
            Promise.all(['draft', 'pending_review', 'approved', 'rejected', 'active', 'inactive'].map(async (status) => [status, await analytics_repository_1.analyticsRepository.countEquipmentByStatus(status)])),
            analytics_repository_1.analyticsRepository.equipmentCountByCategory(10),
            analytics_repository_1.analyticsRepository.topBookedEquipment(topLimit),
        ]);
        return {
            total,
            byStatus: Object.fromEntries(byStatusEntries),
            byCategory,
            topBooked,
        };
    },
};
//# sourceMappingURL=analytics.service.js.map