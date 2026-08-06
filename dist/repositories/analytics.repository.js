"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRepository = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
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
exports.analyticsRepository = {
    // ---------- Users ----------
    async countUsers() {
        return models_1.User.count();
    },
    async countUsersByStatus(status) {
        return models_1.User.count({ where: { status } });
    },
    async countIdentityVerifiedUsers() {
        return models_1.User.count({ where: { isIdentityVerified: true } });
    },
    async countEmailVerifiedUsers() {
        return models_1.User.count({ where: { isEmailVerified: true } });
    },
    async countUsersCreatedSince(since) {
        return models_1.User.count({ where: { createdAt: { [sequelize_1.Op.gte]: since } } });
    },
    // ---------- Equipment ----------
    async countEquipment() {
        return models_1.Equipment.count();
    },
    async countEquipmentByStatus(status) {
        return models_1.Equipment.count({ where: { status } });
    },
    async equipmentCountByCategory(limit = 10) {
        const rows = await models_1.Equipment.findAll({
            attributes: ['category', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
            group: ['category'],
            order: [[(0, sequelize_1.literal)('count'), 'DESC']],
            limit,
            raw: true,
        });
        return rows;
    },
    // ---------- Bookings ----------
    async countBookings() {
        return models_1.Booking.count();
    },
    async countBookingsByStatus(status) {
        return models_1.Booking.count({ where: { status } });
    },
    async countBookingsCreatedSince(since) {
        return models_1.Booking.count({ where: { createdAt: { [sequelize_1.Op.gte]: since } } });
    },
    // ---------- Revenue (Payments / Deposits / Refunds) ----------
    async sumSuccessfulPayments() {
        const total = await models_1.Payment.sum('amount', { where: { status: 'successful' } });
        return total ?? 0;
    },
    async sumSuccessfulPaymentsByType(type) {
        const total = await models_1.Payment.sum('amount', { where: { status: 'successful', type } });
        return total ?? 0;
    },
    async sumHeldDeposits() {
        const total = await models_1.Deposit.sum('amount', { where: { status: 'held' } });
        return total ?? 0;
    },
    async sumClaimedDeposits() {
        const total = await models_1.Deposit.sum('amount', { where: { status: 'claimed' } });
        return total ?? 0;
    },
    async sumProcessedRefunds() {
        const total = await models_1.Refund.sum('amount', { where: { status: 'processed' } });
        return total ?? 0;
    },
    // ---------- Dashboard "at a glance" counts owned by other modules ----------
    async countPendingVerifications() {
        return models_1.Verification.count({ where: { status: 'pending' } });
    },
    async countOpenDisputes() {
        return models_1.Dispute.count({ where: { status: 'open' } });
    },
    async countPendingDamageClaims() {
        return models_1.DamageClaim.count({ where: { status: 'pending' } });
    },
    async countPendingEquipmentApprovals() {
        return models_1.Equipment.count({ where: { status: 'pending_review' } });
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
    async newUsersOverTime(from, to) {
        const users = await models_1.User.findAll({
            attributes: ['id', 'createdAt'],
            where: { createdAt: { [sequelize_1.Op.between]: [from, to] } },
            raw: true,
        });
        return groupCountByDay(users, (u) => u.createdAt);
    },
    async bookingsOverTime(from, to) {
        const bookings = await models_1.Booking.findAll({
            attributes: ['id', 'createdAt'],
            where: { createdAt: { [sequelize_1.Op.between]: [from, to] } },
            raw: true,
        });
        return groupCountByDay(bookings, (b) => b.createdAt);
    },
    async revenueOverTime(from, to) {
        const payments = await models_1.Payment.findAll({
            attributes: ['amount', 'paidAt'],
            where: { status: 'successful', paidAt: { [sequelize_1.Op.between]: [from, to] } },
            raw: true,
        });
        return groupSumByDay(payments, (p) => p.paidAt, (p) => Number(p.amount));
    },
    // ---------- Cross-table join (Bookings x Equipment) ----------
    async topBookedEquipment(limit) {
        const rows = (await models_1.Booking.findAll({
            attributes: ['equipmentId', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'bookingCount']],
            group: ['equipmentId'],
            order: [[(0, sequelize_1.literal)('"bookingCount"'), 'DESC']],
            limit,
            raw: true,
        }));
        if (rows.length === 0)
            return [];
        const equipmentIds = rows.map((r) => r.equipmentId);
        const equipmentList = await models_1.Equipment.findAll({
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
function groupCountByDay(rows, getDate) {
    const map = new Map();
    for (const row of rows) {
        const day = new Date(getDate(row)).toISOString().slice(0, 10);
        map.set(day, (map.get(day) ?? 0) + 1);
    }
    return Array.from(map.entries())
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([day, count]) => ({ day, count }));
}
function groupSumByDay(rows, getDate, getValue) {
    const map = new Map();
    for (const row of rows) {
        const day = new Date(getDate(row)).toISOString().slice(0, 10);
        map.set(day, (map.get(day) ?? 0) + getValue(row));
    }
    return Array.from(map.entries())
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([day, total]) => ({ day, total }));
}
//# sourceMappingURL=analytics.repository.js.map