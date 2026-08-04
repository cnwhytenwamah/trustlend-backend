import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { adminUserController } from '../../controllers/adminUser.controller';
import { adminUserIdParamSchema, updateUserStatusSchema, adminListUsersQuerySchema,} from '../../validators/adminUser.validator';

const router = Router();

router.get('/admin/users', requireAuth, requireRole('admin'), validate(adminListUsersQuerySchema, 'query'), asyncHandler(adminUserController.list));
router.get(
  '/admin/users/:id',
  requireAuth,
  requireRole('admin'),
  validate(adminUserIdParamSchema, 'params'),
  asyncHandler(adminUserController.getById),
);
router.patch(
  '/admin/users/:id/status',
  requireAuth,
  requireRole('admin'),
  validate(adminUserIdParamSchema, 'params'),
  validate(updateUserStatusSchema),
  asyncHandler(adminUserController.updateStatus),
);
router.patch(
  '/admin/users/:id/verify',
  requireAuth,
  requireRole('admin'),
  validate(adminUserIdParamSchema, 'params'),
  asyncHandler(adminUserController.verify),
);
router.delete(
  '/admin/users/:id',
  requireAuth,
  requireRole('admin'),
  validate(adminUserIdParamSchema, 'params'),
  asyncHandler(adminUserController.remove),
);

export default router;
