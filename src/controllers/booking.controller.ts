import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';

export const bookingController = {
  async create(req: Request, res: Response) {
    const booking = await bookingService.createBooking(req.user!.userId, req.body);
    return sendSuccess(res, { message: 'Booking created successfully', data: booking });
  },

  async getMyBookings(req: Request, res: Response) {
    const bookings = await bookingService.getMyBookings(req.user!.userId);
    return sendSuccess(res, { message: 'My bookings fetched', data: bookings });
  },

  async getById(req: Request, res: Response) {
    const booking = await bookingService.getBookingById(req.params.id as string);
    return sendSuccess(res, { message: 'Booking fetched', data: booking });
  },

  async cancel(req: Request, res: Response) {
    const booking = await bookingService.cancelBooking(
      req.params.id as string,
      req.user!.userId,
      req.body.reason
    );
    return sendSuccess(res, { message: 'Booking cancelled', data: booking });
  },

  async getOwnerBookings(req: Request, res: Response) {
    const bookings = await bookingService.getOwnerBookings(req.user!.userId);
    return sendSuccess(res, { message: 'Owner bookings fetched', data: bookings });
  },

  async accept(req: Request, res: Response) {
    const booking = await bookingService.acceptBooking(req.params.id as string, req.user!.userId);
    return sendSuccess(res, { message: 'Booking accepted', data: booking });
  },

  async decline(req: Request, res: Response) {
    const booking = await bookingService.declineBooking(
      req.params.id as string,
      req.user!.userId,
      req.body.reason
    );
    return sendSuccess(res, { message: 'Booking declined', data: booking });
  },

  async start(req: Request, res: Response) {
    const booking = await bookingService.startBooking(req.params.id as string, req.user!.userId);
    return sendSuccess(res, { message: 'Booking started', data: booking });
  },

  async complete(req: Request, res: Response) {
    const booking = await bookingService.completeBooking(req.params.id as string, req.user!.userId);
    return sendSuccess(res, { message: 'Booking completed', data: booking });
  },
};