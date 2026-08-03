import { DamageClaimRepository } from '../repositories/damageClaim.repository';
import { BookingRepository } from '../repositories/booking.repository';
import { DepositRepository } from '../repositories/deposit.repository';
import { EarningRepository } from '../repositories/earning.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { AppError } from '../utils/AppError';
import cloudinary from '../config/cloudinary';

const damageClaimRepository = new DamageClaimRepository();
const bookingRepository = new BookingRepository();
const depositRepository = new DepositRepository();
const earningRepository = new EarningRepository();
const transactionRepository = new TransactionRepository();

async function uploadEvidencePhotos(files: Express.Multer.File[]): Promise<string[]> {
  const uploads = files.map(
    (file) =>
      new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'trustlend/damage-claims', resource_type: 'image' },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          },
        );
        stream.end(file.buffer);
      }),
  );
  return Promise.all(uploads);
}

export const damageClaimService = {
  /**
   * ASSUMPTION (flag if wrong — not fully spec'd yet, see README): only
   * the equipment owner on a booking can file a claim, and only once
   * that booking has reached "completed" (i.e. the item was returned).
   */
  async create(
    userId: string,
    input: { bookingId: string; description: string; amountClaimed: number },
    files: Express.Multer.File[],
  ) {
    const booking = await bookingRepository.findById(input.bookingId);
    if (!booking) throw AppError.notFound('Booking not found');

    if (booking.ownerId !== userId) {
      throw AppError.forbidden('Only the equipment owner can file a damage claim on this booking');
    }
    if (booking.status !== 'completed') {
      throw AppError.badRequest('A damage claim can only be filed after the booking is completed');
    }

    const existing = await damageClaimRepository.findOne({
      bookingId: booking.id,
      status: 'pending',
    });
    if (existing) {
      throw AppError.conflict('A pending damage claim already exists for this booking');
    }

    const evidencePhotoUrls = files.length ? await uploadEvidencePhotos(files) : [];

    return damageClaimRepository.create({
      bookingId: booking.id,
      claimantId: userId,
      description: input.description,
      amountClaimed: input.amountClaimed,
      evidencePhotoUrls,
      status: 'pending',
    } as never);
  },

  async myClaims(userId: string, page: number, limit: number) {
    const { rows, count } = await damageClaimRepository.findAndCountAll({
      where: { claimantId: userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });
    return { claims: rows, total: count, page, limit };
  },

  async adminList(filters: { status?: string; page: number; limit: number }) {
    const { rows, count } = await damageClaimRepository.findAndCountAll({
      where: filters.status ? { status: filters.status } : {},
      order: [['createdAt', 'DESC']],
      limit: filters.limit,
      offset: (filters.page - 1) * filters.limit,
    });
    return { claims: rows, total: count, page: filters.page, limit: filters.limit };
  },

  /**
   * ASSUMPTION: approving a claim allocates the ENTIRE held deposit to
   * the claim (no partial-split logic yet — flag if the real spec needs
   * "claim $X of a $Y deposit, refund the remainder to the renter").
   * No platform fee applies to a damage payout — the owner is being made
   * whole for actual damage, not earning rental revenue on it.
   */
  async approve(claimId: string) {
    const claim = await damageClaimRepository.findById(claimId);
    if (!claim) throw AppError.notFound('Damage claim not found');
    if (claim.status !== 'pending') {
      throw AppError.badRequest(`Cannot approve a claim that is already "${claim.status}"`);
    }

    const deposit = await depositRepository.findOne({ bookingId: claim.bookingId });
    if (!deposit) {
      throw AppError.conflict('No deposit exists for this booking — cannot allocate a claim payout');
    }
    if (deposit.status !== 'held') {
      throw AppError.badRequest(`Cannot approve this claim — the deposit is already "${deposit.status}"`);
    }

    await damageClaimRepository.update(claim.id, { status: 'approved' } as never);
    await depositRepository.update(deposit.id, { status: 'claimed' } as never);

    const claimedAmount = Number(claim.amountClaimed);

    await earningRepository.create({
      ownerId: claim.claimantId,
      bookingId: claim.bookingId,
      grossAmount: claimedAmount,
      platformFee: 0,
      netAmount: claimedAmount,
      status: 'available', // the claim decision IS the final determination — no further hold needed
    } as never);

    await transactionRepository.create({
      userId: claim.claimantId,
      type: 'payout',
      amount: claimedAmount,
      reference: `damage-claim-${claim.id}-payout`,
      status: 'pending', // becomes "successful" once an actual payout mechanism exists
      relatedBookingId: claim.bookingId,
    } as never);

    return damageClaimRepository.findById(claim.id);
  },

  async reject(claimId: string, rejectionReason: string) {
    const claim = await damageClaimRepository.findById(claimId);
    if (!claim) throw AppError.notFound('Damage claim not found');
    if (claim.status !== 'pending') {
      throw AppError.badRequest(`Cannot reject a claim that is already "${claim.status}"`);
    }

    const updated = await damageClaimRepository.update(claim.id, {
      status: 'rejected',
      rejectionReason,
    } as never);

    // No damage confirmed — safe to release the owner's rental earnings
    // for this booking, same trigger as deposit.service.ts's release().
    const pendingEarning = await earningRepository.findPendingByBookingId(claim.bookingId);
    if (pendingEarning) {
      await earningRepository.update(pendingEarning.id, { status: 'available' } as never);
    }

    return updated;
  },
};
