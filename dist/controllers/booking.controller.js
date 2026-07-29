"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const booking_service_1 = require("../services/booking.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.bookingController = {
    async create(req, res) {
        const booking = await booking_service_1.bookingService.createBooking(req.user.userId, req.body);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Booking created successfully', data: booking });
    },
    async getMyBookings(req, res) {
        const bookings = await booking_service_1.bookingService.getMyBookings(req.user.userId);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'My bookings fetched', data: bookings });
    },
    async getById(req, res) {
        const booking = await booking_service_1.bookingService.getBookingById(req.params.id);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Booking fetched', data: booking });
    },
    async cancel(req, res) {
        const booking = await booking_service_1.bookingService.cancelBooking(req.params.id, req.user.userId, req.body.reason);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Booking cancelled', data: booking });
    },
    async getOwnerBookings(req, res) {
        const bookings = await booking_service_1.bookingService.getOwnerBookings(req.user.userId);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Owner bookings fetched', data: bookings });
    },
    async accept(req, res) {
        const booking = await booking_service_1.bookingService.acceptBooking(req.params.id, req.user.userId);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Booking accepted', data: booking });
    },
    async decline(req, res) {
        const booking = await booking_service_1.bookingService.declineBooking(req.params.id, req.user.userId, req.body.reason);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Booking declined', data: booking });
    },
    async start(req, res) {
        const booking = await booking_service_1.bookingService.startBooking(req.params.id, req.user.userId);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Booking started', data: booking });
    },
    async complete(req, res) {
        const booking = await booking_service_1.bookingService.completeBooking(req.params.id, req.user.userId);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Booking completed', data: booking });
    },
};
//# sourceMappingURL=booking.controller.js.map