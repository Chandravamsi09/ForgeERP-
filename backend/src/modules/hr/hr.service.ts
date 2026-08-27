import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';
import { AttendanceStatus, PayrollStatus } from '@forge-erp/shared';

export interface CreateEmployeeDto {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  designation: string;
  joiningDate: Date;
  baseSalary: number;
  bankAccountNumber?: string;
}

export interface LogAttendanceDto {
  employeeId: string;
  date: Date;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
}

export interface RunPayrollDto {
  payrollPeriod: string; // e.g. "2026-08"
  payDate: Date;
}

export class HrService {
  // Employee Master Records
  static async createEmployee(tenantId: string, dto: CreateEmployeeDto) {
    const existing = await prisma.employee.findFirst({
      where: {
        tenantId,
        OR: [{ employeeCode: dto.employeeCode }, { email: dto.email }],
      },
    });

    if (existing) {
      throw new AppError('Employee with this code or email already exists in this organization', 400);
    }

    return prisma.employee.create({
      data: { tenantId, ...dto },
    });
  }

  static async getEmployees(tenantId: string) {
    return prisma.employee.findMany({
      where: { tenantId },
      include: {
        _count: { select: { attendances: true, payslips: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Attendance Operations
  static async logAttendance(tenantId: string, dto: LogAttendanceDto) {
    const employee = await prisma.employee.findFirst({
      where: { id: dto.employeeId, tenantId },
    });

    if (!employee) throw new AppError('Employee not found', 404);

    const startOfDay = new Date(dto.date);
    startOfDay.setHours(0, 0, 0, 0);

    const existing = await prisma.attendance.findFirst({
      where: {
        tenantId,
        employeeId: dto.employeeId,
        date: startOfDay,
      },
    });

    if (existing) {
      return prisma.attendance.update({
        where: { id: existing.id },
        data: {
          status: dto.status,
          checkIn: dto.checkIn,
          checkOut: dto.checkOut,
        },
      });
    }

    return prisma.attendance.create({
      data: {
        tenantId,
        employeeId: dto.employeeId,
        date: startOfDay,
        status: dto.status,
        checkIn: dto.checkIn,
        checkOut: dto.checkOut,
      },
    });
  }

  static async getAttendance(tenantId: string, employeeId?: string) {
    const whereClause: any = { tenantId };
    if (employeeId) whereClause.employeeId = employeeId;

    return prisma.attendance.findMany({
      where: whereClause,
      include: { employee: true },
      orderBy: { date: 'desc' },
    });
  }

  // Payroll Calculation & Payslip Engine
  static async calculateAndCreatePayrollRun(tenantId: string, dto: RunPayrollDto) {
    const existing = await prisma.payrollRun.findFirst({
      where: { tenantId, payrollPeriod: dto.payrollPeriod },
    });

    if (existing) {
      throw new AppError(`Payroll for period '${dto.payrollPeriod}' has already been initiated`, 400);
    }

    const employees = await prisma.employee.findMany({ where: { tenantId } });
    if (employees.length === 0) {
      throw new AppError('No employees registered to process payroll', 400);
    }

    return prisma.$transaction(async (tx) => {
      let runGross = 0;
      let runDeductions = 0;
      let runNet = 0;

      const payslipRecords = [];

      for (const emp of employees) {
        const basePay = emp.baseSalary;
        const allowances = Number((basePay * 0.1).toFixed(2)); // Standard 10% Housing & Transport allowance

        // Progressive Tax Model (15% standard income bracket)
        const taxableGross = basePay + allowances;
        const taxAmount = Number((taxableGross * 0.15).toFixed(2));

        // Deductions (e.g. 5% Social Security)
        const deductions = Number((basePay * 0.05).toFixed(2));

        const netPay = Number((taxableGross - taxAmount - deductions).toFixed(2));

        runGross += taxableGross;
        runDeductions += taxAmount + deductions;
        runNet += netPay;

        payslipRecords.push({
          employeeId: emp.id,
          basePay,
          allowances,
          deductions,
          taxAmount,
          netPay,
          status: PayrollStatus.DRAFT,
        });
      }

      const payrollRun = await tx.payrollRun.create({
        data: {
          tenantId,
          payrollPeriod: dto.payrollPeriod,
          payDate: dto.payDate,
          status: PayrollStatus.DRAFT,
          totalGross: Number(runGross.toFixed(2)),
          totalDeductions: Number(runDeductions.toFixed(2)),
          totalNet: Number(runNet.toFixed(2)),
          payslips: {
            create: payslipRecords,
          },
        },
        include: {
          payslips: { include: { employee: true } },
        },
      });

      return payrollRun;
    });
  }

  static async approvePayrollRun(tenantId: string, payrollRunId: string) {
    const run = await prisma.payrollRun.findFirst({
      where: { id: payrollRunId, tenantId },
    });

    if (!run) throw new AppError('Payroll run not found', 404);
    if (run.status !== PayrollStatus.DRAFT) {
      throw new AppError('Only DRAFT payroll runs can be approved and processed', 400);
    }

    return prisma.$transaction(async (tx) => {
      await tx.payslip.updateMany({
        where: { payrollRunId: run.id },
        data: { status: PayrollStatus.APPROVED },
      });

      return tx.payrollRun.update({
        where: { id: run.id },
        data: { status: PayrollStatus.APPROVED },
        include: { payslips: { include: { employee: true } } },
      });
    });
  }

  static async getPayrollRuns(tenantId: string) {
    return prisma.payrollRun.findMany({
      where: { tenantId },
      include: {
        payslips: { include: { employee: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
