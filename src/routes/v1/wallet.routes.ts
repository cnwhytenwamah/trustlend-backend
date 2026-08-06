import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { walletController } from '../../controllers/wallet.controller';
import { walletTransactionsQuerySchema } from '../../validators/wallet.validator';

const router = Router();

router.get('/wallet', requireAuth, asyncHandler(walletController.getBalance));

router.get(
  '/wallet/transactions',
  requireAuth,
  validate(walletTransactionsQuerySchema, 'query'),
  asyncHandler(walletController.getTransactions),
);

export default router;
