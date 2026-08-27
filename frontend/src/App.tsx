import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';
import { Inventory } from './pages/Inventory';
import { Procurement } from './pages/Procurement';
import { Sales } from './pages/Sales';
import { Finance } from './pages/Finance';
import { Hr } from './pages/Hr';
import { UserRole } from '@forge-erp/shared';

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
              <Route path="/procurement" element={<Procurement />} />
              <Route path="/sales" element={<Sales />} />
              
              <Route element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.MANAGER]} />}>
                <Route path="/finance" element={<Finance />} />
              </Route>

              <Route element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.MANAGER]} />}>
                <Route path="/hr" element={<Hr />} />
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
