import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { issueController } from "../../controllers/issue.controller";
import {
  createIssueSchema,
  updateIssueSchema,
} from "../../validators/issue.validator";

const router = Router();

// --------------------
// Issue Management
// --------------------

router.post(
  "/issues",
  requireAuth,
  validate(createIssueSchema),
  asyncHandler(issueController.create)
);

router.get(
  "/issues/my",
  requireAuth,
  asyncHandler(issueController.myIssues)
);

router.get(
  "/issues/:id",
  asyncHandler(issueController.getById)
);

router.patch(
  "/issues/:id",
  requireAuth,
  validate(updateIssueSchema),
  asyncHandler(issueController.update)
);

export default router;