import { Response, NextFunction } from 'express';
import { HrService } from './hr.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { AttendanceStatus } from '@forge-erp/shared';
import { z } from 'zod';

const createEmployeeSchema = z.object({
  employeeCode: z.string().min(1, 'Employee code required'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  department: z.string().min(1, 'Department required'),
  designation: z.string().min(1, 'Designation required'),
  joiningDate: z.string().transform((val) => new Date(val)),
  baseSalary: z.number().positive('Base salary must be positive'),
  bankAccountNumber: z.string().optional(),
});

const logAttendanceSchema = z.object({
  employeeId: z.string().min(1),
  date: z.string().transform((val) => new Date(val)),
  status: z.nativeEnum(AttendanceStatus),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
});

const runPayrollSchema = z.object({
  payrollPeriod: z.string().min(4, 'Period format YYYY-MM required'),
  payDate: z.string().transform((val) => new Date(val)),
});

export class HrController {
  static async createEmployee(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createEmployeeSchema.parse(req.body);
      const result = await HrService.createEmployee(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployees(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await HrService.getEmployees(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async logAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = logAttendanceSchema.parse(req.body);
      const result = await HrService.logAttendance(req.tenantId!, dto);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { employeeId } = req.query;
      const result = await HrService.getAttendance(req.tenantId!, employeeId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createPayrollRun(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = runPayrollSchema.parse(req.body);
      const result = await HrService.calculateAndCreatePayrollRun(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async approvePayrollRun(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await HrService.approvePayrollRun(req.tenantId!, id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getPayrollRuns(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await HrService.getPayrollRuns(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
