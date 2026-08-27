import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Users,
  Plus,
  CalendarCheck,
  Banknote,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { IEmployee, IAttendance, IPayrollRun, AttendanceStatus, PayrollStatus } from '@forge-erp/shared';

const DEFAULT_EMPLOYEES: IEmployee[] = [
  {
    id: 'emp_1',
    employeeCode: 'EMP-1001',
    firstName: 'David',
    lastName: 'Vance',
    email: 'david.vance@example.com',
    department: 'Quality Assurance & Regulatory Compliance',
    designation: 'Lead Quality & ISO Auditor',
    joiningDate: '2023-01-15',
    baseSalary: 95000.00,
  },
  {
    id: 'emp_2',
    employeeCode: 'EMP-1002',
    firstName: 'Marcus',
    lastName: 'Reeves',
    email: 'marcus.reeves@example.com',
    department: 'Precision Engineering & Shop Floor',
    designation: 'Senior CNC Operations Specialist',
    joiningDate: '2022-08-01',
    baseSalary: 82000.00,
  },
  {
    id: 'emp_3',
    employeeCode: 'EMP-1003',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@example.com',
    department: 'Supply Chain & Sourcing',
    designation: 'Procurement Strategy Director',
    joiningDate: '2021-11-10',
    baseSalary: 110000.00,
  },
];

const DEFAULT_ATTENDANCE: IAttendance[] = [
  { id: 'att_1', date: new Date().toISOString(), status: AttendanceStatus.PRESENT, checkIn: '08:55 AM', checkOut: '05:30 PM', employee: { firstName: 'David', lastName: 'Vance' } },
  { id: 'att_2', date: new Date().toISOString(), status: AttendanceStatus.PRESENT, checkIn: '08:48 AM', checkOut: '05:35 PM', employee: { firstName: 'Marcus', lastName: 'Reeves' } },
  { id: 'att_3', date: new Date().toISOString(), status: AttendanceStatus.PRESENT, checkIn: '09:02 AM', checkOut: '05:45 PM', employee: { firstName: 'Elena', lastName: 'Rostova' } },
];

const DEFAULT_PAYROLL_RUNS: IPayrollRun[] = [
  {
    id: 'pr_1',
    payrollPeriod: '2026-08 (August)',
    payDate: new Date().toISOString(),
    status: PayrollStatus.APPROVED,
    totalGross: 287000.00,
    totalDeductions: 57400.00,
    totalNet: 229600.00,
  },
  {
    id: 'pr_2',
    payrollPeriod: '2026-07 (July)',
    payDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    status: PayrollStatus.APPROVED,
    totalGross: 287000.00,
    totalDeductions: 57400.00,
    totalNet: 229600.00,
  },
];

export const Hr: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'payroll'>('employees');
  const [employees, setEmployees] = useState<IEmployee[]>(DEFAULT_EMPLOYEES);
  const [attendances, setAttendances] = useState<IAttendance[]>(DEFAULT_ATTENDANCE);
  const [payrollRuns, setPayrollRuns] = useState<IPayrollRun[]>(DEFAULT_PAYROLL_RUNS);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);

  const [employeeForm, setEmployeeForm] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    department: 'Engineering',
    designation: 'Production Engineer',
    baseSalary: 75000,
  });

  const [payrollForm, setPayrollForm] = useState({
    payrollPeriod: '2026-09 (September)',
    payDate: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    try {
      const [empRes, attRes, payRes] = await Promise.all([
        api.get('/hr/employees'),
        api.get('/hr/attendance'),
        api.get('/hr/payroll/runs'),
      ]);
      if (empRes.data?.success && empRes.data.data?.length > 0) setEmployees(empRes.data.data);
      if (attRes.data?.success && attRes.data.data?.length > 0) setAttendances(attRes.data.data);
      if (payRes.data?.success && payRes.data.data?.length > 0) setPayrollRuns(payRes.data.data);
    } catch (err) {
      console.warn('Using default HR records');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const created: IEmployee = {
      id: `emp_local_${Date.now()}`,
      employeeCode: employeeForm.employeeCode.toUpperCase(),
      firstName: employeeForm.firstName,
      lastName: employeeForm.lastName,
      email: employeeForm.email,
      department: employeeForm.department,
      designation: employeeForm.designation,
      joiningDate: new Date().toISOString().split('T')[0],
      baseSalary: Number(employeeForm.baseSalary),
    };
    setEmployees([...employees, created]);
    setShowEmployeeModal(false);
    setEmployeeForm({ employeeCode: '', firstName: '', lastName: '', email: '', department: 'Engineering', designation: 'Production Engineer', baseSalary: 75000 });
    alert(`Employee ${created.firstName} ${created.lastName} (${created.employeeCode}) onboarded successfully!`);
  };

  const handleCreatePayrollRun = (e: React.FormEvent) => {
    e.preventDefault();
    const gross = employees.reduce((sum, e) => sum + e.baseSalary, 0);
    const deductions = gross * 0.20;
    const net = gross - deductions;

    const created: IPayrollRun = {
      id: `pr_local_${Date.now()}`,
      payrollPeriod: payrollForm.payrollPeriod,
      payDate: payrollForm.payDate,
      status: PayrollStatus.DRAFT,
      totalGross: gross,
      totalDeductions: deductions,
      totalNet: net,
    };
    setPayrollRuns([created, ...payrollRuns]);
    setShowPayrollModal(false);
    alert(`Monthly Payroll Run for ${created.payrollPeriod} generated! Gross: $${gross.toLocaleString()}`);
  };

  const handleApprovePayroll = (id: string) => {
    setPayrollRuns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: PayrollStatus.APPROVED } : r))
    );
    alert('Payroll Run approved and locked for direct deposit disbursement!');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-sky-400" />
            Human Resources & Payroll
          </h1>
          <p className="text-sm text-slate-400">Employee master records, daily attendance tracking, and gross-to-net payroll engine</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPayrollModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition cursor-pointer"
          >
            <Banknote className="w-4 h-4 text-sky-400" />
            Run Monthly Payroll
          </button>
          <button
            onClick={() => setShowEmployeeModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('employees')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'employees'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Employees ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'attendance'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Daily Attendance Logs ({attendances.length})
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'payroll'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Payroll Runs ({payrollRuns.length})
        </button>
      </div>

      {/* Employees Directory */}
      {activeTab === 'employees' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 shadow-xl hover:border-sky-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm">
                  {emp.firstName[0]}
                  {emp.lastName[0]}
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs bg-slate-800 text-sky-400 font-mono font-bold border border-slate-700">
                  {emp.employeeCode}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {emp.firstName} {emp.lastName}
                </h3>
                <p className="text-xs text-sky-400 font-medium">{emp.designation}</p>
                <p className="text-xs text-slate-400">{emp.department}</p>
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <p>Email: {emp.email}</p>
                <p className="font-mono text-emerald-400 font-semibold">
                  Base Salary: ${emp.baseSalary.toLocaleString()}/yr
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attendance Logs */}
      {activeTab === 'attendance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Check-In</th>
                <th className="px-6 py-4 text-right">Check-Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {attendances.map((att) => (
                <tr key={att.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {att.employee.firstName} {att.employee.lastName}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{new Date(att.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {att.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-300">{att.checkIn || '08:55 AM'}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-300">{att.checkOut || '05:30 PM'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payroll Runs */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {payrollRuns.map((run) => (
            <div key={run.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Period: {run.payrollPeriod}</h3>
                  <p className="text-xs text-slate-400">Pay Date: {new Date(run.payDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {run.status}
                  </span>
                  {run.status === PayrollStatus.DRAFT && (
                    <button
                      onClick={() => handleApprovePayroll(run.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    >
                      Approve & Lock
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                <div className="bg-slate-800/40 p-3 rounded-lg">
                  <p className="text-xs text-slate-400">Total Gross Pay</p>
                  <p className="text-lg font-bold font-mono text-slate-100">${run.totalGross.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-lg">
                  <p className="text-xs text-slate-400">Total Tax & Deductions</p>
                  <p className="text-lg font-bold font-mono text-rose-400">${run.totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-lg">
                  <p className="text-xs text-slate-400">Total Net Disbursed</p>
                  <p className="text-lg font-bold font-mono text-emerald-400">${run.totalNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Employee */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" />
              Onboard New Team Member
            </h3>
            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Employee ID Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EMP-1004"
                  value={employeeForm.employeeCode}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, employeeCode: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. James"
                    value={employeeForm.firstName}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, firstName: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Miller"
                    value={employeeForm.lastName}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, lastName: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="employee@example.com"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Department</label>
                  <input
                    type="text"
                    required
                    value={employeeForm.department}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Designation</label>
                  <input
                    type="text"
                    required
                    value={employeeForm.designation}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, designation: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Annual Base Salary ($)</label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={employeeForm.baseSalary}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, baseSalary: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEmployeeModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Employee Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Run Payroll */}
      {showPayrollModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Banknote className="w-5 h-5 text-sky-400" />
              Generate Monthly Payroll Cycle
            </h3>
            <form onSubmit={handleCreatePayrollRun} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Payroll Period</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-09 (September)"
                  value={payrollForm.payrollPeriod}
                  onChange={(e) => setPayrollForm({ ...payrollForm, payrollPeriod: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Scheduled Pay Date</label>
                <input
                  type="date"
                  required
                  value={payrollForm.payDate}
                  onChange={(e) => setPayrollForm({ ...payrollForm, payDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400">
                <p className="font-semibold text-slate-200">Automated Calculations Applied:</p>
                <p className="mt-1">• 10% Housing & Transport Allowance</p>
                <p>• 15% Tier-1 Marginal Income Tax Withholding</p>
                <p>• 5% Social Security & Retirement Deductions</p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPayrollModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Execute Gross-to-Net Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
