"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEquipmentSchema = exports.createEquipmentSchema = void 0;
const zod_1 = require("zod");
exports.createEquipmentSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().min(10).max(1000),
    category: zod_1.z.string().min(2).max(100),
    brand: zod_1.z.string().max(100).optional(),
    model: zod_1.z.string().max(100).optional(),
    condition: zod_1.z.string().max(100).optional(),
    dailyRate: zod_1.z.coerce.number().positive(),
    weeklyRate: zod_1.z.coerce.number().positive().optional(),
    securityDepositAmount: zod_1.z.coerce.number().min(0),
    address: zod_1.z.string().max(255).optional(),
    latitude: zod_1.z.coerce.number().optional(),
    longitude: zod_1.z.coerce.number().optional(),
});
exports.updateEquipmentSchema = exports.createEquipmentSchema.partial();
//# sourceMappingURL=equipment.validator.js.map