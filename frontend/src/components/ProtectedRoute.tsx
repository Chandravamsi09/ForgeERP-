import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '@forge-erp/shared';

interface ProtectedRouteProps {
  roles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading session...
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    const hasPermission = user.roles.some((role) => roles.includes(role));
    if (!hasPermission) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
          <div className="bg-slate-900 border border-red-500/20 p-8 rounded-xl max-w-md">
            <h2 className="text-xl font-bold text-red-400">403 Access Denied</h2>
            <p className="text-slate-400 text-sm mt-2">
              You do not have permission to access this module. Contact your organization administrator.
            </p>
          </div>
        </div>
      );
    }
  }

  return <Outlet />;
};
