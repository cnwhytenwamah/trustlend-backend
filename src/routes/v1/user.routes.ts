// User profile routes
import { Router } from 'express';
import { userController } from '../../controllers/user.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { updateProfileSchema, userIdParamSchema } from '../../validators/user.validator';

const router = Router();

router.get('/me', requireAuth, asyncHandler(userController.getMe));
router.patch('/me', requireAuth, validate(updateProfileSchema), asyncHandler(userController.updateMe));
router.patch(
  '/me/profile-photo',
  requireAuth,
  upload.single('photo'),
  asyncHandler(userController.updateProfilePhoto),
);
router.delete('/me', requireAuth, asyncHandler(userController.deleteMe));
router.get('/:id', requireAuth, validate(userIdParamSchema, 'params'), asyncHandler(userController.getById));

export default router;
