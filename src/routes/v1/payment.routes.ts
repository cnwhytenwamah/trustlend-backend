import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();

router.post("/payments/initialize", requireAuth, asyncHandler(notImplemented("payments.initialize")));
// Webhook: NO requireAuth — Paystack/Flutterwave call this directly.
// TODO: verify provider signature (x-paystack-signature / verif-hash) inside the controller instead.
router.post("/payments/webhook", asyncHandler(notImplemented("payments.webhook")));
router.get("/payments/my", requireAuth, asyncHandler(notImplemented("payments.myPayments")));
router.get("/payments/:id", requireAuth, asyncHandler(notImplemented("payments.getById")));
router.post("/payments/:id/refund", requireAuth, asyncHandler(notImplemented("payments.refund")));

export default router;
