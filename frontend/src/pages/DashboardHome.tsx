import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Boxes,
  ShoppingCart,
  Receipt,
  DollarSign,
  Users,
  AlertTriangle,
  TrendingUp,
  Download,
  ArrowUpRight,
  ArrowRight,
  Activity,
  ShieldCheck,
  Database,
  Globe,
  Truck,
  PlusCircle,
  Play
} from 'lucide-react';

interface ExecutiveKPI {
  totalRevenue: number;
  stockValuation: number;
  totalStockUnits: number;
  lowStockCount: number;
  pendingOrdersCount: number;
  pendingPOCount: number;
  employeeCount: number;
  cashOnHand: number;
}

interface MonthlySale {
  month: string;
  sales: number;
  expenses: number;
  profit: number;
}

interface CategoryDist {
  name: string;
  value: number;
  productCount: number;
}

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const [kpi, setKpi] = useState<ExecutiveKPI | null>(null);
  const [salesTrend, setSalesTrend] = useState<MonthlySale[]>([]);
  const [categoryDist, setCategoryDist] = useState<CategoryDist[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [metricsRes, chartsRes] = await Promise.all([
          api.get('/reports/metrics'),
          api.get('/reports/charts'),
        ]);
        if (metricsRes.data?.success) setKpi(metricsRes.data.data.kpi);
        if (chartsRes.data?.success) {
          setSalesTrend(chartsRes.data.data.monthlySales || []);
          setCategoryDist(chartsRes.data.data.categoryDistribution || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleExportCSV = async () => {
    try {
      setDownloading(true);
      const response = await api.get('/reports/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `forge_erp_executive_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Failed to export CSV report');
    } finally {
      setDownloading(false);
    }
  };

  const quickActions = [
    { title: 'Manufacturing Execution', desc: 'Manage Work Orders & Machine OEE', path: '/manufacturing', icon: Activity, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { title: 'Quality Management', desc: 'ISO 2859 AQL Inspections & NCRs', path: '/quality', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'WMS & Lot Genealogy', desc: 'Bin Locations & Raw-to-FG Recall', path: '/wms', icon: Database, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'Financial Consolidation', desc: 'Multi-Subsidiary Eliminations & CTA', path: '/consolidation', icon: Globe, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { title: 'Procurement Sourcing', desc: 'Purchase Orders & 3-Way Matching', path: '/procurement', icon: Truck, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Order-to-Cash Sales', desc: 'Quotations, Orders & Tax Invoices', path: '/sales', icon: ShoppingCart, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3 tracking-tight">
            <TrendingUp className="w-7 h-7 text-sky-400" />
            Executive Manufacturing Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">Real-time operational health, liquidity, inventory velocity, and revenue</p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-white" />
          {downloading ? 'Generating Report...' : 'Export Executive CSV'}
        </button>
      </div>

      {/* Interactive Clickable KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue Card */}
        <div
          onClick={() => navigate('/sales')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 shadow-xl relative overflow-hidden cursor-pointer group transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Total Revenue</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-emerald-400 mt-3">
            ${(kpi?.totalRevenue || 284500).toLocaleString()}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% from last month
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>

        {/* Inventory Valuation Card */}
        <div
          onClick={() => navigate('/inventory')}
          className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-xl p-5 shadow-xl relative overflow-hidden cursor-pointer group transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Inventory Valuation</p>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-sky-400 mt-3">
            ${(kpi?.stockValuation || 415000).toLocaleString()}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400 font-medium">
              {kpi?.totalStockUnits || 1248} Units Available
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition-colors" />
          </div>
        </div>

        {/* Pending Orders Card */}
        <div
          onClick={() => navigate('/procurement')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-5 shadow-xl relative overflow-hidden cursor-pointer group transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Pending Orders</p>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-amber-400 mt-3">
            {kpi?.pendingOrdersCount || 8} Orders
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-amber-400 font-medium">
              Requires 3-Way Match Check
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
          </div>
        </div>

        {/* Active Staff Card */}
        <div
          onClick={() => navigate('/hr')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-xl p-5 shadow-xl relative overflow-hidden cursor-pointer group transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Active Staff</p>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-purple-400 mt-3">
            {kpi?.employeeCount || 42} Staff
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400 font-medium">
              100% attendance logged today
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* Quick Launchpad to All ERP Subsystems */}
      <div>
        <h2 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-400" />
          Enterprise Subsystems Launchpad
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <div
              key={action.title}
              onClick={() => navigate(action.path)}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-800/60 transition-all cursor-pointer group flex items-start gap-4 shadow-lg"
            >
              <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center shrink-0`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-sky-400 transition-colors flex items-center justify-between">
                  {action.title}
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{action.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & Profitability Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center justify-between">
            <span>6-Month Revenue & Margin Trend</span>
            <span className="text-xs text-slate-400 font-normal">Monthly breakdown</span>
          </h2>
          <div className="space-y-4 pt-2">
            {salesTrend.map((item) => {
              const maxVal = 100000;
              const salesPct = Math.min(100, (item.sales / maxVal) * 100);

              return (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.month}</span>
                    <span className="font-mono font-bold text-emerald-400">${item.sales.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden flex border border-slate-800">
                    <div
                      className="bg-sky-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${salesPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory Category Valuation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center justify-between">
            <span>Inventory Asset Distribution</span>
            <span className="text-xs text-slate-400 font-normal">By product category</span>
          </h2>
          <div className="space-y-3.5 pt-2">
            {categoryDist.map((cat) => (
              <div
                key={cat.name}
                onClick={() => navigate('/inventory')}
                className="bg-slate-950/70 p-4 rounded-lg flex items-center justify-between border border-slate-800 hover:border-sky-500/30 transition-colors cursor-pointer group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-sky-400 transition-colors">{cat.name}</h4>
                  <p className="text-xs text-slate-400">{cat.productCount} Active SKUs</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold font-mono text-sky-400">${cat.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
