"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userReviewsParamSchema = exports.equipmentReviewsParamSchema = exports.updateReviewSchema = exports.reviewIdParamSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().optional(),
});
exports.reviewIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.updateReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5).optional(),
    comment: zod_1.z.string().optional(),
});
exports.equipmentReviewsParamSchema = zod_1.z.object({
    equipmentId: zod_1.z.string().uuid(),
});
exports.userReviewsParamSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
});
//# sourceMappingURL=review.validator.js.map