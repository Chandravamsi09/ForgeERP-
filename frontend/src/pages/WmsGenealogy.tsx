import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { QrCode, Search, Database, ArrowRightLeft, GitBranch, Box } from 'lucide-react';

export const WmsGenealogy: React.FC = () => {
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchBatch, setSearchBatch] = useState('');
  const [genealogyResult, setGenealogyResult] = useState<any | null>(null);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wms/ledger?limit=25');
      if (res.data.success) {
        setLedgerEntries(res.data.data.entries);
      }
    } catch (err) {
      console.error('Failed to fetch ledger', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTraceGenealogy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchBatch) return;

    try {
      const res = await api.get(`/wms/genealogy/${encodeURIComponent(searchBatch)}`);
      if (res.data.success) {
        setGenealogyResult(res.data.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Batch not found in genealogy database');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
          <Database className="w-7 h-7 text-indigo-400" />
          Advanced WMS & Bi-Directional Lot Genealogy
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Granular Bin/Rack storage locations, immutable FIFO inventory movements, and forward/backward genealogy recall trees.
        </p>
      </div>

      {/* Lot Genealogy Search Form */}
      <div className="card p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-xl">
        <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2 mb-4">
          <GitBranch className="w-5 h-5 text-indigo-400" />
          Bi-Directional Lot / Batch Recall Traceability
        </h2>
        <form onSubmit={handleTraceGenealogy} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Lot / Batch Number (e.g., LOT-2026-001)..."
              value={searchBatch}
              onChange={(e) => setSearchBatch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            Trace Genealogy
          </button>
        </form>
      </div>

      {/* Immutable Inventory Movements Ledger */}
      <div className="card bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
            Immutable Chronological Inventory Movements
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Movement Type</th>
                <th className="py-3.5 px-4">Product / SKU</th>
                <th className="py-3.5 px-4">Batch #</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Unit Cost</th>
                <th className="py-3.5 px-4">Total Cost</th>
                <th className="py-3.5 px-4">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading inventory ledger records...
                  </td>
                </tr>
              ) : ledgerEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No ledger transactions recorded.
                  </td>
                </tr>
              ) : (
                ledgerEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {entry.movementType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">{entry.product?.name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-300">{entry.batch?.batchNumber || '—'}</td>
                    <td className="py-3 px-4 font-semibold text-slate-100">{entry.quantity}</td>
                    <td className="py-3 px-4 text-slate-300">${entry.unitCost?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">${entry.totalCost?.toFixed(2)}</td>
                    <td className="py-3 px-4 font-bold text-sky-400">{entry.balanceAfter}</td>
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
