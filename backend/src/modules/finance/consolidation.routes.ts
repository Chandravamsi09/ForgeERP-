import { Router } from 'express';
import { ConsolidationController } from './consolidation.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();

router.use(authenticateJWT);

router.post(
  '/run',
  requireRoles(UserRole.ADMIN, UserRole.ACCOUNTANT),
  ConsolidationController.runConsolidation
);
router.get(
  '/trial-balance',
  requireRoles(UserRole.ADMIN, UserRole.ACCOUNTANT),
  ConsolidationController.getConsolidatedTrialBalance
);

export default router;
