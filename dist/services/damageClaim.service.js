"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.damageClaimService = void 0;
const damageClaim_repository_1 = require("../repositories/damageClaim.repository");
const booking_repository_1 = require("../repositories/booking.repository");
const deposit_repository_1 = require("../repositories/deposit.repository");
const AppError_1 = require("../utils/AppError");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const damageClaimRepository = new damageClaim_repository_1.DamageClaimRepository();
const bookingRepository = new booking_repository_1.BookingRepository();
const depositRepository = new deposit_repository_1.DepositRepository();
async function uploadEvidencePhotos(files) {
    const uploads = files.map((file) => new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.uploader.upload_stream({ folder: 'trustlend/damage-claims', resource_type: 'image' }, (error, result) => {
            if (error || !result)
                return reject(error);
            resolve(result.secure_url);
        });
        stream.end(file.buffer);
    }));
    return Promise.all(uploads);
}
exports.damageClaimService = {
    /**
     * ASSUMPTION (flag if wrong — not fully spec'd yet, see README): only
     * the equipment owner on a booking can file a claim, and only once
     * that booking has reached "completed" (i.e. the item was returned).
     */
    async create(userId, input, files) {
        const booking = await bookingRepository.findById(input.bookingId);
        if (!booking)
            throw AppError_1.AppError.notFound('Booking not found');
        if (booking.ownerId !== userId) {
            throw AppError_1.AppError.forbidden('Only the equipment owner can file a damage claim on this booking');
        }
        if (booking.status !== 'completed') {
            throw AppError_1.AppError.badRequest('A damage claim can only be filed after the booking is completed');
        }
        const existing = await damageClaimRepository.findOne({
            bookingId: booking.id,
            status: 'pending',
        });
        if (existing) {
            throw AppError_1.AppError.conflict('A pending damage claim already exists for this booking');
        }
        const evidencePhotoUrls = files.length ? await uploadEvidencePhotos(files) : [];
        return damageClaimRepository.create({
            bookingId: booking.id,
            claimantId: userId,
            description: input.description,
            amountClaimed: input.amountClaimed,
            evidencePhotoUrls,
            status: 'pending',
        });
    },
    async myClaims(userId, page, limit) {
        const { rows, count } = await damageClaimRepository.findAndCountAll({
            where: { claimantId: userId },
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });
        return { claims: rows, total: count, page, limit };
    },
    async adminList(filters) {
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
     * Creating the actual payout to the owner is an Owner Earnings concern
     * (Oliver's module) — left as a TODO hook below.
     */
    async approve(claimId) {
        const claim = await damageClaimRepository.findById(claimId);
        if (!claim)
            throw AppError_1.AppError.notFound('Damage claim not found');
        if (claim.status !== 'pending') {
            throw AppError_1.AppError.badRequest(`Cannot approve a claim that is already "${claim.status}"`);
        }
        const deposit = await depositRepository.findOne({ bookingId: claim.bookingId });
        if (!deposit) {
            throw AppError_1.AppError.conflict('No deposit exists for this booking — cannot allocate a claim payout');
        }
        if (deposit.status !== 'held') {
            throw AppError_1.AppError.badRequest(`Cannot approve this claim — the deposit is already "${deposit.status}"`);
        }
        await damageClaimRepository.update(claim.id, { status: 'approved' });
        await depositRepository.update(deposit.id, { status: 'claimed' });
        // TODO (Owner Earnings module): create an Earning record crediting
        // claim.amountClaimed to the equipment owner. That table/flow belongs
        // to Oliver's module — coordinate before either of you build it twice.
        return damageClaimRepository.findById(claim.id);
    },
    async reject(claimId, rejectionReason) {
        const claim = await damageClaimRepository.findById(claimId);
        if (!claim)
            throw AppError_1.AppError.notFound('Damage claim not found');
        if (claim.status !== 'pending') {
            throw AppError_1.AppError.badRequest(`Cannot reject a claim that is already "${claim.status}"`);
        }
        return damageClaimRepository.update(claim.id, {
            status: 'rejected',
            rejectionReason,
        });
    },
};
//# sourceMappingURL=damageClaim.service.js.map