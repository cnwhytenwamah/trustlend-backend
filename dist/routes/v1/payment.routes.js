"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const payment_controller_1 = require("../../controllers/payment.controller");
const payment_validator_1 = require("../../validators/payment.validator");
const router = (0, express_1.Router)();
router.post('/payments/initialize', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(payment_validator_1.initializePaymentSchema), (0, asyncHandler_1.asyncHandler)(payment_controller_1.paymentController.initialize));
// No requireAuth — Paystack calls this directly. Signature is verified
// inside paymentService.handleWebhook using the raw body (see app.ts,
// which mounts express.raw() on this exact path before express.json()).
router.post('/payments/webhook', (0, asyncHandler_1.asyncHandler)(payment_controller_1.paymentController.webhook));
router.get('/payments/my', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(payment_validator_1.paginationQuerySchema, 'query'), (0, asyncHandler_1.asyncHandler)(payment_controller_1.paymentController.myPayments));
router.get('/payments/:id', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(payment_validator_1.paymentIdParamSchema, 'params'), (0, asyncHandler_1.asyncHandler)(payment_controller_1.paymentController.getById));
router.post('/payments/:id/refund', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(payment_validator_1.paymentIdParamSchema, 'params'), (0, validate_middleware_1.validate)(payment_validator_1.refundPaymentSchema), (0, asyncHandler_1.asyncHandler)(payment_controller_1.paymentController.refund));
exports.default = router;
//# sourceMappingURL=payment.routes.js.map