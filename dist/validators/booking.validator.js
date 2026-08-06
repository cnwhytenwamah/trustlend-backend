"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declineBookingSchema = exports.cancelBookingSchema = exports.bookingIdParamSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
exports.createBookingSchema = zod_1.z.object({
    equipmentId: zod_1.z.string().uuid(),
    startDate: zod_1.z.string().date(),
    endDate: zod_1.z.string().date(),
});
exports.bookingIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.cancelBookingSchema = zod_1.z.object({
    reason: zod_1.z.string().min(1).max(255).optional(),
});
exports.declineBookingSchema = zod_1.z.object({
    reason: zod_1.z.string().min(1).max(255),
});
//# sourceMappingURL=booking.validator.js.map