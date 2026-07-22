import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { paymentController } from '../../controllers/payment.controller';
import {
  initializePaymentSchema,
  paymentIdParamSchema,
  refundPaymentSchema,
  paginationQuerySchema,
} from '../../validators/payment.validator';

const router = Router();

router.post(
  '/payments/initialize',
  requireAuth,
  validate(initializePaymentSchema),
  asyncHandler(paymentController.initialize),
);

// No requireAuth — Paystack calls this directly. Signature is verified
// inside paymentService.handleWebhook using the raw body (see app.ts,
// which mounts express.raw() on this exact path before express.json()).
router.post('/payments/webhook', asyncHandler(paymentController.webhook));

router.get(
  '/payments/my',
  requireAuth,
  validate(paginationQuerySchema, 'query'),
  asyncHandler(paymentController.myPayments),
);

router.get(
  '/payments/:id',
  requireAuth,
  validate(paymentIdParamSchema, 'params'),
  asyncHandler(paymentController.getById),
);

router.post(
  '/payments/:id/refund',
  requireAuth,
  validate(paymentIdParamSchema, 'params'),
  validate(refundPaymentSchema),
  asyncHandler(paymentController.refund),
);

export default router;
