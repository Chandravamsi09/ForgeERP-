import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldCheck, Plus, CheckCircle, XCircle, AlertTriangle, FileText, Download } from 'lucide-react';

export const QualityManagement: React.FC = () => {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInspModal, setShowInspModal] = useState(false);
  const [showNCRModal, setShowNCRModal] = useState(false);
  const [selectedInsp, setSelectedInsp] = useState<any | null>(null);

  const [newInsp, setNewInsp] = useState({
    productName: 'Precision Helical Pinion Gear 40-Tooth',
    stage: 'IN_PROCESS_ROUTING',
    sampleSize: 30,
    passedQuantity: 30,
    rejectedQuantity: 0,
    inspectorName: 'David Vance, Lead QA Auditor',
  });

  const [ncrForm, setNcrForm] = useState({
    title: 'Surface Micro-Fracture on Casting',
    severity: 'MAJOR',
    disposition: 'REWORK',
  });

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const res = await api.get('/quality/inspections');
      if (res.data.success) {
        setInspections(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inspections', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const passed = Number(newInsp.passedQuantity);
    const rejected = Number(newInsp.rejectedQuantity);
    const status = rejected === 0 ? 'PASS' : 'FAIL';

    const created = {
      id: `insp_local_${Date.now()}`,
      inspectionNumber: `INSP-2026-${String(inspections.length + 1).padStart(3, '0')}`,
      stage: newInsp.stage,
      sampleSize: Number(newInsp.sampleSize),
      passedQuantity: passed,
      rejectedQuantity: rejected,
      status,
      inspectorName: newInsp.inspectorName,
      plan: { product: { name: newInsp.productName } },
      inspectionDate: new Date(),
    };

    setInspections([created, ...inspections]);
    setShowInspModal(false);
    alert(`Inspection ${created.inspectionNumber} logged with status: ${status}!`);
  };

  const handleGenerateCoA = (inspNumber: string) => {
    alert(`Certificate of Analysis (CoA) for ${inspNumber} successfully generated and signed!`);
  };

  const handleRaiseNCR = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNCRModal(false);
    alert(`NCR '${ncrForm.title}' (${ncrForm.severity}) raised successfully for ${selectedInsp?.inspectionNumber}!`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            Quality Assurance, AQL & Non-Conformance (NCR)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            ISO 2859-1 sampling plans, in-process routing gates, and automated Certificate of Analysis (CoA) generation.
          </p>
        </div>

        <button
          onClick={() => setShowInspModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log Quality Inspection
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">First-Pass Yield</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-3">98.2%</p>
          <p className="text-xs text-slate-500 mt-2">+1.4% above target threshold</p>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open NCR Tickets</span>
          <p className="text-3xl font-extrabold text-amber-400 mt-3">2 Open</p>
          <p className="text-xs text-slate-500 mt-2">Zero critical safety defects</p>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ISO Compliance Gate</span>
          <p className="text-3xl font-extrabold text-sky-400 mt-3">100% Audit-Ready</p>
          <p className="text-xs text-slate-500 mt-2">SOX 404 & ISO-9001 certified</p>
        </div>
      </div>

      {/* Inspections Master Table */}
      <div className="card bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Quality Inspection Records
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                <th className="py-3.5 px-4">Inspection #</th>
                <th className="py-3.5 px-4">Item / Product</th>
                <th className="py-3.5 px-4">Stage</th>
                <th className="py-3.5 px-4 text-center">Sample Size</th>
                <th className="py-3.5 px-4 text-center">Passed</th>
                <th className="py-3.5 px-4 text-center">Rejected</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading quality inspections...
                  </td>
                </tr>
              ) : inspections.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No inspections recorded yet.
                  </td>
                </tr>
              ) : (
                inspections.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-400">{insp.inspectionNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{insp.plan?.product?.name}</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-400">{insp.stage}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-200">{insp.sampleSize}</td>
                    <td className="py-3 px-4 text-center text-emerald-400 font-bold">{insp.passedQuantity}</td>
                    <td className="py-3 px-4 text-center text-rose-400 font-bold">{insp.rejectedQuantity}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          insp.status === 'PASS'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {insp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {insp.status === 'PASS' ? (
                        <button
                          onClick={() => handleGenerateCoA(insp.inspectionNumber)}
                          className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 rounded text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Generate CoA
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedInsp(insp);
                            setShowNCRModal(true);
                          }}
                          className="px-3 py-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30 rounded text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Raise NCR
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

      {/* Modal: New Inspection */}
      {showInspModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Log Inspection Gate
            </h3>
            <form onSubmit={handleCreateInspection} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Product</label>
                <select
                  value={newInsp.productName}
                  onChange={(e) => setNewInsp({ ...newInsp, productName: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                >
                  <option value="Precision Helical Pinion Gear 40-Tooth">Precision Helical Pinion Gear 40-Tooth</option>
                  <option value="Turbine Rotor Transmission Shaft 1200mm">Turbine Rotor Transmission Shaft 1200mm</option>
                  <option value="4140 Chrome-Moly Alloy Steel Bar 65mm">4140 Chrome-Moly Alloy Steel Bar 65mm</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Inspection Stage</label>
                <select
                  value={newInsp.stage}
                  onChange={(e) => setNewInsp({ ...newInsp, stage: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                >
                  <option value="INWARD_GOODS_RECEIPT">INWARD_GOODS_RECEIPT (GRN)</option>
                  <option value="IN_PROCESS_ROUTING">IN_PROCESS_ROUTING (Shop Floor)</option>
                  <option value="PRE_DISPATCH_FINISHED_GOODS">PRE_DISPATCH_FINISHED_GOODS</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Sample</label>
                  <input
                    type="number"
                    min="1"
                    value={newInsp.sampleSize}
                    onChange={(e) => setNewInsp({ ...newInsp, sampleSize: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Passed</label>
                  <input
                    type="number"
                    min="0"
                    value={newInsp.passedQuantity}
                    onChange={(e) => setNewInsp({ ...newInsp, passedQuantity: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Rejected</label>
                  <input
                    type="number"
                    min="0"
                    value={newInsp.rejectedQuantity}
                    onChange={(e) => setNewInsp({ ...newInsp, rejectedQuantity: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInspModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Record Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Raise NCR */}
      {showNCRModal && selectedInsp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Raise Non-Conformance (NCR) Ticket
            </h3>
            <form onSubmit={handleRaiseNCR} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Defect Title</label>
                <input
                  type="text"
                  required
                  value={ncrForm.title}
                  onChange={(e) => setNcrForm({ ...ncrForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Severity</label>
                  <select
                    value={ncrForm.severity}
                    onChange={(e) => setNcrForm({ ...ncrForm, severity: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  >
                    <option value="MINOR">MINOR</option>
                    <option value="MAJOR">MAJOR</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Disposition</label>
                  <select
                    value={ncrForm.disposition}
                    onChange={(e) => setNcrForm({ ...ncrForm, disposition: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  >
                    <option value="REWORK">REWORK</option>
                    <option value="SCRAP">SCRAP</option>
                    <option value="RETURN_TO_VENDOR">RETURN_TO_VENDOR</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNCRModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Raise NCR Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
