"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const review_controller_1 = require("../../controllers/review.controller");
const review_validator_1 = require("../../validators/review.validator");
const router = (0, express_1.Router)();
router.post("/reviews", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(review_validator_1.createReviewSchema), (0, asyncHandler_1.asyncHandler)(review_controller_1.reviewController.create));
router.get("/reviews/equipment/:equipmentId", (0, validate_middleware_1.validate)(review_validator_1.equipmentReviewsParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(review_controller_1.reviewController.getEquipmentReviews));
router.get("/reviews/user/:userId", (0, validate_middleware_1.validate)(review_validator_1.userReviewsParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(review_controller_1.reviewController.getUserReviews));
router.patch("/reviews/:id", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(review_validator_1.reviewIdParamSchema, "params"), (0, validate_middleware_1.validate)(review_validator_1.updateReviewSchema), (0, asyncHandler_1.asyncHandler)(review_controller_1.reviewController.update));
router.delete("/reviews/:id", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(review_validator_1.reviewIdParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(review_controller_1.reviewController.delete));
exports.default = router;
//# sourceMappingURL=review.routes.js.map