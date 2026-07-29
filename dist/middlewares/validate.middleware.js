"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const AppError_1 = require("../utils/AppError");
/**
 * Validates req.body (or req.query/req.params) against a Zod schema.
 * On success, replaces the target with the parsed/typed data.
 *
 * Usage:
 *   router.post('/', validate(createEquipmentSchema), controller.create);
 *   router.get('/', validate(listEquipmentQuerySchema, 'query'), controller.list);
 */
function validate(schema, target = 'body') {
    return (req, _res, next) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            throw AppError_1.AppError.badRequest('Validation failed', result.error.flatten().fieldErrors);
        }
        req[target] = result.data;
        next();
    };
}
//# sourceMappingURL=validate.middleware.js.map