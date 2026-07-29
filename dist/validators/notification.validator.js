"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationIdParamSchema = void 0;
const zod_1 = require("zod");
exports.notificationIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=notification.validator.js.map