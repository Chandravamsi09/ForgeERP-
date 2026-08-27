export enum DepreciationMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  DOUBLE_DECLINING_BALANCE = 'DOUBLE_DECLINING_BALANCE',
  MACRS_5_YEAR = 'MACRS_5_YEAR',
  MACRS_7_YEAR = 'MACRS_7_YEAR'
}

export interface AssetDepreciationScheduleItem {
  year: number;
  periodIndex: number; // 1-12 for monthly
  beginningBookValue: number;
  depreciationExpense: number;
  accumulatedDepreciation: number;
  endingBookValue: number;
}

export interface AssetCalculationParams {
  assetTag: string;
  initialCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  depreciationMethod: DepreciationMethod;
  inServiceDate: Date;
}

export class FixedAssetEngine {
  // IRS MACRS 5-year property half-year convention percentages
  private static MACRS_5_RATES = [0.20, 0.32, 0.192, 0.1152, 0.1152, 0.0576];
  // IRS MACRS 7-year property half-year convention percentages
  private static MACRS_7_RATES = [0.1429, 0.2449, 0.1749, 0.1249, 0.0893, 0.0892, 0.0893, 0.0446];

  /**
   * Computes multi-year month-by-month depreciation schedule and disposal gain/loss
   */
  static generateSchedule(params: AssetCalculationParams): AssetDepreciationScheduleItem[] {
    const schedule: AssetDepreciationScheduleItem[] = [];
    const totalPeriods = Math.max(1, params.usefulLifeYears * 12);
    let currentBookValue = params.initialCost;
    let accumulatedDepr = 0;

    const depreciableBase = Math.max(0, params.initialCost - params.salvageValue);

    switch (params.depreciationMethod) {
      case DepreciationMethod.STRAIGHT_LINE: {
        const monthlyDepreciation = Number((depreciableBase / totalPeriods).toFixed(2));

        for (let p = 1; p <= totalPeriods; p++) {
          const expense = Math.min(monthlyDepreciation, currentBookValue - params.salvageValue);
          const endValue = Number((currentBookValue - expense).toFixed(2));
          accumulatedDepr = Number((accumulatedDepr + expense).toFixed(2));

          schedule.push({
            year: Math.ceil(p / 12),
            periodIndex: ((p - 1) % 12) + 1,
            beginningBookValue: currentBookValue,
            depreciationExpense: expense,
            accumulatedDepreciation: accumulatedDepr,
            endingBookValue: Math.max(params.salvageValue, endValue),
          });

          currentBookValue = Math.max(params.salvageValue, endValue);
        }
        break;
      }

      case DepreciationMethod.DOUBLE_DECLINING_BALANCE: {
        const annualRate = 2.0 / params.usefulLifeYears;
        const monthlyRate = annualRate / 12;

        for (let p = 1; p <= totalPeriods; p++) {
          let expense = Number((currentBookValue * monthlyRate).toFixed(2));
          if (currentBookValue - expense < params.salvageValue) {
            expense = Math.max(0, Number((currentBookValue - params.salvageValue).toFixed(2)));
          }

          const endValue = Number((currentBookValue - expense).toFixed(2));
          accumulatedDepr = Number((accumulatedDepr + expense).toFixed(2));

          schedule.push({
            year: Math.ceil(p / 12),
            periodIndex: ((p - 1) % 12) + 1,
            beginningBookValue: currentBookValue,
            depreciationExpense: expense,
            accumulatedDepreciation: accumulatedDepr,
            endingBookValue: endValue,
          });

          currentBookValue = endValue;
        }
        break;
      }

      case DepreciationMethod.MACRS_5_YEAR:
      case DepreciationMethod.MACRS_7_YEAR: {
        const rates = params.depreciationMethod === DepreciationMethod.MACRS_5_YEAR ? this.MACRS_5_RATES : this.MACRS_7_RATES;
        let pCounter = 1;

        for (let y = 0; y < rates.length; y++) {
          const annualExpense = Number((params.initialCost * rates[y]).toFixed(2));
          const monthlyExpense = Number((annualExpense / 12).toFixed(2));

          for (let m = 1; m <= 12; m++) {
            const expense = m === 12 ? Number((annualExpense - monthlyExpense * 11).toFixed(2)) : monthlyExpense;
            const endValue = Number((currentBookValue - expense).toFixed(2));
            accumulatedDepr = Number((accumulatedDepr + expense).toFixed(2));

            schedule.push({
              year: y + 1,
              periodIndex: m,
              beginningBookValue: currentBookValue,
              depreciationExpense: expense,
              accumulatedDepreciation: accumulatedDepr,
              endingBookValue: Math.max(0, endValue),
            });

            currentBookValue = Math.max(0, endValue);
            pCounter++;
          }
        }
        break;
      }
    }

    return schedule;
  }

  /**
   * Calculates Gain or Loss on Asset Disposal / Scrapping
   */
  static calculateDisposalGainLoss(
    initialCost: number,
    accumulatedDepreciation: number,
    proceedsFromSale: number
  ): { netBookValueAtDisposal: number; gainOrLossAmount: number; isGain: boolean } {
    const netBookValue = Math.max(0, initialCost - accumulatedDepreciation);
    const difference = Number((proceedsFromSale - netBookValue).toFixed(2));

    return {
      netBookValueAtDisposal: netBookValue,
      gainOrLossAmount: Math.abs(difference),
      isGain: difference >= 0,
    };
  }
}
