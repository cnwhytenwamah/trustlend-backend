"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = exports.adminListDamageClaimsQuerySchema = exports.damageClaimIdParamSchema = exports.rejectDamageClaimSchema = exports.createDamageClaimSchema = void 0;
const zod_1 = require("zod");
exports.createDamageClaimSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    description: zod_1.z.string().min(10).max(2000),
    amountClaimed: zod_1.z.coerce.number().positive(),
});
exports.rejectDamageClaimSchema = zod_1.z.object({
    reason: zod_1.z.string().min(3).max(500),
});
exports.damageClaimIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.adminListDamageClaimsQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'approved', 'rejected']).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
//# sourceMappingURL=damageClaim.validator.js.map