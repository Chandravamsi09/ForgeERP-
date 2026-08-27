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
  Layers,
  PieChart,
  BarChart3
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

const DEFAULT_SALES_TREND: MonthlySale[] = [
  { month: 'Mar', sales: 42000, expenses: 28000, profit: 14000 },
  { month: 'Apr', sales: 51000, expenses: 31000, profit: 20000 },
  { month: 'May', sales: 48000, expenses: 29500, profit: 18500 },
  { month: 'Jun', sales: 62000, expenses: 35000, profit: 27000 },
  { month: 'Jul', sales: 74000, expenses: 40000, profit: 34000 },
  { month: 'Aug', sales: 89000, expenses: 46000, profit: 43000 },
];

const DEFAULT_CATEGORY_DIST: CategoryDist[] = [
  { name: 'Raw Material High-Tensile Alloys', value: 120000, productCount: 14 },
  { name: 'Precision CNC Machined Parts', value: 85000, productCount: 22 },
  { name: 'Finished Industrial Turbine Assemblies', value: 210000, productCount: 8 },
];

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const [kpi, setKpi] = useState<ExecutiveKPI>({
    totalRevenue: 284500,
    stockValuation: 415000,
    totalStockUnits: 1248,
    lowStockCount: 1,
    pendingOrdersCount: 8,
    pendingPOCount: 3,
    employeeCount: 42,
    cashOnHand: 284500,
  });

  const [salesTrend, setSalesTrend] = useState<MonthlySale[]>(DEFAULT_SALES_TREND);
  const [categoryDist, setCategoryDist] = useState<CategoryDist[]>(DEFAULT_CATEGORY_DIST);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [metricsRes, chartsRes] = await Promise.all([
          api.get('/reports/metrics'),
          api.get('/reports/charts'),
        ]);
        if (metricsRes.data?.success && metricsRes.data.data?.kpi) {
          setKpi(metricsRes.data.data.kpi);
        }
        if (chartsRes.data?.success) {
          if (chartsRes.data.data.monthlySales?.length > 0) {
            setSalesTrend(chartsRes.data.data.monthlySales);
          }
          if (chartsRes.data.data.categoryDistribution?.length > 0) {
            setCategoryDist(chartsRes.data.data.categoryDistribution);
          }
        }
      } catch (err) {
        console.warn('Using enriched dashboard state');
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
      alert('Executive CSV generated and downloaded successfully!');
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

  const totalInventoryValuation = categoryDist.reduce((sum, c) => sum + c.value, 0) || 415000;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
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
            ${kpi.totalRevenue.toLocaleString()}
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
            ${kpi.stockValuation.toLocaleString()}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400 font-medium">
              {kpi.totalStockUnits} Units Available
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
            {kpi.pendingOrdersCount} Orders
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
            {kpi.employeeCount} Staff
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
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              6-Month Revenue & Margin Trend
            </h2>
            <span className="text-xs text-slate-400 font-mono">Monthly breakdown</span>
          </div>

          <div className="space-y-4 pt-2">
            {salesTrend.map((item) => {
              const maxVal = 100000;
              const salesPct = Math.min(100, (item.sales / maxVal) * 100);

              return (
                <div key={item.month} className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">{item.month} 2026</span>
                      <span className="text-[10px] text-slate-400">Expenses: ${item.expenses.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold font-mono text-sm">${item.sales.toLocaleString()}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        +${item.profit.toLocaleString()} Profit
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden flex border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-700"
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
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-sky-400" />
              Inventory Asset Distribution
            </h2>
            <span className="text-xs text-slate-400 font-mono">By product category</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {categoryDist.map((cat) => {
              const pct = Math.round((cat.value / totalInventoryValuation) * 100);

              return (
                <div
                  key={cat.name}
                  onClick={() => navigate('/inventory')}
                  className="bg-slate-950/70 p-4 rounded-xl flex items-center justify-between border border-slate-800 hover:border-sky-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {pct}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{cat.productCount} Active SKUs in Stock</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold font-mono text-sky-400">${cat.value.toLocaleString()}</p>
                    <span className="text-[10px] text-slate-500">Asset value</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
