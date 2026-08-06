import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { analyticsController } from '../../controllers/analytics.controller';
import {
  analyticsDateRangeQuerySchema,
  topEquipmentQuerySchema,
} from '../../validators/analytics.validator';

const router = Router();

router.get(
  '/admin/analytics/dashboard',
  requireAuth,
  requireRole('admin'),
  asyncHandler(analyticsController.dashboard),
);

router.get(
  '/admin/analytics/revenue',
  requireAuth,
  requireRole('admin'),
  validate(analyticsDateRangeQuerySchema, 'query'),
  asyncHandler(analyticsController.revenue),
);

router.get(
  '/admin/analytics/bookings',
  requireAuth,
  requireRole('admin'),
  validate(analyticsDateRangeQuerySchema, 'query'),
  asyncHandler(analyticsController.bookings),
);

router.get(
  '/admin/analytics/users',
  requireAuth,
  requireRole('admin'),
  validate(analyticsDateRangeQuerySchema, 'query'),
  asyncHandler(analyticsController.users),
);

router.get(
  '/admin/analytics/equipment',
  requireAuth,
  requireRole('admin'),
  validate(topEquipmentQuerySchema, 'query'),
  asyncHandler(analyticsController.equipment),
);

export default router;
