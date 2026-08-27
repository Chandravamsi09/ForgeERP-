import { Router } from 'express';
import { QualityController } from './quality.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();

router.use(authenticateJWT);

router.get('/inspections', QualityController.getInspections);
router.post(
  '/plans',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  QualityController.createInspectionPlan
);
router.post(
  '/inspections',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  QualityController.recordInspection
);
router.post(
  '/ncr',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  QualityController.raiseNCR
);
router.post(
  '/inspections/:inspectionId/coa',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  QualityController.generateCoA
);

export default router;
