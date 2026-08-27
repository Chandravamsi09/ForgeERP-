import { Router } from 'express';
import { HrController } from './hr.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();

router.use(authenticateJWT);

// Employee Master Data
router.get('/employees', HrController.getEmployees);
router.post(
  '/employees',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  HrController.createEmployee
);

// Attendance Tracking
router.get('/attendance', HrController.getAttendance);
router.post(
  '/attendance',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  HrController.logAttendance
);

// Payroll Processing
router.get(
  '/payroll/runs',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  HrController.getPayrollRuns
);
router.post(
  '/payroll/runs',
  requireRoles(UserRole.ADMIN, UserRole.MANAGER),
  HrController.createPayrollRun
);
router.post(
  '/payroll/runs/:id/approve',
  requireRoles(UserRole.ADMIN),
  HrController.approvePayrollRun
);

export default router;
