"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = exports.refundPaymentSchema = exports.paymentIdParamSchema = exports.initializePaymentSchema = void 0;
const zod_1 = require("zod");
exports.initializePaymentSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['rental', 'deposit', 'rental_and_deposit']),
});
exports.paymentIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.refundPaymentSchema = zod_1.z.object({
    reason: zod_1.z.string().min(3).max(500),
});
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
//# sourceMappingURL=payment.validator.js.map