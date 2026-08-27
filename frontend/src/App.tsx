import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Inventory } from './pages/Inventory';
import { UserRole } from '@forge-erp/shared';

// Module placeholder components until their respective milestones
const DashboardHome = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-white">Manufacturing Overview</h1>
        <p className="text-sm text-slate-400">Welcome to ForgeERP System</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p className="text-xs text-slate-400 uppercase font-semibold">Total Stock Items</p>
        <p className="text-2xl font-bold text-sky-400 mt-2">1,248 Units</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p className="text-xs text-slate-400 uppercase font-semibold">Pending POs</p>
        <p className="text-2xl font-bold text-amber-400 mt-2">14 Orders</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p className="text-xs text-slate-400 uppercase font-semibold">Monthly Sales</p>
        <p className="text-2xl font-bold text-emerald-400 mt-2">$284,500</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p className="text-xs text-slate-400 uppercase font-semibold">Active Employees</p>
        <p className="text-2xl font-bold text-purple-400 mt-2">42 Staff</p>
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/procurement" element={<div className="text-slate-300">Procurement Module</div>} />
              <Route path="/sales" element={<div className="text-slate-300">Sales Order Module</div>} />
              
              <Route element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.MANAGER]} />}>
                <Route path="/finance" element={<div className="text-slate-300">Finance & Accounting</div>} />
              </Route>

              <Route element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.MANAGER]} />}>
                <Route path="/hr" element={<div className="text-slate-300">HR & Payroll</div>} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
