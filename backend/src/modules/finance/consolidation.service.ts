import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';
import { IntercompanyEliminationEngine, IntercompanyTransaction } from '@forge-erp/shared';

export interface RunConsolidationDto {
  periodYear: number;
  periodMonth: number;
  reportingCurrency: string;
  transactions: IntercompanyTransaction[];
}

export class ConsolidationService {
  /**
   * Runs NetSuite-style Multi-Subsidiary Financial Consolidation and creates automated Elimination Journal Entries
   */
  static async runConsolidation(tenantId: string, dto: RunConsolidationDto) {
    return prisma.$transaction(async (tx) => {
      // 1. Process elimination math using shared engine
      const eliminationResult = IntercompanyEliminationEngine.processEliminations(
        dto.transactions,
        dto.reportingCurrency
      );

      // 2. Ensure Intercompany Elimination Accounts exist in Chart of Accounts
      const requiredAccounts = [
        { code: '4999', name: 'Intercompany Sales Revenue (Elimination)', classification: 'OPERATING_REVENUE' },
        { code: '5999', name: 'Intercompany Cost of Goods Sold (Elimination)', classification: 'COST_OF_GOODS_SOLD' },
        { code: '2099', name: 'Intercompany Accounts Payable (Elimination)', classification: 'CURRENT_LIABILITY' },
        { code: '1199', name: 'Intercompany Accounts Receivable (Elimination)', classification: 'CURRENT_ASSET' },
        { code: '3999', name: 'Cumulative Translation Adjustment (Equity)', classification: 'EQUITY' },
        { code: '5998', name: 'Consolidated COGS (Unrealized Profit Adjustment)', classification: 'COST_OF_GOODS_SOLD' },
        { code: '1399', name: 'Inventory Asset (Valuation Write-down to Cost)', classification: 'CURRENT_ASSET' },
      ];

      const accountMap = new Map<string, string>();

      for (const acc of requiredAccounts) {
        const existing = await tx.account.upsert({
          where: { tenantId_accountCode: { tenantId, accountCode: acc.code } },
          update: {},
          create: {
            tenantId,
            accountCode: acc.code,
            accountName: acc.name,
            accountType: acc.classification as any,
          },
        });
        accountMap.set(acc.code, existing.id);
      }

      // 3. Post Consolidated Elimination Journal Entry
      const entryCount = await tx.journalEntry.count({ where: { tenantId } });
      const entryNumber = `JV-ELIM-${dto.periodYear}-${String(dto.periodMonth).padStart(2, '0')}-${String(entryCount + 1).padStart(4, '0')}`;

      const journalLinesData = eliminationResult.eliminationJournalEntries.flatMap((entry) => {
        const debitCode = entry.debitAccount.split(' - ')[0];
        const creditCode = entry.creditAccount.split(' - ')[0];

        return [
          {
            accountId: accountMap.get(debitCode)!,
            debit: entry.debitAmount,
            credit: 0,
          },
          {
            accountId: accountMap.get(creditCode)!,
            debit: 0,
            credit: entry.creditAmount,
          },
        ];
      });

      const journalEntry = await tx.journalEntry.create({
        data: {
          tenantId,
          entryNumber,
          entryDate: new Date(),
          description: `Consolidated Intercompany Elimination for Period ${dto.periodYear}-${dto.periodMonth}`,
          referenceType: 'INTERCOMPANY_CONSOLIDATION',
          status: 'POSTED' as any,
          lines: {
            create: journalLinesData,
          },
        },
        include: { lines: { include: { account: true } } },
      });

      return {
        consolidationSummary: eliminationResult,
        journalEntry,
      };
    });
  }

  /**
   * Retrieves trial balance across all subsidiaries
   */
  static async getConsolidatedTrialBalance(tenantId: string) {
    const accounts = await prisma.account.findMany({
      where: { tenantId },
      include: { journalLines: true },
      orderBy: { accountCode: 'asc' },
    });

    const trialBalance = accounts.map((acc) => {
      const totalDebit = acc.journalLines.reduce((sum, l) => sum + l.debit, 0);
      const totalCredit = acc.journalLines.reduce((sum, l) => sum + l.credit, 0);
      const netBalance = acc.accountType === 'ASSET' || acc.accountType === 'EXPENSE' || acc.accountType === 'COST_OF_GOODS_SOLD'
        ? totalDebit - totalCredit
        : totalCredit - totalDebit;

      return {
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        accountType: acc.accountType,
        totalDebit: Number(totalDebit.toFixed(2)),
        totalCredit: Number(totalCredit.toFixed(2)),
        netBalance: Number(netBalance.toFixed(2)),
      };
    });

    const totalDebits = trialBalance.reduce((sum, a) => sum + a.totalDebit, 0);
    const totalCredits = trialBalance.reduce((sum, a) => sum + a.totalCredit, 0);

    return {
      accounts: trialBalance,
      totalDebits: Number(totalDebits.toFixed(2)),
      totalCredits: Number(totalCredits.toFixed(2)),
      isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
    };
  }
}
