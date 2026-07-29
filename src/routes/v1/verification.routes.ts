import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  requireAuth,
  requireRole,
} from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { verificationController } from '../../controllers/verification.controller';
import {
  createVerificationSchema,
  updateVerificationSchema,
  rejectVerificationSchema,
} from '../../validators/verification.validator';

const router = Router();

// --------------------
// Identity Verification
// --------------------

router.post(
  '/verifications',
  requireAuth,
  validate(createVerificationSchema),
  asyncHandler(verificationController.create)
);

router.get(
  '/verifications/me',
  requireAuth,
  asyncHandler(verificationController.me)
);

router.patch(
  '/verifications/me',
  requireAuth,
  validate(updateVerificationSchema),
  asyncHandler(verificationController.update)
);

// --------------------
// Admin Verification Management
// --------------------

router.get(
  '/admin/verifications',
  requireAuth,
  requireRole('admin'),
  asyncHandler(verificationController.list)
);

router.patch(
  '/admin/verifications/:id/approve',
  requireAuth,
  requireRole('admin'),
  asyncHandler(verificationController.approve)
);

router.patch(
  '/admin/verifications/:id/reject',
  requireAuth,
  requireRole('admin'),
  validate(rejectVerificationSchema),
  asyncHandler(verificationController.reject)
);

export default router;