"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserService = void 0;
const sequelize_1 = require("sequelize");
const user_repository_1 = require("../repositories/user.repository");
const AppError_1 = require("../utils/AppError");
const userRepository = new user_repository_1.UserRepository();
exports.adminUserService = {
    async list(filters) {
        const where = {};
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.search) {
            where[sequelize_1.Op.or] = [
                { firstName: { [sequelize_1.Op.iLike]: `%${filters.search}%` } },
                { lastName: { [sequelize_1.Op.iLike]: `%${filters.search}%` } },
                { email: { [sequelize_1.Op.iLike]: `%${filters.search}%` } },
            ];
        }
        const { rows, count } = await userRepository.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: filters.limit,
            offset: (filters.page - 1) * filters.limit,
        });
        return { users: rows, total: count, page: filters.page, limit: filters.limit };
    },
    async getById(userId) {
        const user = await userRepository.findById(userId);
        if (!user)
            throw AppError_1.AppError.notFound('User not found');
        return user;
    },
    async updateStatus(userId, status) {
        const updated = await userRepository.update(userId, { status });
        if (!updated)
            throw AppError_1.AppError.notFound('User not found');
        return updated;
    },
    /**
     * ASSUMPTION (flagged per the earlier discussion with James): this is a
     * blunt admin override on User.isIdentityVerified — independent of the
     * Identity Verification module's document-review flow
     * (/admin/verifications/:id/approve, which approves a specific submitted
     * Verification record).
     *
     * TODO (coordinate with James): once his approve endpoint is built, it
     * should probably also set isIdentityVerified/identityVerifiedAt on the
     * User so the two stay in sync. Not wired up here — don't build his
     * module's logic from this file, just flag it.
     */
    async verify(userId) {
        const user = await userRepository.findById(userId);
        if (!user)
            throw AppError_1.AppError.notFound('User not found');
        if (user.isIdentityVerified) {
            throw AppError_1.AppError.conflict('User is already identity-verified');
        }
        return userRepository.update(userId, {
            isIdentityVerified: true,
            identityVerifiedAt: new Date(),
        });
    },
    async delete(userId) {
        // Soft delete — preserves FK integrity with bookings/reviews/payments/etc.
        const updated = await userRepository.update(userId, { status: 'deleted' });
        if (!updated)
            throw AppError_1.AppError.notFound('User not found');
    },
};
//# sourceMappingURL=adminUser.service.js.map