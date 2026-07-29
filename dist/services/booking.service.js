"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const booking_repository_1 = require("../repositories/booking.repository");
const equipment_repository_1 = require("../repositories/equipment.repository");
const AppError_1 = require("../utils/AppError");
const bookingRepo = new booking_repository_1.BookingRepository();
const equipmentRepo = new equipment_repository_1.EquipmentRepository();
exports.bookingService = {
    async createBooking(renterId, data) {
        const equipment = await equipmentRepo.findById(data.equipmentId);
        if (!equipment) {
            throw AppError_1.AppError.notFound('Equipment not found');
        }
        const existingBookings = await bookingRepo.findAll({
            where: {
                equipmentId: data.equipmentId,
                status: ['pending', 'accepted', 'in_progress'],
            },
        });
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        const overlap = existingBookings.some((b) => {
            const bStart = new Date(b.startDate);
            const bEnd = new Date(b.endDate);
            return start < bEnd && end > bStart;
        });
        if (overlap) {
            throw AppError_1.AppError.badRequest('Equipment is not available for these dates');
        }
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const dailyRate = Number(equipment.dailyRate);
        const rentalAmount = days * dailyRate;
        const depositAmount = Number(equipment.securityDepositAmount) || 0;
        const totalAmount = rentalAmount + depositAmount;
        const booking = await bookingRepo.create({
            renterId,
            equipmentId: data.equipmentId,
            ownerId: equipment.ownerId,
            startDate: data.startDate,
            endDate: data.endDate,
            dailyRate,
            rentalAmount,
            depositAmount,
            totalAmount,
            status: 'pending',
        });
        return booking;
    },
    async getMyBookings(userId) {
        return bookingRepo.findAll({
            where: { renterId: userId },
            include: ['equipment', 'owner'],
            order: [['createdAt', 'DESC']],
        });
    },
    async getOwnerBookings(userId) {
        return bookingRepo.findAll({
            where: { ownerId: userId },
            include: ['equipment', 'renter'],
            order: [['createdAt', 'DESC']],
        });
    },
    async getBookingById(id) {
        const booking = await bookingRepo.findById(id);
        if (!booking) {
            throw AppError_1.AppError.notFound('Booking not found');
        }
        return booking;
    },
    async cancelBooking(id, userId, reason) {
        const booking = await bookingRepo.findById(id);
        if (!booking) {
            throw AppError_1.AppError.notFound('Booking not found');
        }
        if (booking.renterId !== userId) {
            throw AppError_1.AppError.forbidden('You are not authorized to cancel this booking');
        }
        if (!['pending', 'accepted'].includes(booking.status)) {
            throw AppError_1.AppError.badRequest('Booking cannot be cancelled at this stage');
        }
        return bookingRepo.update(id, {
            status: 'cancelled',
            cancellationReason: reason || null,
        });
    },
    async acceptBooking(id, userId) {
        const booking = await bookingRepo.findById(id);
        if (!booking) {
            throw AppError_1.AppError.notFound('Booking not found');
        }
        const bookingData = booking.toJSON ? booking.toJSON() : booking;
        if (bookingData.ownerId !== userId) {
            throw AppError_1.AppError.forbidden('You are not authorized to accept this booking');
        }
        if (bookingData.status !== 'pending') {
            throw AppError_1.AppError.badRequest('Only pending bookings can be accepted');
        }
        return bookingRepo.update(id, { status: 'accepted' });
    },
    async declineBooking(id, userId, reason) {
        const booking = await bookingRepo.findById(id);
        if (!booking) {
            throw AppError_1.AppError.notFound('Booking not found');
        }
        const bookingData = booking.toJSON ? booking.toJSON() : booking;
        if (bookingData.ownerId !== userId) {
            throw AppError_1.AppError.forbidden('You are not authorized to decline this booking');
        }
        if (bookingData.status !== 'pending') {
            throw AppError_1.AppError.badRequest('Only pending bookings can be declined');
        }
        return bookingRepo.update(id, {
            status: 'declined',
            declineReason: reason,
        });
    },
    async startBooking(id, userId) {
        const booking = await bookingRepo.findById(id);
        if (!booking) {
            throw AppError_1.AppError.notFound('Booking not found');
        }
        const bookingData = booking.toJSON ? booking.toJSON() : booking;
        if (bookingData.ownerId !== userId) {
            throw AppError_1.AppError.forbidden('You are not authorized to start this booking');
        }
        if (bookingData.status !== 'accepted') {
            throw AppError_1.AppError.badRequest('Only accepted bookings can be started');
        }
        return bookingRepo.update(id, { status: 'in_progress' });
    },
    async completeBooking(id, userId) {
        const booking = await bookingRepo.findById(id);
        if (!booking) {
            throw AppError_1.AppError.notFound('Booking not found');
        }
        const bookingData = booking.toJSON ? booking.toJSON() : booking;
        if (bookingData.ownerId !== userId) {
            throw AppError_1.AppError.forbidden('You are not authorized to complete this booking');
        }
        if (bookingData.status !== 'in_progress') {
            throw AppError_1.AppError.badRequest('Only in-progress bookings can be completed');
        }
        return bookingRepo.update(id, { status: 'completed' });
    },
};
//# sourceMappingURL=booking.service.js.map