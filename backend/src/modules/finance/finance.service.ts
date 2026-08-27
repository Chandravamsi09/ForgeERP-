import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';
import { AccountType, JournalEntryStatus } from '@forge-erp/shared';

export interface CreateAccountDto {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  initialBalance?: number;
}

export interface CreateJournalEntryDto {
  description: string;
  entryDate?: Date;
  referenceType?: string;
  referenceId?: string;
  lines: {
    accountId: string;
    debit: number;
    credit: number;
  }[];
}

export interface CreateExpenseDto {
  category: string;
  amount: number;
  taxAmount?: number;
  expenseDate?: Date;
  description?: string;
  receiptUrl?: string;
}

export class FinanceService {
  // Chart of Accounts Operations
  static async createAccount(tenantId: string, dto: CreateAccountDto) {
    const existing = await prisma.account.findFirst({
      where: { tenantId, accountCode: dto.accountCode },
    });
    if (existing) {
      throw new AppError(`Account code '${dto.accountCode}' already exists`, 400);
    }
    return prisma.account.create({
      data: {
        tenantId,
        accountCode: dto.accountCode,
        accountName: dto.accountName,
        accountType: dto.accountType,
        balance: dto.initialBalance || 0.0,
      },
    });
  }

  static async getChartOfAccounts(tenantId: string) {
    return prisma.account.findMany({
      where: { tenantId },
      orderBy: { accountCode: 'asc' },
    });
  }

  // Journal Entry & Double-Entry Ledger Engine
  static async createJournalEntry(tenantId: string, dto: CreateJournalEntryDto) {
    if (!dto.lines || dto.lines.length < 2) {
      throw new AppError('A valid journal entry requires at least two line items', 400);
    }

    const totalDebit = dto.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = dto.lines.reduce((sum, line) => sum + (line.credit || 0), 0);

    // Double-entry accounting rule: Debits must equal Credits
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new AppError(
        `Journal entry is out of balance. Total Debits ($${totalDebit.toFixed(2)}) must equal Total Credits ($${totalCredit.toFixed(2)})`,
        400
      );
    }

    return prisma.$transaction(async (tx) => {
      const entryCount = await tx.journalEntry.count({ where: { tenantId } });
      const entryNumber = `JE-${new Date().getFullYear()}-${String(entryCount + 1).padStart(5, '0')}`;

      const journalEntry = await tx.journalEntry.create({
        data: {
          tenantId,
          entryNumber,
          entryDate: dto.entryDate || new Date(),
          description: dto.description,
          referenceType: dto.referenceType || 'MANUAL',
          referenceId: dto.referenceId,
          status: JournalEntryStatus.POSTED,
          lines: {
            create: dto.lines.map((l) => ({
              accountId: l.accountId,
              debit: l.debit || 0.0,
              credit: l.credit || 0.0,
            })),
          },
        },
        include: { lines: { include: { account: true } } },
      });

      // Update Account balances according to standard accounting rules
      for (const line of dto.lines) {
        const account = await tx.account.findUnique({ where: { id: line.accountId } });
        if (!account) continue;

        let delta = 0;
        if (account.accountType === AccountType.ASSET || account.accountType === AccountType.EXPENSE) {
          delta = (line.debit || 0) - (line.credit || 0);
        } else {
          // Liability, Equity, Revenue (Credit-normal accounts)
          delta = (line.credit || 0) - (line.debit || 0);
        }

        await tx.account.update({
          where: { id: account.id },
          data: { balance: account.balance + delta },
        });
      }

      return journalEntry;
    });
  }

  static async getJournalEntries(tenantId: string) {
    return prisma.journalEntry.findMany({
      where: { tenantId },
      include: { lines: { include: { account: true } } },
      orderBy: { entryDate: 'desc' },
    });
  }

  // Expense Tracking
  static async createExpense(tenantId: string, dto: CreateExpenseDto) {
    const expenseCount = await prisma.expense.count({ where: { tenantId } });
    const expenseNumber = `EXP-${new Date().getFullYear()}-${String(expenseCount + 1).padStart(5, '0')}`;

    return prisma.expense.create({
      data: {
        tenantId,
        expenseNumber,
        category: dto.category,
        amount: dto.amount,
        taxAmount: dto.taxAmount || 0.0,
        expenseDate: dto.expenseDate || new Date(),
        description: dto.description,
        receiptUrl: dto.receiptUrl,
      },
    });
  }

  static async getExpenses(tenantId: string) {
    return prisma.expense.findMany({
      where: { tenantId },
      orderBy: { expenseDate: 'desc' },
    });
  }

  // Financial Reports Engine: Profit & Loss and Balance Sheet
  static async getProfitAndLoss(tenantId: string) {
    const accounts = await prisma.account.findMany({ where: { tenantId } });
    const expenses = await prisma.expense.findMany({ where: { tenantId } });

    const revenueAccounts = accounts.filter((a) => a.accountType === AccountType.REVENUE);
    const expenseAccounts = accounts.filter((a) => a.accountType === AccountType.EXPENSE);

    const totalRevenue = revenueAccounts.reduce((sum, a) => sum + a.balance, 0);
    const ledgerExpenses = expenseAccounts.reduce((sum, a) => sum + a.balance, 0);
    const directExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const totalOperatingExpenses = ledgerExpenses + directExpenses;
    const netProfit = totalRevenue - totalOperatingExpenses;

    return {
      revenue: {
        accounts: revenueAccounts,
        total: totalRevenue,
      },
      expenses: {
        accounts: expenseAccounts,
        directExpensesTotal: directExpenses,
        total: totalOperatingExpenses,
      },
      netProfit,
      isProfitable: netProfit >= 0,
    };
  }

  static async getBalanceSheet(tenantId: string) {
    const accounts = await prisma.account.findMany({ where: { tenantId } });

    const assets = accounts.filter((a) => a.accountType === AccountType.ASSET);
    const liabilities = accounts.filter((a) => a.accountType === AccountType.LIABILITY);
    const equity = accounts.filter((a) => a.accountType === AccountType.EQUITY);

    const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
    const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);

    return {
      assets: { accounts: assets, total: totalAssets },
      liabilities: { accounts: liabilities, total: totalLiabilities },
      equity: { accounts: equity, total: totalEquity },
      isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
    };
  }
}
