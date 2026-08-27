import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Receipt,
  DollarSign,
  Users,
  LogOut,
  Building2,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '@forge-erp/shared';

export const DashboardLayout: React.FC = () => {
  const { user, tenant, logout, hasRole } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, visible: true },
    { name: 'Inventory', href: '/inventory', icon: Boxes, visible: true },
    { name: 'Procurement', href: '/procurement', icon: ShoppingCart, visible: true },
    { name: 'Sales Orders', href: '/sales', icon: Receipt, visible: true },
    { name: 'Finance & Accounting', href: '/finance', icon: DollarSign, visible: hasRole(UserRole.ADMIN) || hasRole(UserRole.ACCOUNTANT) || hasRole(UserRole.MANAGER) },
    { name: 'HR & Payroll', href: '/hr', icon: Users, visible: hasRole(UserRole.ADMIN) || hasRole(UserRole.MANAGER) },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-sky-400" />
          <span className="font-bold text-lg text-white">ForgeERP</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen`}
      >
        <div>
          {/* Tenant Logo / Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
              {tenant?.code?.substring(0, 2) || 'FE'}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white truncate max-w-[140px]">
                {tenant?.name || 'ForgeERP'}
              </h2>
              <p className="text-xs text-sky-400 font-mono">{tenant?.code || 'TENANT'}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navigation
              .filter((item) => item.visible)
              .map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-200">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-slate-500">{user?.roles?.join(', ')}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
