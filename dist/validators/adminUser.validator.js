"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminListUsersQuerySchema = exports.updateUserStatusSchema = exports.adminUserIdParamSchema = void 0;
const zod_1 = require("zod");
exports.adminUserIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.updateUserStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['active', 'suspended', 'deleted']),
});
exports.adminListUsersQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(['active', 'suspended', 'deleted']).optional(),
    search: zod_1.z.string().min(1).max(100).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
//# sourceMappingURL=adminUser.validator.js.map