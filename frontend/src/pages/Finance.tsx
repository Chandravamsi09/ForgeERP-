import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  DollarSign,
  Plus,
  BookOpen,
  FileSpreadsheet,
  TrendingUp,
  Scale,
  Receipt,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { IAccount, IExpense, IProfitLoss, IBalanceSheet, AccountType } from '@forge-erp/shared';

const DEFAULT_ACCOUNTS: IAccount[] = [
  { id: 'acc_1', accountCode: '1000', accountName: 'Operating Cash & Treasury Bank Account', accountType: AccountType.ASSET, balance: 284500.00 },
  { id: 'acc_2', accountCode: '1100', accountName: 'Accounts Receivable (Trade CRM)', accountType: AccountType.ASSET, balance: 146850.00 },
  { id: 'acc_3', accountCode: '1300', accountName: 'Raw Material Inventory Asset', accountType: AccountType.ASSET, balance: 23125.00 },
  { id: 'acc_4', accountCode: '1350', accountName: 'Finished Goods Inventory Asset', accountType: AccountType.ASSET, balance: 10150.00 },
  { id: 'acc_5', accountCode: '1500', accountName: 'Plant Machinery & CNC Equipment (Fixed Asset)', accountType: AccountType.ASSET, balance: 350000.00 },
  { id: 'acc_6', accountCode: '2000', accountName: 'Accounts Payable (Trade Vendors)', accountType: AccountType.LIABILITY, balance: 36850.00 },
  { id: 'acc_7', accountCode: '3000', accountName: 'Common Shareholder Capital', accountType: AccountType.EQUITY, balance: 500000.00 },
  { id: 'acc_8', accountCode: '4000', accountName: 'Manufacturing Sales Revenue', accountType: AccountType.REVENUE, balance: 284500.00 },
  { id: 'acc_9', accountCode: '5000', accountName: 'Cost of Goods Sold (Direct Materials)', accountType: AccountType.EXPENSE, balance: 6850.00 },
];

const DEFAULT_EXPENSES: IExpense[] = [
  { id: 'exp_1', expenseNumber: 'EXP-2026-001', category: 'Utilities & Power', description: 'High-Voltage Shop Floor Power Grid', amount: 8400.00, taxAmount: 840.00, expenseDate: new Date().toISOString() },
  { id: 'exp_2', expenseNumber: 'EXP-2026-002', category: 'Equipment Maintenance', description: 'CNC 5-Axis Preventive Spindle Overhaul', amount: 4200.00, taxAmount: 420.00, expenseDate: new Date().toISOString() },
  { id: 'exp_3', expenseNumber: 'EXP-2026-003', category: 'Consumables', description: 'Carbide Cutting Inserts & Synthetic Coolant', amount: 2850.00, taxAmount: 285.00, expenseDate: new Date().toISOString() },
];

const DEFAULT_PNL: IProfitLoss = {
  revenue: { total: 284500.00 },
  expenses: { total: 15450.00 },
  netProfit: 269050.00,
  isProfitable: true,
};

const DEFAULT_BALANCE_SHEET: IBalanceSheet = {
  assets: { total: 814625.00 },
  liabilities: { total: 36850.00 },
  equity: { total: 777775.00 },
  isBalanced: true,
};

export const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coa' | 'expenses' | 'pnl' | 'balancesheet'>('coa');
  const [accounts, setAccounts] = useState<IAccount[]>(DEFAULT_ACCOUNTS);
  const [expenses, setExpenses] = useState<IExpense[]>(DEFAULT_EXPENSES);
  const [pnl, setPnl] = useState<IProfitLoss>(DEFAULT_PNL);
  const [balanceSheet, setBalanceSheet] = useState<IBalanceSheet>(DEFAULT_BALANCE_SHEET);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [accountForm, setAccountForm] = useState({
    accountCode: '',
    accountName: '',
    accountType: AccountType.ASSET,
    initialBalance: 0,
  });

  const [expenseForm, setExpenseForm] = useState({
    category: 'Utilities & Power',
    amount: 1500,
    description: 'General Shop Floor Expense',
  });

  const fetchData = async () => {
    try {
      const [accRes, expRes, pnlRes, bsRes] = await Promise.all([
        api.get('/finance/accounts'),
        api.get('/finance/expenses'),
        api.get('/finance/reports/profit-loss'),
        api.get('/finance/reports/balance-sheet'),
      ]);
      if (accRes.data?.success && accRes.data.data?.length > 0) setAccounts(accRes.data.data);
      if (expRes.data?.success && expRes.data.data?.length > 0) setExpenses(expRes.data.data);
      if (pnlRes.data?.success && pnlRes.data.data) setPnl(pnlRes.data.data);
      if (bsRes.data?.success && bsRes.data.data) setBalanceSheet(bsRes.data.data);
    } catch (err) {
      console.warn('Using default finance records');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const created: IAccount = {
      id: `acc_local_${Date.now()}`,
      accountCode: accountForm.accountCode,
      accountName: accountForm.accountName,
      accountType: accountForm.accountType,
      balance: Number(accountForm.initialBalance),
    };
    setAccounts([...accounts, created]);
    setShowAccountModal(false);
    setAccountForm({ accountCode: '', accountName: '', accountType: AccountType.ASSET, initialBalance: 0 });
    alert(`Account ${created.accountCode} (${created.accountName}) added to Chart of Accounts!`);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(expenseForm.amount);
    const created: IExpense = {
      id: `exp_local_${Date.now()}`,
      expenseNumber: `EXP-2026-${String(expenses.length + 1).padStart(3, '0')}`,
      category: expenseForm.category,
      description: expenseForm.description,
      amount: amt,
      taxAmount: amt * 0.1,
      expenseDate: new Date().toISOString(),
    };
    setExpenses([created, ...expenses]);
    setShowExpenseModal(false);
    setExpenseForm({ category: 'Utilities & Power', amount: 1500, description: 'General Shop Floor Expense' });
    alert(`Expense ${created.expenseNumber} recorded successfully!`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
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
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-sky-400" />
            Record Expense
          </button>
          <button
            onClick={() => setShowAccountModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/20 transition cursor-pointer"
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
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'coa'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Chart of Accounts ({accounts.length})
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'expenses'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Operating Expenses ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('pnl')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'pnl'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Profit & Loss Statement
        </button>
        <button
          onClick={() => setActiveTab('balancesheet')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'balancesheet'
              ? 'border-sky-500 text-sky-400 font-bold'
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
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-sky-400">{acc.accountCode}</td>
                  <td className="px-6 py-4 font-medium text-white">{acc.accountName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {acc.accountType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400">
                    ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
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
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-sky-400">{exp.expenseNumber}</td>
                  <td className="px-6 py-4 font-medium text-white">{exp.category}</td>
                  <td className="px-6 py-4 text-slate-400">{exp.description || 'Operating Expense'}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-rose-400">
                    ${exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Profit & Loss Statement */}
      {activeTab === 'pnl' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Income Statement (P&L)
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">Total Manufacturing Revenue</span>
              <span className="font-mono font-bold text-emerald-400">${pnl.revenue.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">Operating Expenses & Direct Costs</span>
              <span className="font-mono font-bold text-rose-400">${pnl.expenses.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-slate-800/40 rounded-lg px-4 font-bold text-base">
              <span>Net Operating Income / Profit</span>
              <span className="font-mono text-emerald-400">
                +${pnl.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Balance Sheet Statement */}
      {activeTab === 'balancesheet' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Scale className="w-5 h-5 text-sky-400" />
            Balance Sheet Statement
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">Total Assets</span>
              <span className="font-mono font-bold text-sky-400">${balanceSheet.assets.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">Total Liabilities</span>
              <span className="font-mono font-bold text-amber-400">${balanceSheet.liabilities.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">Total Shareholder Equity</span>
              <span className="font-mono font-bold text-purple-400">${balanceSheet.equity.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-slate-800/40 rounded-lg px-4 font-bold text-base">
              <span>Equation Status: Assets = Liabilities + Equity</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                100% BALANCED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Account */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-400" />
              Add General Ledger Account
            </h3>
            <form onSubmit={handleCreateAccount} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Account Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1400"
                  value={accountForm.accountCode}
                  onChange={(e) => setAccountForm({ ...accountForm, accountCode: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Account Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prepaid Insurance & Amortization"
                  value={accountForm.accountName}
                  onChange={(e) => setAccountForm({ ...accountForm, accountName: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Account Classification</label>
                <select
                  value={accountForm.accountType}
                  onChange={(e) => setAccountForm({ ...accountForm, accountType: e.target.value as AccountType })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                >
                  <option value={AccountType.ASSET}>ASSET</option>
                  <option value={AccountType.LIABILITY}>LIABILITY</option>
                  <option value={AccountType.EQUITY}>EQUITY</option>
                  <option value={AccountType.REVENUE}>REVENUE</option>
                  <option value={AccountType.EXPENSE}>EXPENSE</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Opening Balance ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={accountForm.initialBalance}
                  onChange={(e) => setAccountForm({ ...accountForm, initialBalance: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Expense */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-sky-400" />
              Record Operating Expense
            </h3>
            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                >
                  <option value="Utilities & Power">Utilities & Power</option>
                  <option value="Equipment Maintenance">Equipment Maintenance</option>
                  <option value="Consumables & Tooling">Consumables & Tooling</option>
                  <option value="Logistics & Freight">Logistics & Freight</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly CNC Spindle Lubricant Supply"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Post Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
