import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { depositController } from '../../controllers/deposit.controller';
import {
  depositIdParamSchema,
  refundDepositSchema,
  paginationQuerySchema,
} from '../../validators/deposit.validator';

const router = Router();

router.get(
  '/deposits/my',
  requireAuth,
  validate(paginationQuerySchema, 'query'),
  asyncHandler(depositController.myDeposits),
);

router.get(
  '/deposits/:id',
  requireAuth,
  validate(depositIdParamSchema, 'params'),
  asyncHandler(depositController.getById),
);

// Admin-only: explicit refund path outside the normal release flow
// (e.g. a cancelled booking that never reached "completed").
router.patch(
  '/deposits/:id/refund',
  requireAuth,
  requireRole('admin'),
  validate(depositIdParamSchema, 'params'),
  validate(refundDepositSchema),
  asyncHandler(depositController.refund),
);

// Admin-only: manual re-hold, e.g. while a dispute/damage claim is under review.
router.patch(
  '/deposits/:id/hold',
  requireAuth,
  requireRole('admin'),
  validate(depositIdParamSchema, 'params'),
  asyncHandler(depositController.hold),
);

// Equipment owner (or admin) confirms no damage and releases the deposit.
router.patch(
  '/deposits/:id/release',
  requireAuth,
  validate(depositIdParamSchema, 'params'),
  asyncHandler(depositController.release),
);

export default router;
