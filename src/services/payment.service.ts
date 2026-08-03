import { PaymentRepository } from '../repositories/payment.repository';
import { DepositRepository } from '../repositories/deposit.repository';
import { BookingRepository } from '../repositories/booking.repository';
import { RefundRepository } from '../repositories/refund.repository';
import { UserRepository } from '../repositories/user.repository';
import { EarningRepository } from '../repositories/earning.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { AppError } from '../utils/AppError';
import { paystackService } from './paystack.service';
import { InitializePaymentInput } from '../validators/payment.validator';
import { PaymentType } from '../models/payment.model';
import { Booking } from '../models/booking.model';
import { env } from '../config/env';

const paymentRepository = new PaymentRepository();
const depositRepository = new DepositRepository();
const bookingRepository = new BookingRepository();
const refundRepository = new RefundRepository();
const userRepository = new UserRepository();
const earningRepository = new EarningRepository();
const transactionRepository = new TransactionRepository();

/**
 * Assumption (flag if the Bookings module ends up modeling this
 * differently): a booking must be in "accepted" status — i.e. the owner
 * has already said yes — before the renter can be charged. Adjust this
 * single check if the team decides on a pay-first flow instead.
 */
const PAYABLE_BOOKING_STATUSES: Booking['status'][] = ['accepted'];

function computeAmount(booking: Booking, type: PaymentType): number {
  switch (type) {
    case 'rental':
      return Number(booking.rentalAmount);
    case 'deposit':
      return Number(booking.depositAmount);
    case 'rental_and_deposit':
      return Number(booking.totalAmount);
  }
}

export const paymentService = {
  async initialize(userId: string, input: InitializePaymentInput) {
    const booking = await bookingRepository.findById(input.bookingId);
    if (!booking) throw AppError.notFound('Booking not found');

    if (booking.renterId !== userId) {
      throw AppError.forbidden('You can only pay for your own bookings');
    }

    if (!PAYABLE_BOOKING_STATUSES.includes(booking.status)) {
      throw AppError.badRequest(
        `This booking is "${booking.status}" and cannot be paid for right now`,
      );
    }

    const amount = computeAmount(booking, input.type);
    if (!amount || amount <= 0) {
      throw AppError.badRequest('Nothing to charge for this payment type');
    }

    const user = await userRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');

    // Unique per attempt (not per booking) so a renter can retry a failed payment.
    const reference = `trustlend_${booking.id.slice(0, 8)}_${Date.now()}`;

    const paystackData = await paystackService.initializeTransaction({
      email: user.email,
      amountKobo: Math.round(amount * 100),
      reference,
      metadata: { bookingId: booking.id, userId, type: input.type },
    });

    const payment = await paymentRepository.create({
      bookingId: booking.id,
      userId,
      provider: 'paystack',
      providerReference: reference,
      type: input.type,
      amount,
      currency: 'NGN',
      status: 'pending',
    } as never);

    return {
      paymentId: payment.id,
      authorizationUrl: paystackData.authorization_url,
      accessCode: paystackData.access_code,
      reference,
    };
  },

  /**
   * Called from the /payments/webhook route. Paystack retries webhooks
   * that don't return 2xx quickly, and the same event can arrive more
   * than once — this is written to be safe to run twice for the same
   * reference (checks payment.status before doing anything).
   */
  async handleWebhook(rawBody: Buffer, signature: string | undefined) {
    if (!paystackService.verifyWebhookSignature(rawBody, signature)) {
      throw AppError.unauthorized('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody.toString('utf8'));

    if (event.event !== 'charge.success') {
      return; // ignore other event types for MVP (refunds handled via /admin/refunds)
    }

    const reference: string = event.data.reference;
    const payment = await paymentRepository.findOne({ providerReference: reference });
    if (!payment) return; // unknown reference — nothing to reconcile

    if (payment.status === 'successful') return; // already processed, avoid double-effects

    await paymentRepository.update(payment.id, {
      status: 'successful',
      paidAt: new Date(),
    } as never);

    const booking = await bookingRepository.findById(payment.bookingId);

    // If this payment covered a deposit, open the Deposit record now that
    // funds have cleared, and log the hold as a Transaction.
    if (booking && (payment.type === 'deposit' || payment.type === 'rental_and_deposit')) {
      if (Number(booking.depositAmount) > 0) {
        await depositRepository.create({
          bookingId: payment.bookingId,
          paymentId: payment.id,
          amount: booking.depositAmount,
          status: 'held',
          heldAt: new Date(),
        } as never);

        await transactionRepository.create({
          userId: booking.renterId,
          type: 'deposit_hold',
          amount: booking.depositAmount,
          reference: `${reference}-deposit-hold`,
          status: 'successful',
          relatedBookingId: booking.id,
          relatedPaymentId: payment.id,
        } as never);
      }
    }

    // If this payment covered rent, log the payment itself as a
    // Transaction and credit the owner's earnings.
    //
    // ASSUMPTION (flag if wrong): earnings start "pending" rather than
    // immediately "available" — they flip to "available" either when the
    // deposit is released (deposit.service.ts release()) or when a filed
    // damage claim is rejected (damageClaim.service.ts reject()), both of
    // which only happen once the booking has genuinely completed cleanly.
    // EDGE CASE not yet handled: a booking with a $0 deposit and no
    // damage claim ever filed has no trigger to flip pending->available.
    // The more robust fix is a hook in Bookings' completeBooking()
    // (Triumph's file) — flagged as a follow-up, not blocking this.
    if (booking && (payment.type === 'rental' || payment.type === 'rental_and_deposit')) {
      const grossAmount = Number(booking.rentalAmount);
      const platformFee = Math.round(grossAmount * (env.PLATFORM_FEE_PERCENT / 100) * 100) / 100;
      const netAmount = grossAmount - platformFee;

      await earningRepository.create({
        ownerId: booking.ownerId,
        bookingId: booking.id,
        grossAmount,
        platformFee,
        netAmount,
        status: 'pending',
      } as never);

      await transactionRepository.create({
        userId: booking.renterId,
        type: 'rental_payment',
        amount: grossAmount,
        reference: `${reference}-rental`,
        status: 'successful',
        relatedBookingId: booking.id,
        relatedPaymentId: payment.id,
      } as never);
    }

    // TODO (coordinate with Bookings owner): the booking may need to move
    // to "in_progress" once payment clears — that's Triumph's table, not
    // touched here.
  },

  async getById(userId: string, paymentId: string) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) throw AppError.notFound('Payment not found');
    if (payment.userId !== userId) throw AppError.forbidden('You cannot view this payment');
    return payment;
  },

  async myPayments(userId: string, page: number, limit: number) {
    const { rows, count } = await paymentRepository.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });
    return { payments: rows, total: count, page, limit };
  },

  /**
   * Creates a pending Refund *request*. The Refunds module
   * (/admin/refunds/:id/process) — owned by a teammate, not this
   * module — is what actually approves/executes it against Paystack.
   */
  async requestRefund(userId: string, paymentId: string, reason: string) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) throw AppError.notFound('Payment not found');
    if (payment.userId !== userId) {
      throw AppError.forbidden('You cannot request a refund for this payment');
    }
    if (payment.status !== 'successful') {
      throw AppError.badRequest('Only successful payments can be refunded');
    }

    const existing = await refundRepository.findOne({ paymentId: payment.id, status: 'pending' });
    if (existing) {
      throw AppError.conflict('A refund request for this payment is already pending');
    }

    return refundRepository.create({
      paymentId: payment.id,
      amount: payment.amount,
      reason,
      status: 'pending',
    } as never);
  },
};
