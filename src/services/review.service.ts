import { ReviewRepository } from '../repositories/review.repository';
import { BookingRepository } from '../repositories/booking.repository';
import { AppError } from '../utils/AppError';

const reviewRepo = new ReviewRepository();
const bookingRepo = new BookingRepository();

export const reviewService = {
  async createReview(userId: string, data: any) {
    const booking = await bookingRepo.findById(data.bookingId);
    if (!booking) {
      throw AppError.notFound('Booking not found');
    }

    const bookingData = booking.toJSON ? booking.toJSON() : booking;

    if (bookingData.renterId !== userId) {
      throw AppError.forbidden('You can only review bookings you made');
    }

    if (bookingData.status !== 'completed') {
      throw AppError.badRequest('You can only review completed bookings');
    }

    const existingReviews = await reviewRepo.findAll({
      where: { bookingId: data.bookingId },
    });
    if (existingReviews.length > 0) {
      throw AppError.badRequest('You already reviewed this booking');
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

  async getEquipmentReviews(equipmentId: string) {
    const reviews = await reviewRepo.findAll({
      where: { equipmentId },
      include: ['reviewer', 'reviewee'],
      order: [['createdAt', 'DESC']],
    });
    return reviews;
  },

  async getUserReviews(userId: string) {
    const reviews = await reviewRepo.findAll({
      where: { revieweeId: userId },
      include: ['reviewer', { association: 'equipment', include: [{ association: 'photos', where: { isPrimary: true }, required: false }] }],
      order: [['createdAt', 'DESC']],
    });
    return reviews;
  },

  async updateReview(reviewId: string, userId: string, data: any) {
    const review = await reviewRepo.findById(reviewId);
    if (!review) {
      throw AppError.notFound('Review not found');
    }

    if (review.reviewerId !== userId) {
      throw AppError.forbidden('You can only update your own reviews');
    }

    const updated = await reviewRepo.update(reviewId, data);
    return updated;
  },

  async deleteReview(reviewId: string, userId: string) {
    const review = await reviewRepo.findById(reviewId);
    if (!review) {
      throw AppError.notFound('Review not found');
    }

    if (review.reviewerId !== userId) {
      throw AppError.forbidden('You can only delete your own reviews');
    }

    await reviewRepo.delete(reviewId);
    return { message: 'Review deleted successfully' };
  },
};