import { DepositRepository } from '../repositories/deposit.repository';
import { DamageClaimRepository } from '../repositories/damageClaim.repository';
import { RefundRepository } from '../repositories/refund.repository';
import { Deposit } from '../models/deposit.model';
import { Booking } from '../models/booking.model';
import { AppError } from '../utils/AppError';

const depositRepository = new DepositRepository();
const damageClaimRepository = new DamageClaimRepository();
const refundRepository = new RefundRepository();

type DepositWithBooking = Deposit & { booking?: Booking };

async function loadDepositWithBooking(depositId: string): Promise<{
  deposit: DepositWithBooking;
  booking: Booking;
}> {
  const deposit = (await depositRepository.findById(depositId, {
    include: [{ association: 'booking' }],
  })) as DepositWithBooking | null;

  if (!deposit) throw AppError.notFound('Deposit not found');
  if (!deposit.booking) throw AppError.notFound('Related booking not found');

  return { deposit, booking: deposit.booking };
}

export const depositService = {
  async myDeposits(userId: string, page: number, limit: number) {
    const { rows, count } = await depositRepository.findAndCountAll({
      include: [{ association: 'booking', where: { renterId: userId }, attributes: [] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });
    return { deposits: rows, total: count, page, limit };
  },

  async getById(userId: string, depositId: string) {
    const { deposit, booking } = await loadDepositWithBooking(depositId);
    if (booking.renterId !== userId && booking.ownerId !== userId) {
      throw AppError.forbidden('You do not have access to this deposit');
    }
    return deposit;
  },

  /**
   * Admin-only manual (re-)hold. Mainly useful to lock a deposit while a
   * dispute or damage claim is being investigated, e.g. if a release was
   * requested but shouldn't complete yet.
   * ASSUMPTION (flag if the team wants this differently): a deposit that
   * has already been released or refunded can't be re-held — at that
   * point the money has already moved.
   */
  async hold(depositId: string) {
    const { deposit } = await loadDepositWithBooking(depositId);
    if (deposit.status === 'released' || deposit.status === 'refunded') {
      throw AppError.badRequest(`Cannot re-hold a deposit that is already "${deposit.status}"`);
    }
    return depositRepository.update(deposit.id, {
      status: 'held',
      heldAt: new Date(),
    } as never);
  },

  /**
   * Normal end-of-rental path: the equipment owner (or an admin) confirms
   * there's no damage and the deposit should go back to the renter.
   * ASSUMPTION (flag if wrong — not fully spec'd yet, see README):
   * requires booking.status === 'completed' and no open (pending) damage
   * claim against the booking.
   */
  async release(userId: string, userRole: string, depositId: string) {
    const { deposit, booking } = await loadDepositWithBooking(depositId);

    if (userRole !== 'admin' && booking.ownerId !== userId) {
      throw AppError.forbidden('Only the equipment owner or an admin can release this deposit');
    }
    if (deposit.status !== 'held') {
      throw AppError.badRequest(`Cannot release a deposit that is "${deposit.status}"`);
    }
    if (booking.status !== 'completed') {
      throw AppError.badRequest('The booking must be completed before its deposit can be released');
    }

    const openClaim = await damageClaimRepository.findOne({
      bookingId: booking.id,
      status: 'pending',
    });
    if (openClaim) {
      throw AppError.conflict('An open damage claim exists for this booking — resolve it first');
    }

    await depositRepository.update(deposit.id, {
      status: 'released',
      releasedAt: new Date(),
    } as never);

    // Actually returning the money runs through the existing Refunds
    // pipeline (an admin approves it at /admin/refunds/:id/process)
    // rather than duplicating a Paystack call here.
    return refundRepository.create({
      paymentId: deposit.paymentId,
      amount: deposit.amount,
      reason: 'Deposit released after booking completion',
      status: 'pending',
    } as never);
  },

  /**
   * Admin-only explicit refund path, for cases outside the normal release
   * flow (e.g. a cancelled booking that never reached "completed").
   * ASSUMPTION: only usable while the deposit is still "held".
   */
  async refund(depositId: string, reason: string) {
    const { deposit } = await loadDepositWithBooking(depositId);
    if (deposit.status !== 'held') {
      throw AppError.badRequest(`Cannot refund a deposit that is "${deposit.status}"`);
    }

    await depositRepository.update(deposit.id, {
      status: 'refunded',
      refundedAt: new Date(),
    } as never);

    return refundRepository.create({
      paymentId: deposit.paymentId,
      amount: deposit.amount,
      reason,
      status: 'pending',
    } as never);
  },
};
