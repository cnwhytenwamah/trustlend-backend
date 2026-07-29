"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const review_repository_1 = require("../repositories/review.repository");
const booking_repository_1 = require("../repositories/booking.repository");
const AppError_1 = require("../utils/AppError");
const reviewRepo = new review_repository_1.ReviewRepository();
const bookingRepo = new booking_repository_1.BookingRepository();
exports.reviewService = {
    async createReview(userId, data) {
        const booking = await bookingRepo.findById(data.bookingId);
        if (!booking) {
            throw AppError_1.AppError.notFound('Booking not found');
        }
        const bookingData = booking.toJSON ? booking.toJSON() : booking;
        if (bookingData.renterId !== userId) {
            throw AppError_1.AppError.forbidden('You can only review bookings you made');
        }
        if (bookingData.status !== 'completed') {
            throw AppError_1.AppError.badRequest('You can only review completed bookings');
        }
        const existingReviews = await reviewRepo.findAll({
            where: { bookingId: data.bookingId },
        });
        if (existingReviews.length > 0) {
            throw AppError_1.AppError.badRequest('You already reviewed this booking');
        }
        const review = await reviewRepo.create({
            reviewerId: userId,
            revieweeId: bookingData.ownerId,
            equipmentId: bookingData.equipmentId,
            bookingId: data.bookingId,
            rating: data.rating,
            comment: data.comment || null,
        });
        return review;
    },
    async getEquipmentReviews(equipmentId) {
        const reviews = await reviewRepo.findAll({
            where: { equipmentId },
            include: ['reviewer', 'reviewee'],
            order: [['createdAt', 'DESC']],
        });
        return reviews;
    },
    async getUserReviews(userId) {
        const reviews = await reviewRepo.findAll({
            where: { revieweeId: userId },
            include: ['reviewer', 'equipment'],
            order: [['createdAt', 'DESC']],
        });
        return reviews;
    },
    async updateReview(reviewId, userId, data) {
        const review = await reviewRepo.findById(reviewId);
        if (!review) {
            throw AppError_1.AppError.notFound('Review not found');
        }
        if (review.reviewerId !== userId) {
            throw AppError_1.AppError.forbidden('You can only update your own reviews');
        }
        const updated = await reviewRepo.update(reviewId, data);
        return updated;
    },
    async deleteReview(reviewId, userId) {
        const review = await reviewRepo.findById(reviewId);
        if (!review) {
            throw AppError_1.AppError.notFound('Review not found');
        }
        if (review.reviewerId !== userId) {
            throw AppError_1.AppError.forbidden('You can only delete your own reviews');
        }
        await reviewRepo.delete(reviewId);
        return { message: 'Review deleted successfully' };
    },
};
//# sourceMappingURL=review.service.js.map