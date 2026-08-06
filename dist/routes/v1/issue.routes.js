"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const issue_controller_1 = require("../../controllers/issue.controller");
const issue_validator_1 = require("../../validators/issue.validator");
const router = (0, express_1.Router)();
// --------------------
// Issue Management
// --------------------
router.post("/issues", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(issue_validator_1.createIssueSchema), (0, asyncHandler_1.asyncHandler)(issue_controller_1.issueController.create));
router.get("/issues/my", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(issue_controller_1.issueController.myIssues));
router.get("/issues/:id", (0, asyncHandler_1.asyncHandler)(issue_controller_1.issueController.getById));
router.patch("/issues/:id", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(issue_validator_1.updateIssueSchema), (0, asyncHandler_1.asyncHandler)(issue_controller_1.issueController.update));
exports.default = router;
//# sourceMappingURL=issue.routes.js.map