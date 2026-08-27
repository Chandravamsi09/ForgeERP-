import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Play, Pause, AlertTriangle, CheckCircle, Clock, Settings, Layers, Activity } from 'lucide-react';

export const Manufacturing: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWO, setSelectedWO] = useState<any | null>(null);

  // OEE Live metrics demo state
  const [oeeStats] = useState({
    availability: 91.2,
    performance: 88.5,
    quality: 96.8,
    overallOee: 78.1,
    mtbfHours: 48.5,
    mttrHours: 1.2,
  });

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/manufacturing/orders');
      if (res.data.success) {
        setWorkOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch work orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseWO = async (woId: string) => {
    try {
      await api.post(`/manufacturing/orders/${woId}/release`);
      fetchWorkOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to release work order');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <Activity className="w-7 h-7 text-sky-400" />
            Manufacturing Execution & Shop Floor Control
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time Work Order routing dispatching, BOM recursive consumption, and ISO 22400 OEE analytics.
          </p>
        </div>
      </div>

      {/* Real-Time Machine OEE KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall OEE</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400">EXCELLENT</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-100 mt-3">{oeeStats.overallOee}%</div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${oeeStats.overallOee}%` }}></div>
          </div>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Availability</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-sky-400 mt-3">{oeeStats.availability}%</div>
          <div className="text-xs text-slate-500 mt-2">Planned: 480m | Downtime: 42m</div>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Performance Rate</span>
            <Play className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-3">{oeeStats.performance}%</div>
          <div className="text-xs text-slate-500 mt-2">Speed: 110/120 standard units/hr</div>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quality Yield</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-3">{oeeStats.quality}%</div>
          <div className="text-xs text-slate-500 mt-2">Scrap Rate: 3.2% total parts</div>
        </div>
      </div>

      {/* Work Orders Master Table */}
      <div className="card bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            Active Production Work Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                <th className="py-3.5 px-4">WO Number</th>
                <th className="py-3.5 px-4">Product / SKU</th>
                <th className="py-3.5 px-4">Target Qty</th>
                <th className="py-3.5 px-4">Completed</th>
                <th className="py-3.5 px-4">Scrap</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading shop-floor work orders...
                  </td>
                </tr>
              ) : workOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No work orders found. Create a new Work Order from the BOM planner.
                  </td>
                </tr>
              ) : (
                workOrders.map((wo) => (
                  <tr key={wo.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-sky-400">{wo.woNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {wo.product?.name} <span className="text-xs text-slate-500 block">[{wo.product?.sku}]</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100">{wo.targetQuantity}</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">{wo.completedQuantity}</td>
                    <td className="py-3 px-4 text-rose-400">{wo.scrappedQuantity}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {wo.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {wo.status === 'DRAFT' && (
                        <button
                          onClick={() => handleReleaseWO(wo.id)}
                          className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-medium transition-colors"
                        >
                          Release to Floor
                        </button>
                      )}
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
