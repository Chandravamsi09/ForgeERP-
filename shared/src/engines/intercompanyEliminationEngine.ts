export interface IntercompanyTransaction {
  transactionId: string;
  sourceSubsidiaryId: string;
  targetSubsidiaryId: string;
  transactionType: 'TRADE_SALE_PURCHASE' | 'INTERCOMPANY_LOAN' | 'MANAGEMENT_FEE';
  sourceAmountForeign: number;
  sourceCurrency: string;
  sourceExchangeRateToParent: number;
  targetAmountForeign: number;
  targetCurrency: string;
  targetExchangeRateToParent: number;
  markupPercentage?: number; // Markup on transfer price
  unsoldInventoryPercentage?: number; // % of transferred goods still sitting in target inventory
}

export interface ConsolidatedJournalEntry {
  entryType: 'INTERCOMPANY_ELIMINATION' | 'UNREALIZED_PROFIT_ELIMINATION' | 'CURRENCY_TRANSLATION_CTA';
  description: string;
  debitAccount: string;
  debitAmount: number;
  creditAccount: string;
  creditAmount: number;
}

export interface IntercompanyEliminationResult {
  totalIntercompanyRevenueEliminated: number;
  totalIntercompanyCOGSEliminated: number;
  totalIntercompanyAREliminated: number;
  totalIntercompanyAPEliminated: number;
  totalUnrealizedInventoryProfitEliminated: number;
  cumulativeTranslationAdjustmentCTA: number;
  eliminationJournalEntries: ConsolidatedJournalEntry[];
  isFullyBalanced: boolean;
}

export class IntercompanyEliminationEngine {
  /**
   * Executes multi-subsidiary intercompany revenue, payables, and unrealized inventory profit eliminations
   */
  static processEliminations(
    transactions: IntercompanyTransaction[],
    parentReportingCurrency: string = 'USD'
  ): IntercompanyEliminationResult {
    const eliminationEntries: ConsolidatedJournalEntry[] = [];

    let totalRevenueElim = 0;
    let totalCOGSElim = 0;
    let totalARElim = 0;
    let totalAPElim = 0;
    let totalUnrealizedProfit = 0;
    let totalCTA = 0;

    for (const tx of transactions) {
      // 1. Convert source and target amounts to Parent Reporting Currency
      const sourceAmountParentBase = Number((tx.sourceAmountForeign * tx.sourceExchangeRateToParent).toFixed(2));
      const targetAmountParentBase = Number((tx.targetAmountForeign * tx.targetExchangeRateToParent).toFixed(2));

      // 2. Eliminate Intercompany Revenue and Purchases/COGS
      if (tx.transactionType === 'TRADE_SALE_PURCHASE' || tx.transactionType === 'MANAGEMENT_FEE') {
        const eliminationAmount = Math.min(sourceAmountParentBase, targetAmountParentBase);
        totalRevenueElim += eliminationAmount;
        totalCOGSElim += eliminationAmount;

        eliminationEntries.push({
          entryType: 'INTERCOMPANY_ELIMINATION',
          description: `Eliminate Intercompany Trade Revenue/COGS between ${tx.sourceSubsidiaryId} and ${tx.targetSubsidiaryId}`,
          debitAccount: '4999 - Intercompany Sales Revenue (Elimination)',
          debitAmount: eliminationAmount,
          creditAccount: '5999 - Intercompany Cost of Goods Sold (Elimination)',
          creditAmount: eliminationAmount,
        });

        // 3. Eliminate Intercompany Balance Sheet Accounts (AR vs AP)
        totalARElim += sourceAmountParentBase;
        totalAPElim += targetAmountParentBase;

        eliminationEntries.push({
          entryType: 'INTERCOMPANY_ELIMINATION',
          description: `Eliminate Intercompany AP/AR balances between ${tx.sourceSubsidiaryId} and ${tx.targetSubsidiaryId}`,
          debitAccount: '2099 - Intercompany Accounts Payable (Elimination)',
          debitAmount: targetAmountParentBase,
          creditAccount: '1199 - Intercompany Accounts Receivable (Elimination)',
          creditAmount: sourceAmountParentBase,
        });

        // 4. Currency Translation Discrepancy (CTA) between AR and AP booking rates
        const fxDiscrepancy = Number((targetAmountParentBase - sourceAmountParentBase).toFixed(2));
        if (Math.abs(fxDiscrepancy) > 0.001) {
          totalCTA += fxDiscrepancy;
          eliminationEntries.push({
            entryType: 'CURRENCY_TRANSLATION_CTA',
            description: `CTA Adjustment on Intercompany Settlement between ${tx.sourceSubsidiaryId} and ${tx.targetSubsidiaryId}`,
            debitAccount: fxDiscrepancy < 0 ? '3999 - Cumulative Translation Adjustment (Equity)' : '2099 - Intercompany AP',
            debitAmount: Math.abs(fxDiscrepancy),
            creditAccount: fxDiscrepancy < 0 ? '1199 - Intercompany AR' : '3999 - Cumulative Translation Adjustment (Equity)',
            creditAmount: Math.abs(fxDiscrepancy),
          });
        }

        // 5. Unrealized Profit Elimination in Target Subsidiary Ending Inventory
        if (tx.markupPercentage && tx.markupPercentage > 0 && tx.unsoldInventoryPercentage && tx.unsoldInventoryPercentage > 0) {
          const unsoldValuationBase = targetAmountParentBase * (tx.unsoldInventoryPercentage / 100);
          // Profit Margin in Transfer Price = Markup / (100 + Markup)
          const profitMarginFraction = tx.markupPercentage / (100 + tx.markupPercentage);
          const unrealizedProfitAmount = Number((unsoldValuationBase * profitMarginFraction).toFixed(2));

          if (unrealizedProfitAmount > 0) {
            totalUnrealizedProfit += unrealizedProfitAmount;

            eliminationEntries.push({
              entryType: 'UNREALIZED_PROFIT_ELIMINATION',
              description: `Eliminate Unrealized Intercompany Profit in Ending Inventory (${tx.unsoldInventoryPercentage}% remaining in ${tx.targetSubsidiaryId})`,
              debitAccount: '5998 - Consolidated COGS (Unrealized Profit Adjustment)',
              debitAmount: unrealizedProfitAmount,
              creditAccount: '1399 - Inventory Asset (Valuation Write-down to Cost)',
              creditAmount: unrealizedProfitAmount,
            });
          }
        }
      }
    }

    const totalDebits = eliminationEntries.reduce((sum, e) => sum + e.debitAmount, 0);
    const totalCredits = eliminationEntries.reduce((sum, e) => sum + e.creditAmount, 0);
    const isFullyBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

    return {
      totalIntercompanyRevenueEliminated: Number(totalRevenueElim.toFixed(2)),
      totalIntercompanyCOGSEliminated: Number(totalCOGSElim.toFixed(2)),
      totalIntercompanyAREliminated: Number(totalARElim.toFixed(2)),
      totalIntercompanyAPEliminated: Number(totalAPElim.toFixed(2)),
      totalUnrealizedInventoryProfitEliminated: Number(totalUnrealizedProfit.toFixed(2)),
      cumulativeTranslationAdjustmentCTA: Number(totalCTA.toFixed(2)),
      eliminationJournalEntries: eliminationEntries,
      isFullyBalanced,
    };
  }
}
