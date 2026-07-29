import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { damageClaimController } from '../../controllers/damageClaim.controller';
import { createDamageClaimSchema, rejectDamageClaimSchema, damageClaimIdParamSchema, adminListDamageClaimsQuerySchema, paginationQuerySchema,} from '../../validators/damageClaim.validator';

const router = Router();

router.post(
  '/damage-claims',
  requireAuth,
  upload.array('photos', 10),
  validate(createDamageClaimSchema),
  asyncHandler(damageClaimController.create),
);

router.get(
  '/damage-claims/my',
  requireAuth,
  validate(paginationQuerySchema, 'query'),
  asyncHandler(damageClaimController.myClaims),
);

router.get(
  '/admin/damage-claims',
  requireAuth,
  requireRole('admin'),
  validate(adminListDamageClaimsQuerySchema, 'query'),
  asyncHandler(damageClaimController.adminList),
);

router.patch(
  '/admin/damage-claims/:id/approve',
  requireAuth,
  requireRole('admin'),
  validate(damageClaimIdParamSchema, 'params'),
  asyncHandler(damageClaimController.approve),
);

router.patch(
  '/admin/damage-claims/:id/reject',
  requireAuth,
  requireRole('admin'),
  validate(damageClaimIdParamSchema, 'params'),
  validate(rejectDamageClaimSchema),
  asyncHandler(damageClaimController.reject),
);

export default router;
