import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, AlertCircle, FileText, CheckCircle2, XCircle, Search } from 'lucide-react';

export const QualityManagement: React.FC = () => {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
          Quality Management & In-Line Inspection (QM)
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          AQL tolerance inspection plans, Non-Conformance Reports (NCR) defect tracking, and ISO-9001 Certificate of Analysis (CoA) release.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AQL Inspection Standard</span>
          <div className="text-2xl font-bold text-slate-100 mt-2">ISO 2859-1 Level II</div>
          <div className="text-xs text-slate-500 mt-2">Standard tightened sampling plan</div>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pass / Conformance Rate</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">97.8%</div>
          <div className="text-xs text-slate-500 mt-2">124 Inspections evaluated this month</div>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open NCR Defect Tickets</span>
          <div className="text-2xl font-bold text-amber-400 mt-2">2 Active</div>
          <div className="text-xs text-slate-500 mt-2">1 Rework, 1 Return-to-Vendor</div>
        </div>
      </div>

      {/* Quality Inspection Log Table */}
      <div className="card bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Inspection Test Records & Verdicts
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                <th className="py-3.5 px-4">Inspection #</th>
                <th className="py-3.5 px-4">Stage</th>
                <th className="py-3.5 px-4">Product / Item</th>
                <th className="py-3.5 px-4">Sample Size</th>
                <th className="py-3.5 px-4">Passed</th>
                <th className="py-3.5 px-4">Rejected</th>
                <th className="py-3.5 px-4">Verdict</th>
                <th className="py-3.5 px-4">Inspector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading quality test records...
                  </td>
                </tr>
              ) : inspections.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No quality inspection records found.
                  </td>
                </tr>
              ) : (
                inspections.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-emerald-400">{insp.inspectionNumber}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-400">{insp.stage}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{insp.plan?.product?.name}</td>
                    <td className="py-3 px-4">{insp.sampleSize}</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">{insp.passedQuantity}</td>
                    <td className="py-3 px-4 text-rose-400 font-semibold">{insp.rejectedQuantity}</td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-slate-400">{insp.inspectorName}</td>
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
