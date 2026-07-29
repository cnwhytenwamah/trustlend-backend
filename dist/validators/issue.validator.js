"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIssueSchema = exports.createIssueSchema = void 0;
const zod_1 = require("zod");
exports.createIssueSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    description: zod_1.z
        .string()
        .min(10)
        .max(2000),
    photoUrls: zod_1.z
        .array(zod_1.z.string().url())
        .optional(),
});
exports.updateIssueSchema = zod_1.z.object({
    description: zod_1.z
        .string()
        .min(10)
        .max(2000)
        .optional(),
    photoUrls: zod_1.z
        .array(zod_1.z.string().url())
        .optional(),
    status: zod_1.z
        .enum([
        "open",
        "in_review",
        "resolved",
        "closed",
    ])
        .optional(),
    resolutionNotes: zod_1.z
        .string()
        .max(2000)
        .nullable()
        .optional(),
});
//# sourceMappingURL=issue.validator.js.map