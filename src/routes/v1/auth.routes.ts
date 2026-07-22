import { Router } from 'express';
import { authController } from '../../controllers/auth.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { validate } from '../../middlewares/validate.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from '../../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  asyncHandler(authController.refreshToken),
);
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword),
);
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  asyncHandler(authController.resetPassword),
);
router.post('/verify-email', validate(verifyEmailSchema), asyncHandler(authController.verifyEmail));
router.post(
  '/resend-verification',
  validate(resendVerificationSchema),
  asyncHandler(authController.resendVerification),
);

export default router;
