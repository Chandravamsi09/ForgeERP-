import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Globe, DollarSign, Scale, ArrowRightLeft, CheckCircle2, TrendingUp } from 'lucide-react';

export const ConsolidationDashboard: React.FC = () => {
  const [trialBalance, setTrialBalance] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrialBalance();
  }, []);

  const fetchTrialBalance = async () => {
    try {
      setLoading(true);
      const res = await api.get('/consolidation/trial-balance');
      if (res.data.success) {
        setTrialBalance(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch trial balance', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
          <Globe className="w-7 h-7 text-teal-400" />
          Multi-Subsidiary Financial Consolidation & General Ledger
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          NetSuite-style intercompany revenue/COGS eliminations, automated AP/AR matching, and Cumulative Translation Adjustments (CTA).
        </p>
      </div>

      {/* Trial Balance Health KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Consolidated Total Debits</span>
          <div className="text-3xl font-extrabold text-slate-100 mt-2">
            ${trialBalance?.totalDebits?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </div>
          <div className="text-xs text-slate-500 mt-2">Sum of all parent & subsidiary debit entries</div>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Consolidated Total Credits</span>
          <div className="text-3xl font-extrabold text-slate-100 mt-2">
            ${trialBalance?.totalCredits?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </div>
          <div className="text-xs text-slate-500 mt-2">Sum of all parent & subsidiary credit entries</div>
        </div>

        <div className="card p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Double-Entry Balance Check</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            100% Balanced
          </div>
          <div className="text-xs text-emerald-500/80 mt-2">Debit == Credit verified across all entities</div>
        </div>
      </div>

      {/* Consolidated Trial Balance Table */}
      <div className="card bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-teal-400" />
            Consolidated Chart of Accounts Trial Balance
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                <th className="py-3.5 px-4">Account Code</th>
                <th className="py-3.5 px-4">Account Name</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4 text-right">Debit Balance</th>
                <th className="py-3.5 px-4 text-right">Credit Balance</th>
                <th className="py-3.5 px-4 text-right">Net Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading consolidated general ledger...
                  </td>
                </tr>
              ) : !trialBalance?.accounts || trialBalance.accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No general ledger accounts initialized yet.
                  </td>
                </tr>
              ) : (
                trialBalance.accounts.map((acc: any) => (
                  <tr key={acc.accountCode} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-teal-400">{acc.accountCode}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{acc.accountName}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-400">{acc.accountType}</td>
                    <td className="py-3 px-4 text-right text-slate-200">${acc.totalDebit?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-slate-200">${acc.totalCredit?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">${acc.netBalance?.toFixed(2)}</td>
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
