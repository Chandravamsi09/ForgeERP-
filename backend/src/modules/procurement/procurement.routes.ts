import { Router } from 'express';
import { ProcurementController } from './procurement.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();

router.use(authenticateJWT);

// Vendors
router.get('/vendors', ProcurementController.getVendors);
router.post(
  '/vendors',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  ProcurementController.createVendor
);

// Purchase Orders
router.get('/purchase-orders', ProcurementController.getPurchaseOrders);
router.post(
  '/purchase-orders',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  ProcurementController.createPurchaseOrder
);
router.post(
  '/purchase-orders/:id/submit',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  ProcurementController.submitPurchaseOrder
);
router.post(
  '/purchase-orders/:id/approve',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  ProcurementController.approvePurchaseOrder
);

// Goods Received Notes (GRN)
router.post(
  '/grn',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  ProcurementController.createGRN
);

export default router;
