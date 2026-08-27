import { Router } from 'express';
import { SalesController } from './sales.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();

router.use(authenticateJWT);

// Customers
router.get('/customers', SalesController.getCustomers);
router.post(
  '/customers',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  SalesController.createCustomer
);

// Quotations
router.get('/quotations', SalesController.getQuotations);
router.post(
  '/quotations',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  SalesController.createQuotation
);

// Sales Orders
router.get('/orders', SalesController.getSalesOrders);
router.post(
  '/orders',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  SalesController.createSalesOrder
);
router.post(
  '/orders/:id/confirm',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  SalesController.confirmSalesOrder
);

// Invoices & Payments
router.get('/invoices', SalesController.getInvoices);
router.post(
  '/invoices',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.ACCOUNTANT),
  SalesController.createInvoice
);
router.post(
  '/payments',
  requireRoles(UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.MANAGER),
  SalesController.recordPayment
);

export default router;
