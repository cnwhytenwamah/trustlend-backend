"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectVerificationSchema = exports.updateVerificationSchema = exports.createVerificationSchema = void 0;
const zod_1 = require("zod");
exports.createVerificationSchema = zod_1.z.object({
    documentType: zod_1.z
        .string()
        .min(2)
        .max(100),
    documentUrl: zod_1.z
        .string()
        .url(),
    selfieUrl: zod_1.z
        .string()
        .url()
        .optional(),
});
exports.updateVerificationSchema = exports.createVerificationSchema.partial();
exports.rejectVerificationSchema = zod_1.z.object({
    rejectionReason: zod_1.z
        .string()
        .min(3)
        .max(500),
});
//# sourceMappingURL=verification.validator.js.map