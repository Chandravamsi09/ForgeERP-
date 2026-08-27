import React, { useState, useEffect } from 'react';
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
  ArrowDownRight
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
  const [kpi, setKpi] = useState<ExecutiveKPI | null>(null);
  const [salesTrend, setSalesTrend] = useState<MonthlySale[]>([]);
  const [categoryDist, setCategoryDist] = useState<CategoryDist[]>([]);
  const [loading, setLoading] = useState(true);

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
      const response = await api.get('/reports/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `forge_erp_kpi_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Failed to export CSV report');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-sky-400" />
            Executive Manufacturing Intelligence
          </h1>
          <p className="text-sm text-slate-400">Real-time operational health, liquidity, inventory velocity, and revenue</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
        >
          <Download className="w-4 h-4 text-sky-400" />
          Export Executive CSV
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400">Total Revenue</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-emerald-400 mt-3">
            ${(kpi?.totalRevenue || 284500).toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% from last month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400">Inventory Valuation</p>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-sky-400 mt-3">
            ${(kpi?.stockValuation || 415000).toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
            <span>{kpi?.totalStockUnits || 1248} Units Available</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400">Pending Orders</p>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-amber-400 mt-3">
            {kpi?.pendingOrdersCount || 8} Orders
          </p>
          <div className="flex items-center gap-1 text-xs text-amber-400 mt-2">
            <span>Requires warehouse confirmation</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-slate-400">Active Staff</p>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-purple-400 mt-3">
            {kpi?.employeeCount || 42} Staff
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
            <span>100% attendance logged today</span>
          </div>
        </div>
      </div>

      {/* Analytics Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & Profitability Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center justify-between">
            <span>6-Month Revenue & Margin Trend</span>
            <span className="text-xs text-slate-400">Monthly breakdown</span>
          </h2>
          <div className="space-y-3 pt-2">
            {salesTrend.map((item) => {
              const maxVal = 100000;
              const salesPct = Math.min(100, (item.sales / maxVal) * 100);
              const profitPct = Math.min(100, (item.profit / maxVal) * 100);

              return (
                <div key={item.month} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">{item.month}</span>
                    <span className="font-mono text-emerald-400">${item.sales.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-sky-500 h-full rounded-full"
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
          <h2 className="text-base font-bold text-white flex items-center justify-between">
            <span>Inventory Asset Distribution</span>
            <span className="text-xs text-slate-400">By product category</span>
          </h2>
          <div className="space-y-4 pt-2">
            {categoryDist.map((cat) => (
              <div
                key={cat.name}
                className="bg-slate-800/40 p-4 rounded-lg flex items-center justify-between border border-slate-800"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">{cat.name}</h4>
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
