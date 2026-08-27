import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  ShoppingCart,
  Receipt,
  Users,
  LogOut,
  Shield,
  Activity,
  ShieldCheck,
  Database,
  Globe,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Manufacturing & OEE', path: '/manufacturing', icon: Activity },
    { label: 'Quality & NCR', path: '/quality', icon: ShieldCheck },
    { label: 'WMS & Lot Genealogy', path: '/wms', icon: Database },
    { label: 'Inventory & Warehouses', path: '/inventory', icon: Boxes },
    { label: 'Procurement & 3-Way Match', path: '/procurement', icon: Truck },
    { label: 'Sales & Order-to-Cash', path: '/sales', icon: ShoppingCart },
    { label: 'Finance & Accounting', path: '/finance', icon: Receipt },
    { label: 'Consolidation & CTA', path: '/consolidation', icon: Globe },
    { label: 'HR & Advanced Payroll', path: '/hr', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-sky-500/20">
              F
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">ForgeERP</span>
              <span className="text-[10px] text-sky-400 font-mono tracking-widest block uppercase font-bold">Tier-1 Enterprise</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-sky-400">
                {user?.firstName?.[0] || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 font-mono uppercase font-bold truncate">
                  <Shield className="w-2.5 h-2.5 text-sky-400" />
                  {user?.roles?.[0] || 'USER'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-950">
        <div className="p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
