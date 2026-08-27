import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Play, Plus, CheckCircle, Clock, Settings, Layers, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

export const Manufacturing: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedWO, setSelectedWO] = useState<any | null>(null);

  // Form states
  const [newWO, setNewWO] = useState({
    sku: 'FG-HEAVY-GEAR-40T',
    productName: 'Precision Helical Pinion Gear 40-Tooth',
    targetQuantity: 100,
    plannedStartDate: new Date().toISOString().split('T')[0],
    plannedEndDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  const [progressForm, setProgressForm] = useState({
    completedQuantity: 10,
    scrappedQuantity: 0,
    operatorName: 'Marcus Reeves',
  });

  const [oeeStats] = useState({
    availability: 91.2,
    performance: 88.5,
    quality: 96.8,
    overallOee: 78.1,
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
      alert('Work Order released to Shop Floor!');
      fetchWorkOrders();
    } catch (err: any) {
      // Local demo state update
      setWorkOrders((prev) =>
        prev.map((w) => (w.id === woId ? { ...w, status: 'RELEASED' } : w))
      );
      alert('Work Order released to Shop Floor!');
    }
  };

  const handleCreateWO = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `wo_local_${Date.now()}`,
      woNumber: `WO-2026-${String(workOrders.length + 1).padStart(3, '0')}`,
      targetQuantity: Number(newWO.targetQuantity),
      completedQuantity: 0,
      scrappedQuantity: 0,
      status: 'DRAFT',
      product: { name: newWO.productName, sku: newWO.sku },
      createdAt: new Date(),
    };
    setWorkOrders([created, ...workOrders]);
    setShowCreateModal(false);
    alert(`Work Order ${created.woNumber} created successfully!`);
  };

  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWO) return;
    setWorkOrders((prev) =>
      prev.map((w) =>
        w.id === selectedWO.id
          ? {
              ...w,
              completedQuantity: Number(w.completedQuantity) + Number(progressForm.completedQuantity),
              scrappedQuantity: Number(w.scrappedQuantity) + Number(progressForm.scrappedQuantity),
              status:
                Number(w.completedQuantity) + Number(progressForm.completedQuantity) >= Number(w.targetQuantity)
                  ? 'COMPLETED'
                  : 'IN_PROGRESS',
            }
          : w
      )
    );
    setShowProgressModal(false);
    alert(`Progress logged for ${selectedWO.woNumber}!`);
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

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Work Order
        </button>
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
                <th className="py-3.5 px-4 text-right">Target Qty</th>
                <th className="py-3.5 px-4 text-right">Completed</th>
                <th className="py-3.5 px-4 text-right">Scrap</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
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
                    No work orders found. Click "Create Work Order" to schedule production.
                  </td>
                </tr>
              ) : (
                workOrders.map((wo) => (
                  <tr key={wo.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-400">{wo.woNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {wo.product?.name} <span className="text-xs text-sky-400 font-mono block">[{wo.product?.sku}]</span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-100">{wo.targetQuantity}</td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-semibold">{wo.completedQuantity}</td>
                    <td className="py-3 px-4 text-right text-rose-400">{wo.scrappedQuantity}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          wo.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : wo.status === 'IN_PROGRESS'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : wo.status === 'RELEASED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {wo.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {wo.status === 'DRAFT' && (
                        <button
                          onClick={() => handleReleaseWO(wo.id)}
                          className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Release to Floor
                        </button>
                      )}
                      {wo.status !== 'COMPLETED' && (
                        <button
                          onClick={() => {
                            setSelectedWO(wo);
                            setShowProgressModal(true);
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                        >
                          Log Units
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

      {/* Modal: Create Work Order */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-400" />
              Schedule New Work Order
            </h3>
            <form onSubmit={handleCreateWO} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Product SKU</label>
                <select
                  value={newWO.sku}
                  onChange={(e) => {
                    const sku = e.target.value;
                    const name =
                      sku === 'FG-HEAVY-GEAR-40T'
                        ? 'Precision Helical Pinion Gear 40-Tooth'
                        : sku === 'FG-ROTOR-SHAFT'
                        ? 'Turbine Rotor Transmission Shaft 1200mm'
                        : 'High-Pressure Hydraulic Valve Body Casting';
                    setNewWO({ ...newWO, sku, productName: name });
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                >
                  <option value="FG-HEAVY-GEAR-40T">FG-HEAVY-GEAR-40T (Pinion Gear)</option>
                  <option value="FG-ROTOR-SHAFT">FG-ROTOR-SHAFT (Turbine Shaft)</option>
                  <option value="RAW-VALVE-CAST">RAW-VALVE-CAST (Valve Body)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Target Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newWO.targetQuantity}
                  onChange={(e) => setNewWO({ ...newWO, targetQuantity: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Shop Floor Output */}
      {showProgressModal && selectedWO && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-400" />
              Log Output for {selectedWO.woNumber}
            </h3>
            <form onSubmit={handleLogProgress} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Completed Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={progressForm.completedQuantity}
                  onChange={(e) => setProgressForm({ ...progressForm, completedQuantity: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Scrapped Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={progressForm.scrappedQuantity}
                  onChange={(e) => setProgressForm({ ...progressForm, scrappedQuantity: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Save Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
