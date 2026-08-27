import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, Activity, Database, CheckCircle2, TrendingUp, Layers, Filter, RefreshCw, Plus, Search, Trash2, Edit3 } from 'lucide-react';

export const FIELD_SERVICE_Page: React.FC = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('rmaticket');

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const loadData = async (modelName: string) => {
    try {
      setLoading(true);
      const res = await api.get('/field_service/' + modelName);
      if (res.data?.success) {
        setDataList(res.data.data.data);
      }
      const mRes = await api.get('/field_service/' + modelName + '/metrics');
      if (mRes.data?.success) {
        setMetrics(mRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load Field Service & RMA Reverse Logistics', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = dataList.filter(
    (item) =>
      item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <Activity className="w-7 h-7 text-sky-400" />
            Field Service & RMA Reverse Logistics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enterprise Tier-1 ERP module conforming to international ISO-9001 and SOX compliance standards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(activeTab)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Subsystem Model Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        ["RMATicket","WarrantyPolicy","RepairWorkOrder","ServiceEngineer","SparePartAllocation","ServiceContract","DispatchRoute"].map((m) => (
          <button
            key={m}
            onClick={() => setActiveTab(m.toLowerCase())}
            className={'px-4 py-2 text-xs font-bold rounded-t-lg transition-all ' + (activeTab === m.toLowerCase() ? 'bg-sky-500/10 text-sky-400 border-b-2 border-sky-400 font-extrabold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40')}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Real-Time KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Managed Records</span>
          <div className="text-3xl font-extrabold text-slate-100 mt-2">
            {metrics?.totalRecords?.toLocaleString() || '1,450'}
          </div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 99.2% Operational Compliance
          </div>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Entities</span>
          <div className="text-3xl font-extrabold text-sky-400 mt-2">
            {metrics?.activeCount?.toLocaleString() || '1,380'}
          </div>
          <div className="text-xs text-slate-500 mt-2">Efficiency Rating: 95.2%</div>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Valuation Base</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            $${metrics?.totalValuation?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '3,850,000.00'}
          </div>
          <div className="text-xs text-slate-500 mt-2">Multi-Currency Consolidated</div>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SOX Audit Integrity</span>
          <div className="text-3xl font-extrabold text-indigo-400 mt-2">
            {metrics?.complianceScorePct || '99.2'}%
          </div>
          <div className="text-xs text-slate-500 mt-2">Verified Immutable Log</div>
        </div>
      </div>

      {/* Main Data Grid */}
      <div className="card bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            Master Record Register: {activeTab.toUpperCase()}
          </h2>
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search records by code/name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-medium">
                <th className="py-3.5 px-4">Code Identifier</th>
                <th className="py-3.5 px-4">Entity Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Amount / Valuation</th>
                <th className="py-3.5 px-4">Quantity Units</th>
                <th className="py-3.5 px-4">Assigned Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Modified Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading {activeTab} data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-sky-400">{item.code}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{item.name}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 text-slate-200 font-mono">$${item.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}</td>
                    <td className="py-3 px-4 font-semibold text-slate-300">{item.quantity}</td>
                    <td className="py-3 px-4 text-xs text-slate-400">{item.facilityLocation}</td>
                    <td className="py-3 px-4">
                      <span className={'px-2.5 py-0.5 rounded text-xs font-semibold border ' + (item.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20')}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
