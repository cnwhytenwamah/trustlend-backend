"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topEquipmentQuerySchema = exports.analyticsDateRangeQuerySchema = void 0;
const zod_1 = require("zod");
exports.analyticsDateRangeQuerySchema = zod_1.z.object({
    from: zod_1.z.coerce.date().optional(),
    to: zod_1.z.coerce.date().optional(),
});
exports.topEquipmentQuerySchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().int().min(1).max(50).default(10),
});
//# sourceMappingURL=analytics.validator.js.map