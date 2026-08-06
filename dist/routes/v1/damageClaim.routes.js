"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const damageClaim_controller_1 = require("../../controllers/damageClaim.controller");
const damageClaim_validator_1 = require("../../validators/damageClaim.validator");
const router = (0, express_1.Router)();
router.post('/damage-claims', auth_middleware_1.requireAuth, upload_middleware_1.upload.array('photos', 10), (0, validate_middleware_1.validate)(damageClaim_validator_1.createDamageClaimSchema), (0, asyncHandler_1.asyncHandler)(damageClaim_controller_1.damageClaimController.create));
router.get('/damage-claims/my', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(damageClaim_validator_1.paginationQuerySchema, 'query'), (0, asyncHandler_1.asyncHandler)(damageClaim_controller_1.damageClaimController.myClaims));
router.get('/admin/damage-claims', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validate)(damageClaim_validator_1.adminListDamageClaimsQuerySchema, 'query'), (0, asyncHandler_1.asyncHandler)(damageClaim_controller_1.damageClaimController.adminList));
router.patch('/admin/damage-claims/:id/approve', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validate)(damageClaim_validator_1.damageClaimIdParamSchema, 'params'), (0, asyncHandler_1.asyncHandler)(damageClaim_controller_1.damageClaimController.approve));
router.patch('/admin/damage-claims/:id/reject', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validate)(damageClaim_validator_1.damageClaimIdParamSchema, 'params'), (0, validate_middleware_1.validate)(damageClaim_validator_1.rejectDamageClaimSchema), (0, asyncHandler_1.asyncHandler)(damageClaim_controller_1.damageClaimController.reject));
exports.default = router;
//# sourceMappingURL=damageClaim.routes.js.map