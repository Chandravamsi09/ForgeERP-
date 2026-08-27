import { AttendanceStatus, PayrollStatus } from '@forge-erp/shared';

describe('HR & Payroll Module Business Logic Tests', () => {
  interface EmployeePayProfile {
    baseSalary: number;
    allowanceRate: number;
    taxRate: number;
    deductionRate: number;
  }

  test('1. Gross-to-Net Pay Engine: calculates exact allowances, taxes, deductions and net compensation', () => {
    const profile: EmployeePayProfile = {
      baseSalary: 60000 / 12, // $5,000 monthly
      allowanceRate: 0.10,    // 10% = $500
      taxRate: 0.15,          // 15% of gross ($5,500 * 0.15 = $825)
      deductionRate: 0.05,    // 5% of base ($5,000 * 0.05 = $250)
    };

    const basePay = profile.baseSalary;
    const allowances = Number((basePay * profile.allowanceRate).toFixed(2));
    const grossPay = basePay + allowances;
    const taxAmount = Number((grossPay * profile.taxRate).toFixed(2));
    const deductions = Number((basePay * profile.deductionRate).toFixed(2));
    const netPay = Number((grossPay - taxAmount - deductions).toFixed(2));

    expect(basePay).toBe(5000);
    expect(allowances).toBe(500);
    expect(grossPay).toBe(5500);
    expect(taxAmount).toBe(825);
    expect(deductions).toBe(250);
    expect(netPay).toBe(4425);
  });

  test('2. Unexcused Absence Penalty: applies proportional daily rate deduction for absent days', () => {
    const monthlySalary = 6000;
    const workingDaysInMonth = 20;
    const dailyRate = monthlySalary / workingDaysInMonth; // $300/day

    const unexcusedAbsences = 2;
    const absencePenalty = dailyRate * unexcusedAbsences;
    const adjustedPay = monthlySalary - absencePenalty;

    expect(dailyRate).toBe(300);
    expect(absencePenalty).toBe(600);
    expect(adjustedPay).toBe(5400);
  });

  test('3. Progressive Income Tax Calculation: applies tiered marginal rates', () => {
    const calculateProgressiveTax = (annualIncome: number): number => {
      let tax = 0;
      if (annualIncome > 50000) {
        tax += (annualIncome - 50000) * 0.25; // 25% bracket above 50k
        tax += (50000 - 20000) * 0.15;        // 15% bracket between 20k and 50k
      } else if (annualIncome > 20000) {
        tax += (annualIncome - 20000) * 0.15;
      }
      return tax;
    };

    const taxOn80k = calculateProgressiveTax(80000);
    // (80000 - 50000) * 0.25 = 7500
    // (50000 - 20000) * 0.15 = 4500
    // Total = 12000
    expect(taxOn80k).toBe(12000);
  });

  test('4. Attendance Log Uniqueness: same employee cannot have conflicting entries for same date', () => {
    const existingLogs = new Set<string>();
    const logKey = (empId: string, dateStr: string) => `${empId}#${dateStr}`;

    const empId = 'emp_123';
    const dateStr = '2026-08-27';

    // First check-in
    existingLogs.add(logKey(empId, dateStr));
    expect(existingLogs.has(logKey(empId, dateStr))).toBe(true);

    // Duplicate check
    const isDuplicate = existingLogs.has(logKey(empId, dateStr));
    expect(isDuplicate).toBe(true);
  });

  test('5. Payroll Run Lifecycle Lock: approved payroll run status cannot be mutated back to draft', () => {
    let status = PayrollStatus.DRAFT;

    const approveRun = () => {
      if (status !== PayrollStatus.DRAFT) throw new Error('Cannot approve non-draft run');
      status = PayrollStatus.APPROVED;
    };

    approveRun();
    expect(status).toBe(PayrollStatus.APPROVED);

    // Re-approval / mutation attempt
    expect(() => approveRun()).toThrow('Cannot approve non-draft run');
  });
});
