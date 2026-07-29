"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = exports.refundDepositSchema = exports.depositIdParamSchema = void 0;
const zod_1 = require("zod");
exports.depositIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.refundDepositSchema = zod_1.z.object({
    reason: zod_1.z.string().min(3).max(500),
});
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
//# sourceMappingURL=deposit.validator.js.map