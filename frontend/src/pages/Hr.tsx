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
  UserCheck
} from 'lucide-react';
import { AttendanceStatus, PayrollStatus } from '@forge-erp/shared';

interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  baseSalary: number;
}

interface Attendance {
  id: string;
  employee: Employee;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
}

interface PayrollRun {
  id: string;
  payrollPeriod: string;
  payDate: string;
  status: PayrollStatus;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  payslips: {
    id: string;
    employee: Employee;
    basePay: number;
    allowances: number;
    deductions: number;
    taxAmount: number;
    netPay: number;
  }[];
}

export const Hr: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'payroll'>('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState(true);

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
    joiningDate: new Date().toISOString().split('T')[0],
    baseSalary: 60000,
  });

  const [payrollForm, setPayrollForm] = useState({
    payrollPeriod: '2026-08',
    payDate: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, attRes, payRes] = await Promise.all([
        api.get('/hr/employees'),
        api.get('/hr/attendance'),
        api.get('/hr/payroll/runs'),
      ]);
      if (empRes.data?.success) setEmployees(empRes.data.data);
      if (attRes.data?.success) setAttendances(attRes.data.data);
      if (payRes.data?.success) setPayrollRuns(payRes.data.data);
    } catch (err) {
      console.error('Failed to load HR data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/hr/employees', { ...employeeForm, baseSalary: Number(employeeForm.baseSalary) });
      setShowEmployeeModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create employee');
    }
  };

  const handleCreatePayrollRun = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/hr/payroll/runs', payrollForm);
      setShowPayrollModal(false);
      fetchData();
      alert('Monthly payroll run generated successfully');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Payroll calculation failed');
    }
  };

  const handleApprovePayroll = async (id: string) => {
    try {
      await api.post(`/hr/payroll/runs/${id}/approve`);
      fetchData();
      alert('Payroll approved and locked');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Payroll approval failed');
    }
  };

  return (
    <div className="space-y-6">
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
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
          >
            <Banknote className="w-4 h-4 text-sky-400" />
            Run Monthly Payroll
          </button>
          <button
            onClick={() => setShowEmployeeModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/20 transition"
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
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'employees'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Employees ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'attendance'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Daily Attendance Logs ({attendances.length})
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'payroll'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Payroll Runs ({payrollRuns.length})
        </button>
      </div>

      {/* Employees Directory */}
      {activeTab === 'employees' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {employees.length === 0 ? (
            <div className="col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-500">
              No employees registered yet. Click "Add Employee" to create your team profile.
            </div>
          ) : (
            employees.map((emp) => (
              <div key={emp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm">
                    {emp.firstName[0]}
                    {emp.lastName[0]}
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 font-mono">
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
            ))
          )}
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
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No attendance logs recorded yet.
                  </td>
                </tr>
              ) : (
                attendances.map((att) => (
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
                    <td className="px-6 py-4 text-right font-mono text-slate-400">{att.checkIn || '09:00 AM'}</td>
                    <td className="px-6 py-4 text-right font-mono text-slate-400">{att.checkOut || '05:30 PM'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Payroll Runs */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {payrollRuns.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-500">
              No payroll runs generated yet. Click "Run Monthly Payroll" to calculate employee compensation.
            </div>
          ) : (
            payrollRuns.map((run) => (
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
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Approve & Lock
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                  <div className="bg-slate-800/40 p-3 rounded-lg">
                    <p className="text-xs text-slate-400">Total Gross Pay</p>
                    <p className="text-lg font-bold font-mono text-slate-100">${run.totalGross.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-800/40 p-3 rounded-lg">
                    <p className="text-xs text-slate-400">Total Tax & Deductions</p>
                    <p className="text-lg font-bold font-mono text-rose-400">${run.totalDeductions.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-800/40 p-3 rounded-lg">
                    <p className="text-xs text-slate-400">Total Net Disbursed</p>
                    <p className="text-lg font-bold font-mono text-emerald-400">${run.totalNet.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
