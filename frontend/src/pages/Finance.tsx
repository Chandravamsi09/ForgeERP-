import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  DollarSign,
  Plus,
  BookOpen,
  FileSpreadsheet,
  TrendingUp,
  Scale,
  Receipt
} from 'lucide-react';
import { AccountType } from '@forge-erp/shared';

interface Account {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
}

interface Expense {
  id: string;
  expenseNumber: string;
  category: string;
  amount: number;
  taxAmount: number;
  expenseDate: string;
  description?: string;
}

interface ProfitLoss {
  revenue: { total: number; accounts: Account[] };
  expenses: { total: number; directExpensesTotal: number; accounts: Account[] };
  netProfit: number;
  isProfitable: boolean;
}

interface BalanceSheet {
  assets: { total: number; accounts: Account[] };
  liabilities: { total: number; accounts: Account[] };
  equity: { total: number; accounts: Account[] };
  isBalanced: boolean;
}

export const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coa' | 'expenses' | 'pnl' | 'balancesheet'>('coa');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pnl, setPnl] = useState<ProfitLoss | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [accountForm, setAccountForm] = useState({
    accountCode: '',
    accountName: '',
    accountType: AccountType.ASSET,
    initialBalance: 0,
  });

  const [expenseForm, setExpenseForm] = useState({
    category: 'Utilities',
    amount: 0,
    description: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accRes, expRes, pnlRes, bsRes] = await Promise.all([
        api.get('/finance/accounts'),
        api.get('/finance/expenses'),
        api.get('/finance/reports/profit-loss'),
        api.get('/finance/reports/balance-sheet'),
      ]);
      if (accRes.data?.success) setAccounts(accRes.data.data);
      if (expRes.data?.success) setExpenses(expRes.data.data);
      if (pnlRes.data?.success) setPnl(pnlRes.data.data);
      if (bsRes.data?.success) setBalanceSheet(bsRes.data.data);
    } catch (err) {
      console.error('Failed to load finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/finance/accounts', accountForm);
      setShowAccountModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create account');
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/finance/expenses', { ...expenseForm, amount: Number(expenseForm.amount) });
      setShowExpenseModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to record expense');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-sky-400" />
            General Ledger & Financial Accounting
          </h1>
          <p className="text-sm text-slate-400">Chart of Accounts, operating expenses, and financial balance reports</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
          >
            <Receipt className="w-4 h-4 text-sky-400" />
            Record Expense
          </button>
          <button
            onClick={() => setShowAccountModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('coa')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'coa'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Chart of Accounts ({accounts.length})
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'expenses'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Operating Expenses ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('pnl')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'pnl'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Profit & Loss Statement
        </button>
        <button
          onClick={() => setActiveTab('balancesheet')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'balancesheet'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Balance Sheet
        </button>
      </div>

      {/* Chart of Accounts */}
      {activeTab === 'coa' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Account Code</th>
                <th className="px-6 py-4">Account Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Current Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No General Ledger accounts initialized yet.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-sky-400">{acc.accountCode}</td>
                    <td className="px-6 py-4 font-medium text-white">{acc.accountName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {acc.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-100">
                      ${acc.balance.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Expenses Table */}
      {activeTab === 'expenses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Expense #</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No operating expenses recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-sky-400">{exp.expenseNumber}</td>
                    <td className="px-6 py-4 font-medium text-white">{exp.category}</td>
                    <td className="px-6 py-4 text-slate-400">{exp.description || 'Operating Expense'}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-rose-400">
                      ${exp.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Profit & Loss Statement */}
      {activeTab === 'pnl' && pnl && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Income Statement (P&L)
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">Total Revenue / Sales</span>
              <span className="font-mono font-bold text-emerald-400">${pnl.revenue.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">Operating Expenses & Direct Costs</span>
              <span className="font-mono font-bold text-rose-400">${pnl.expenses.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-slate-800/40 rounded-lg px-4 font-bold text-base">
              <span>Net Income / Profit</span>
              <span className={`font-mono ${pnl.isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${pnl.netProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Balance Sheet Statement */}
      {activeTab === 'balancesheet' && balanceSheet && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Scale className="w-5 h-5 text-sky-400" />
            Balance Sheet Statement
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">Total Assets</span>
              <span className="font-mono font-bold text-sky-400">${balanceSheet.assets.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">Total Liabilities</span>
              <span className="font-mono font-bold text-amber-400">${balanceSheet.liabilities.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">Total Equity</span>
              <span className="font-mono font-bold text-purple-400">${balanceSheet.equity.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-slate-800/40 rounded-lg px-4 font-bold text-base">
              <span>Equation Status: Assets = Liabilities + Equity</span>
              <span className={`text-xs px-2.5 py-1 rounded-full ${balanceSheet.isBalanced ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {balanceSheet.isBalanced ? 'BALANCED' : 'UNBALANCED'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
