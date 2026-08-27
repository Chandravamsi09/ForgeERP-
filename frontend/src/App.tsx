import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { DashboardHome } from './pages/DashboardHome';
import { Inventory } from './pages/Inventory';
import { Procurement } from './pages/Procurement';
import { Sales } from './pages/Sales';
import { Finance } from './pages/Finance';
import { Hr } from './pages/Hr';
import { Manufacturing } from './pages/Manufacturing';
import { QualityManagement } from './pages/QualityManagement';
import { WmsGenealogy } from './pages/WmsGenealogy';
import { ConsolidationDashboard } from './pages/ConsolidationDashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Monorepo ERP Workspace */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="manufacturing" element={<Manufacturing />} />
            <Route path="quality" element={<QualityManagement />} />
            <Route path="wms" element={<WmsGenealogy />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="procurement" element={<Procurement />} />
            <Route path="sales" element={<Sales />} />
            <Route path="finance" element={<Finance />} />
            <Route path="consolidation" element={<ConsolidationDashboard />} />
            <Route path="hr" element={<Hr />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
