import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { QrCode, Search, Database, ArrowRightLeft, GitBranch, Box, Plus, CheckCircle, ArrowDown } from 'lucide-react';

export const WmsGenealogy: React.FC = () => {
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchBatch, setSearchBatch] = useState('LOT-2026-001');
  const [genealogyResult, setGenealogyResult] = useState<any | null>(null);
  const [showMovementModal, setShowMovementModal] = useState(false);

  const [movementForm, setMovementForm] = useState({
    movementType: 'GRN_RECEIPT',
    productName: '4140 Chrome-Moly Alloy Steel Bar 65mm',
    batchNumber: 'LOT-2026-003',
    quantity: 500,
    unitCost: 12.50,
  });

  useEffect(() => {
    fetchLedger();
    runGenealogyTrace('LOT-2026-001');
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

  const runGenealogyTrace = (batch: string) => {
    setGenealogyResult({
      targetBatch: {
        batchNumber: batch,
        product: { name: 'Precision Helical Pinion Gear 40-Tooth', sku: 'FG-HEAVY-GEAR-40T' },
        status: 'RELEASED',
        currentQuantity: 85,
      },
      rawMaterialAncestry: [
        { batchNumber: 'LOT-RAW-4140-99', name: '4140 Chrome-Moly Alloy Steel Bar', heatNumber: 'HT-883921', vendor: 'Global Special Steel Ltd' },
        { batchNumber: 'LOT-CHEM-COAT-12', name: 'Anti-Corrosion Nitride Coating Bath', heatNumber: 'CHEM-4410', vendor: 'AeroAlloy Foundries' },
      ],
      dispatchedOrders: [
        { orderNumber: 'SO-2026-001', customer: 'AeroTech Commercial Aircraft Systems Corp', units: 15, date: '2026-08-26' },
      ],
    });
  };

  const handleTraceGenealogy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchBatch) return;
    runGenealogyTrace(searchBatch);
  };

  const handleRecordMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(movementForm.quantity);
    const cost = Number(movementForm.unitCost);
    const newEntry = {
      id: `led_local_${Date.now()}`,
      timestamp: new Date(),
      movementType: movementForm.movementType,
      product: { name: movementForm.productName },
      batch: { batchNumber: movementForm.batchNumber },
      quantity: qty,
      unitCost: cost,
      totalCost: qty * cost,
      balanceAfter: 2350,
    };
    setLedgerEntries([newEntry, ...ledgerEntries]);
    setShowMovementModal(false);
    alert(`Movement '${movementForm.movementType}' logged successfully!`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <Database className="w-7 h-7 text-indigo-400" />
            Advanced WMS & Bi-Directional Lot Genealogy
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Granular Bin/Rack storage locations, immutable FIFO inventory movements, and forward/backward genealogy recall trees.
          </p>
        </div>

        <button
          onClick={() => setShowMovementModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Record Inventory Movement
        </button>
      </div>

      {/* Lot Genealogy Search Form */}
      <div className="card p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-xl space-y-5">
        <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
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
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Trace Genealogy
          </button>
        </form>

        {/* Visual Genealogy Recall Tree */}
        {genealogyResult && (
          <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/20 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-indigo-400 uppercase font-semibold">Inspected Finished Lot</span>
                <h4 className="text-base font-bold text-white font-mono">{genealogyResult.targetBatch.batchNumber}</h4>
                <p className="text-xs text-slate-400">{genealogyResult.targetBatch.product.name}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {genealogyResult.targetBatch.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Backward Trace (Raw Materials) */}
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                  Backward Trace: Raw Material Heat Stocks
                </h5>
                <div className="space-y-2">
                  {genealogyResult.rawMaterialAncestry.map((raw: any) => (
                    <div key={raw.batchNumber} className="text-xs p-2 bg-slate-950 rounded border border-slate-800/80">
                      <p className="font-mono text-sky-400 font-bold">{raw.batchNumber}</p>
                      <p className="text-slate-300">{raw.name}</p>
                      <p className="text-[10px] text-slate-500">Heat: {raw.heatNumber} | {raw.vendor}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forward Trace (Customer Shipments) */}
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Forward Trace: Customer Shipments
                </h5>
                <div className="space-y-2">
                  {genealogyResult.dispatchedOrders.map((so: any) => (
                    <div key={so.orderNumber} className="text-xs p-2 bg-slate-950 rounded border border-slate-800/80">
                      <p className="font-mono text-emerald-400 font-bold">{so.orderNumber}</p>
                      <p className="text-slate-300">{so.customer}</p>
                      <p className="text-[10px] text-slate-500">Dispatched: {so.units} Units on {so.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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
                <th className="py-3.5 px-4 text-right">Quantity</th>
                <th className="py-3.5 px-4 text-right">Unit Cost</th>
                <th className="py-3.5 px-4 text-right">Total Cost</th>
                <th className="py-3.5 px-4 text-center">Balance After</th>
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
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {entry.movementType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">{entry.product?.name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-sky-400">{entry.batch?.batchNumber || 'LOT-2026-001'}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-100">{entry.quantity}</td>
                    <td className="py-3 px-4 text-right text-slate-300">${entry.unitCost?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-semibold">${entry.totalCost?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center font-bold text-sky-400">{entry.balanceAfter}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Inventory Movement */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Log Inventory Movement
            </h3>
            <form onSubmit={handleRecordMovement} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Movement Type</label>
                <select
                  value={movementForm.movementType}
                  onChange={(e) => setMovementForm({ ...movementForm, movementType: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                >
                  <option value="GRN_RECEIPT">GRN_RECEIPT (Inward Vendor Stock)</option>
                  <option value="PRODUCTION_ISSUE">PRODUCTION_ISSUE (To Shop Floor)</option>
                  <option value="PRODUCTION_RECEIPT">PRODUCTION_RECEIPT (From Shop Floor)</option>
                  <option value="DISPATCH_DELIVERY">DISPATCH_DELIVERY (Customer Order)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Batch / Lot Number</label>
                <input
                  type="text"
                  required
                  value={movementForm.batchNumber}
                  onChange={(e) => setMovementForm({ ...movementForm, batchNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Quantity</label>
                  <input
                    type="number"
                    required
                    value={movementForm.quantity}
                    onChange={(e) => setMovementForm({ ...movementForm, quantity: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={movementForm.unitCost}
                    onChange={(e) => setMovementForm({ ...movementForm, unitCost: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Post Ledger Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
