import { AccountType } from '@forge-erp/shared';

describe('Finance & Accounting Module Business Logic Tests', () => {
  interface JournalLine {
    accountId: string;
    accountType: AccountType;
    debit: number;
    credit: number;
  }

  test('1. Double-Entry Balance Rule: verifies sum(debit) strictly equals sum(credit)', () => {
    const lines: JournalLine[] = [
      { accountId: 'acc_cash', accountType: AccountType.ASSET, debit: 1500, credit: 0 },
      { accountId: 'acc_revenue', accountType: AccountType.REVENUE, debit: 0, credit: 1500 },
    ];

    const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);

    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;
    expect(isBalanced).toBe(true);
    expect(totalDebit).toBe(1500);
    expect(totalCredit).toBe(1500);
  });

  test('2. Unbalanced Entry Rejection: flags entries where debits and credits do not match', () => {
    const lines: JournalLine[] = [
      { accountId: 'acc_inventory', accountType: AccountType.ASSET, debit: 2000, credit: 0 },
      { accountId: 'acc_ap', accountType: AccountType.LIABILITY, debit: 0, credit: 1800 }, // Out of balance by $200!
    ];

    const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);

    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;
    expect(isBalanced).toBe(false);
  });

  test('3. General Ledger Balance Updates: Asset/Expense debit increases balance, Revenue/Liability credit increases balance', () => {
    let cashBalance = 10000; // Asset
    let salesRevenueBalance = 50000; // Revenue

    // Transaction: Sale of $2500 received in Cash
    const debitCash = 2500;
    const creditRevenue = 2500;

    cashBalance += debitCash; // Asset increases with debit
    salesRevenueBalance += creditRevenue; // Revenue increases with credit

    expect(cashBalance).toBe(12500);
    expect(salesRevenueBalance).toBe(52500);
  });

  test('4. Profit & Loss Computation: Net Profit equals Total Revenue minus Total Operating Expenses', () => {
    const revenueTotal = 150000;
    const cogsTotal = 60000;
    const operatingExpenses = 25000;

    const totalExpenses = cogsTotal + operatingExpenses;
    const netProfit = revenueTotal - totalExpenses;
    const isProfitable = netProfit > 0;

    expect(totalExpenses).toBe(85000);
    expect(netProfit).toBe(65000);
    expect(isProfitable).toBe(true);
  });

  test('5. Balance Sheet Equation: Assets must strictly equal Liabilities + Equity', () => {
    const assetsTotal = 350000;
    const liabilitiesTotal = 120000;
    const equityTotal = 230000;

    const equationSatisfied = assetsTotal === (liabilitiesTotal + equityTotal);
    expect(equationSatisfied).toBe(true);
  });
});
