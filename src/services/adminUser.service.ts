import { Op } from 'sequelize';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';

const userRepository = new UserRepository();

export const adminUserService = {
  async list(filters: { status?: string; search?: string; page: number; limit: number }) {
    const where: Record<string, unknown> = {};

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.search) {
      where[Op.or as unknown as string] = [
        { firstName: { [Op.iLike]: `%${filters.search}%` } },
        { lastName: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } },
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

  async getById(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');
    return user;
  },

  async updateStatus(userId: string, status: 'active' | 'suspended' | 'deleted') {
    const updated = await userRepository.update(userId, { status } as never);
    if (!updated) throw AppError.notFound('User not found');
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
  async verify(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');

    if (user.isIdentityVerified) {
      throw AppError.conflict('User is already identity-verified');
    }

    return userRepository.update(userId, {
      isIdentityVerified: true,
      identityVerifiedAt: new Date(),
    } as never);
  },

  async delete(userId: string) {
    // Soft delete — preserves FK integrity with bookings/reviews/payments/etc.
    const updated = await userRepository.update(userId, { status: 'deleted' } as never);
    if (!updated) throw AppError.notFound('User not found');
  },
};
