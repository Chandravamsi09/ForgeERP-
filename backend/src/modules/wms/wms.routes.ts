import { Router } from 'express';
import { WMSController } from './wms.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();

router.use(authenticateJWT);

router.get('/ledger', WMSController.getInventoryLedger);
router.post(
  '/bins',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  WMSController.createBin
);
router.post(
  '/putaway',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  WMSController.putawayStock
);
router.post(
  '/genealogy/link',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  WMSController.linkGenealogy
);
router.get(
  '/genealogy/:batchNumber',
  WMSController.traceGenealogy
);

export default router;
