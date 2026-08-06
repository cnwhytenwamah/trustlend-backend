"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockIdParamSchema = exports.blockDatesSchema = exports.updateAvailabilitySchema = exports.availabilityParamSchema = void 0;
const zod_1 = require("zod");
exports.availabilityParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.updateAvailabilitySchema = zod_1.z.object({
    isAvailable: zod_1.z.boolean().optional(),
    availableFrom: zod_1.z.string().datetime().optional(),
    availableTo: zod_1.z.string().datetime().optional(),
});
exports.blockDatesSchema = zod_1.z.object({
    startDate: zod_1.z.string().date(),
    endDate: zod_1.z.string().date(),
    reason: zod_1.z.string().optional(),
});
exports.blockIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    blockId: zod_1.z.string().uuid(),
});
//# sourceMappingURL=availability.validator.js.map