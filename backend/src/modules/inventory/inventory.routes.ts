import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();

// Apply JWT authentication to all inventory endpoints
router.use(authenticateJWT);

// Categories
router.get('/categories', InventoryController.getCategories);
router.post(
  '/categories',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  InventoryController.createCategory
);

// Products
router.get('/products', InventoryController.getProducts);
router.post(
  '/products',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  InventoryController.createProduct
);

// Warehouses
router.get('/warehouses', InventoryController.getWarehouses);
router.post(
  '/warehouses',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  InventoryController.createWarehouse
);

// Stock Adjustments & Transfers
router.post(
  '/adjust',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  InventoryController.adjustStock
);
router.post(
  '/transfers',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  InventoryController.createStockTransfer
);
router.post(
  '/transfers/:id/complete',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  InventoryController.completeStockTransfer
);

// Low-stock alerts
router.get('/alerts/low-stock', InventoryController.getLowStockAlerts);

export default router;
