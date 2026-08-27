export interface BalanceSheetData {
  cashAndEquivalents: number;
  marketableSecurities: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  totalCurrentAssets: number;
  propertyPlantEquipment: number;
  accumulatedDepreciation: number;
  intangibleAssets: number;
  totalNonCurrentAssets: number;
  totalAssets: number;

  accountsPayable: number;
  shortTermDebt: number;
  accruedLiabilities: number;
  unearnedRevenue: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  deferredTaxLiabilities: number;
  totalNonCurrentLiabilities: number;
  totalLiabilities: number;

  commonStock: number;
  retainedEarnings: number;
  additionalPaidInCapital: number;
  accumulatedOtherComprehensiveIncome: number;
  totalStockholdersEquity: number;
}

export interface IncomeStatementData {
  grossRevenue: number;
  salesReturnsAndAllowances: number;
  netRevenue: number;
  costOfGoodsSold: number;
  grossProfit: number;

  researchAndDevelopment: number;
  salesAndMarketing: number;
  generalAndAdministrative: number;
  depreciationAndAmortization: number;
  totalOperatingExpenses: number;

  operatingIncomeEBIT: number;
  interestExpense: number;
  interestIncome: number;
  otherIncomeExpenseNet: number;
  incomeBeforeTax: number;
  incomeTaxExpense: number;
  netIncome: number;
}

export interface CashFlowData {
  netIncome: number;
  depreciationNonCash: number;
  changeInAccountsReceivable: number;
  changeInInventory: number;
  changeInAccountsPayable: number;
  cashFlowFromOperations: number;

  capitalExpenditures: number;
  assetSalesProceeds: number;
  cashFlowFromInvesting: number;

  debtIssuanceOrRepayment: number;
  dividendsPaid: number;
  equityIssuance: number;
  cashFlowFromFinancing: number;

  netChangeInCash: number;
}

export interface ComprehensiveFinancialRatios {
  // Liquidity Ratios
  currentRatio: number;
  quickRatioAcidTest: number;
  cashRatio: number;
  workingCapital: number;

  // Profitability Ratios
  grossProfitMarginPct: number;
  operatingProfitMarginPct: number;
  netProfitMarginPct: number;
  returnOnAssetsROAPct: number;
  returnOnEquityROEPct: number;
  ebitdaMarginPct: number;

  // Leverage & Solvency Ratios
  debtToEquityRatio: number;
  debtToAssetsRatio: number;
  interestCoverageRatio: number;
  equityMultiplier: number;

  // Efficiency & Activity Ratios
  inventoryTurnoverRatio: number;
  daysSalesInInventoryDSI: number;
  receivablesTurnoverRatio: number;
  daysSalesOutstandingDSO: number;
  payablesTurnoverRatio: number;
  daysPayablesOutstandingDPO: number;
  cashConversionCycleDays: number;
  assetTurnoverRatio: number;

  // Altman Z-Score Bankruptcy Predictor (for Manufacturing Enterprises)
  altmanZScore: number;
  bankruptcyZone: 'SAFE_ZONE' | 'GREY_ZONE' | 'DISTRESS_ZONE';
}

export class FinancialRatiosEngine {
  /**
   * Calculates comprehensive suite of 25+ financial liquidity, solvency, profitability, and bankruptcy ratios
   */
  static evaluateEnterpriseFinancialHealth(
    balanceSheet: BalanceSheetData,
    incomeStatement: IncomeStatementData,
    cashFlow: CashFlowData,
    marketValueOfEquity?: number
  ): ComprehensiveFinancialRatios {
    // 1. Working Capital & Liquidity
    const workingCapital = balanceSheet.totalCurrentAssets - balanceSheet.totalCurrentLiabilities;
    const currentRatio = balanceSheet.totalCurrentLiabilities > 0 ? balanceSheet.totalCurrentAssets / balanceSheet.totalCurrentLiabilities : 0;
    const quickAssets = balanceSheet.cashAndEquivalents + balanceSheet.marketableSecurities + balanceSheet.accountsReceivable;
    const quickRatioAcidTest = balanceSheet.totalCurrentLiabilities > 0 ? quickAssets / balanceSheet.totalCurrentLiabilities : 0;
    const cashRatio = balanceSheet.totalCurrentLiabilities > 0 ? (balanceSheet.cashAndEquivalents + balanceSheet.marketableSecurities) / balanceSheet.totalCurrentLiabilities : 0;

    // 2. Profitability
    const netRevenue = Math.max(0.001, incomeStatement.netRevenue);
    const grossProfitMarginPct = (incomeStatement.grossProfit / netRevenue) * 100;
    const operatingProfitMarginPct = (incomeStatement.operatingIncomeEBIT / netRevenue) * 100;
    const netProfitMarginPct = (incomeStatement.netIncome / netRevenue) * 100;
    const returnOnAssetsROAPct = balanceSheet.totalAssets > 0 ? (incomeStatement.netIncome / balanceSheet.totalAssets) * 100 : 0;
    const returnOnEquityROEPct = balanceSheet.totalStockholdersEquity > 0 ? (incomeStatement.netIncome / balanceSheet.totalStockholdersEquity) * 100 : 0;
    const ebitda = incomeStatement.operatingIncomeEBIT + incomeStatement.depreciationAndAmortization;
    const ebitdaMarginPct = (ebitda / netRevenue) * 100;

    // 3. Leverage & Solvency
    const totalDebt = balanceSheet.shortTermDebt + balanceSheet.longTermDebt;
    const debtToEquityRatio = balanceSheet.totalStockholdersEquity > 0 ? totalDebt / balanceSheet.totalStockholdersEquity : 0;
    const debtToAssetsRatio = balanceSheet.totalAssets > 0 ? totalDebt / balanceSheet.totalAssets : 0;
    const interestCoverageRatio = incomeStatement.interestExpense > 0 ? incomeStatement.operatingIncomeEBIT / incomeStatement.interestExpense : 99.9;
    const equityMultiplier = balanceSheet.totalStockholdersEquity > 0 ? balanceSheet.totalAssets / balanceSheet.totalStockholdersEquity : 1.0;

    // 4. Efficiency & Activity
    const inventory = Math.max(1, balanceSheet.inventory);
    const inventoryTurnoverRatio = incomeStatement.costOfGoodsSold / inventory;
    const daysSalesInInventoryDSI = inventoryTurnoverRatio > 0 ? 365 / inventoryTurnoverRatio : 0;

    const receivables = Math.max(1, balanceSheet.accountsReceivable);
    const receivablesTurnoverRatio = netRevenue / receivables;
    const daysSalesOutstandingDSO = receivablesTurnoverRatio > 0 ? 365 / receivablesTurnoverRatio : 0;

    const payables = Math.max(1, balanceSheet.accountsPayable);
    const payablesTurnoverRatio = incomeStatement.costOfGoodsSold / payables;
    const daysPayablesOutstandingDPO = payablesTurnoverRatio > 0 ? 365 / payablesTurnoverRatio : 0;

    const cashConversionCycleDays = daysSalesInInventoryDSI + daysSalesOutstandingDSO - daysPayablesOutstandingDPO;
    const assetTurnoverRatio = balanceSheet.totalAssets > 0 ? netRevenue / balanceSheet.totalAssets : 0;

    // 5. Altman Z-Score for Manufacturing Enterprises:
    // Z = 1.2 * X1 + 1.4 * X2 + 3.3 * X3 + 0.6 * X4 + 0.999 * X5
    // X1 = Working Capital / Total Assets
    // X2 = Retained Earnings / Total Assets
    // X3 = EBIT / Total Assets
    // X4 = Market Value of Equity / Total Liabilities
    // X5 = Net Revenue / Total Assets
    const totalAssets = Math.max(1, balanceSheet.totalAssets);
    const totalLiabilities = Math.max(1, balanceSheet.totalLiabilities);
    const mktEquity = marketValueOfEquity || balanceSheet.totalStockholdersEquity;

    const X1 = workingCapital / totalAssets;
    const X2 = balanceSheet.retainedEarnings / totalAssets;
    const X3 = incomeStatement.operatingIncomeEBIT / totalAssets;
    const X4 = mktEquity / totalLiabilities;
    const X5 = netRevenue / totalAssets;

    const altmanZScore = Number((1.2 * X1 + 1.4 * X2 + 3.3 * X3 + 0.6 * X4 + 0.999 * X5).toFixed(2));

    let bankruptcyZone: ComprehensiveFinancialRatios['bankruptcyZone'] = 'SAFE_ZONE';
    if (altmanZScore < 1.81) {
      bankruptcyZone = 'DISTRESS_ZONE';
    } else if (altmanZScore <= 2.99) {
      bankruptcyZone = 'GREY_ZONE';
    }

    return {
      currentRatio: Number(currentRatio.toFixed(2)),
      quickRatioAcidTest: Number(quickRatioAcidTest.toFixed(2)),
      cashRatio: Number(cashRatio.toFixed(2)),
      workingCapital: Number(workingCapital.toFixed(2)),
      grossProfitMarginPct: Number(grossProfitMarginPct.toFixed(2)),
      operatingProfitMarginPct: Number(operatingProfitMarginPct.toFixed(2)),
      netProfitMarginPct: Number(netProfitMarginPct.toFixed(2)),
      returnOnAssetsROAPct: Number(returnOnAssetsROAPct.toFixed(2)),
      returnOnEquityROEPct: Number(returnOnEquityROEPct.toFixed(2)),
      ebitdaMarginPct: Number(ebitdaMarginPct.toFixed(2)),
      debtToEquityRatio: Number(debtToEquityRatio.toFixed(2)),
      debtToAssetsRatio: Number(debtToAssetsRatio.toFixed(2)),
      interestCoverageRatio: Number(interestCoverageRatio.toFixed(2)),
      equityMultiplier: Number(equityMultiplier.toFixed(2)),
      inventoryTurnoverRatio: Number(inventoryTurnoverRatio.toFixed(2)),
      daysSalesInInventoryDSI: Number(daysSalesInInventoryDSI.toFixed(1)),
      receivablesTurnoverRatio: Number(receivablesTurnoverRatio.toFixed(2)),
      daysSalesOutstandingDSO: Number(daysSalesOutstandingDSO.toFixed(1)),
      payablesTurnoverRatio: Number(payablesTurnoverRatio.toFixed(2)),
      daysPayablesOutstandingDPO: Number(daysPayablesOutstandingDPO.toFixed(1)),
      cashConversionCycleDays: Number(cashConversionCycleDays.toFixed(1)),
      assetTurnoverRatio: Number(assetTurnoverRatio.toFixed(2)),
      altmanZScore,
      bankruptcyZone,
    };
  }
}
