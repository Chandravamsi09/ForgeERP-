import { Router } from 'express';
import { WorkOrderController } from './workOrder.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();

router.use(authenticateJWT);

router.get('/orders', WorkOrderController.getWorkOrders);
router.post(
  '/orders',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  WorkOrderController.createWorkOrder
);
router.post(
  '/orders/:id/release',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  WorkOrderController.releaseWorkOrder
);
router.post(
  '/orders/:id/issue-material',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  WorkOrderController.issueMaterial
);
router.post(
  '/orders/:id/progress',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  WorkOrderController.logOperationProgress
);
router.post(
  '/downtime',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  WorkOrderController.logMachineDowntime
);

export default router;
