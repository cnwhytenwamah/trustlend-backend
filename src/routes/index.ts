import { Router } from 'express';
import authRoutes from './v1/auth.routes';
import userRoutes from './v1/user.routes';
import verificationRoutes from './v1/verification.routes';
import availabilityRoutes from './v1/availability.routes';
import equipmentRoutes from './v1/equipment.routes';
import bookingRoutes from './v1/booking.routes';
import paymentRoutes from './v1/payment.routes';
import depositRoutes from './v1/deposit.routes';
import reviewRoutes from './v1/review.routes';
import issueRoutes from './v1/issue.routes';
import earningRoutes from './v1/earning.routes';
import notificationRoutes from './v1/notification.routes';
import adminRoutes from './v1/admin.routes';
import disputeRoutes from './v1/dispute.routes';
import damageClaimRoutes from './v1/damageClaim.routes';
import refundRoutes from './v1/refund.routes';
import transactionRoutes from './v1/transaction.routes';
import analyticsRoutes from './v1/analytics.routes';

const router = Router();

/**
 * Every v1 route file below already defines its OWN full path
 * (e.g. router.get('/equipment/:id', ...) or router.get('/admin/equipment', ...)),
 * so they're all mounted flat at the version root. Don't add another
 * path segment here — add it inside the specific route file instead.
 */
router.use('/auth', authRoutes); // exception: auth.routes.ts uses relative paths under /auth
router.use('/users', userRoutes); // exception: user.routes.ts uses relative paths under /users
router.use('/', verificationRoutes);
router.use('/', availabilityRoutes);
router.use('/', equipmentRoutes);
router.use('/', bookingRoutes);
router.use('/', paymentRoutes);
router.use('/', depositRoutes);
router.use('/', reviewRoutes);
router.use('/', issueRoutes);
router.use('/', earningRoutes);
router.use('/', notificationRoutes);
router.use('/', adminRoutes);
router.use('/', disputeRoutes);
router.use('/', damageClaimRoutes);
router.use('/', refundRoutes);
router.use('/', transactionRoutes);
router.use('/', analyticsRoutes);

export default router;
