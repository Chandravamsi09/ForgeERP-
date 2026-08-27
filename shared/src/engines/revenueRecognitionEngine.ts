export interface PerformanceObligation {
  obligationId: string;
  description: string;
  standaloneSellingPrice: number; // SSP
  allocatedTransactionPrice?: number;
  recognitionType: 'POINT_IN_TIME' | 'OVER_TIME_MONTHLY';
  startDate?: Date;
  endDate?: Date;
  isSatisfied: boolean;
  satisfiedDate?: Date;
}

export interface ASC606Contract {
  contractId: string;
  totalTransactionPrice: number;
  currency: string;
  obligations: PerformanceObligation[];
}

export interface RevenueSchedulePeriod {
  periodMonth: number;
  periodYear: number;
  recognizedRevenue: number;
  deferredRevenueBalance: number;
  obligationId: string;
}

export class RevenueRecognitionEngine {
  /**
   * Step 4 of ASC 606: Allocates transaction price across Performance Obligations based on relative Standalone Selling Price (SSP)
   */
  static allocateTransactionPrice(contract: ASC606Contract): ASC606Contract {
    const totalSSP = contract.obligations.reduce((sum, o) => sum + o.standaloneSellingPrice, 0);

    if (totalSSP <= 0) {
      const equalShare = contract.totalTransactionPrice / Math.max(1, contract.obligations.length);
      contract.obligations.forEach((o) => (o.allocatedTransactionPrice = Number(equalShare.toFixed(2))));
      return contract;
    }

    let allocatedSum = 0;
    contract.obligations.forEach((ob, idx) => {
      if (idx === contract.obligations.length - 1) {
        // Last obligation absorbs rounding difference
        ob.allocatedTransactionPrice = Number((contract.totalTransactionPrice - allocatedSum).toFixed(2));
      } else {
        const share = (ob.standaloneSellingPrice / totalSSP) * contract.totalTransactionPrice;
        ob.allocatedTransactionPrice = Number(share.toFixed(2));
        allocatedSum += ob.allocatedTransactionPrice;
      }
    });

    return contract;
  }

  /**
   * Generates month-by-month deferred revenue amortization schedule
   */
  static generateAmortizationSchedule(
    obligation: PerformanceObligation,
    startYear: number = new Date().getFullYear(),
    startMonth: number = new Date().getMonth() + 1,
    durationMonths: number = 12
  ): RevenueSchedulePeriod[] {
    const schedule: RevenueSchedulePeriod[] = [];
    const totalAllocated = obligation.allocatedTransactionPrice || obligation.standaloneSellingPrice;

    if (obligation.recognitionType === 'POINT_IN_TIME') {
      schedule.push({
        periodYear: startYear,
        periodMonth: startMonth,
        recognizedRevenue: totalAllocated,
        deferredRevenueBalance: 0,
        obligationId: obligation.obligationId,
      });
      return schedule;
    }

    const monthlyAmount = Number((totalAllocated / durationMonths).toFixed(2));
    let remainingDeferred = totalAllocated;

    for (let m = 0; m < durationMonths; m++) {
      const currentMonth = ((startMonth - 1 + m) % 12) + 1;
      const currentYear = startYear + Math.floor((startMonth - 1 + m) / 12);

      const revenueThisMonth = m === durationMonths - 1 ? remainingDeferred : Math.min(monthlyAmount, remainingDeferred);
      remainingDeferred = Number((remainingDeferred - revenueThisMonth).toFixed(2));

      schedule.push({
        periodYear: currentYear,
        periodMonth: currentMonth,
        recognizedRevenue: revenueThisMonth,
        deferredRevenueBalance: Math.max(0, remainingDeferred),
        obligationId: obligation.obligationId,
      });
    }

    return schedule;
  }
}
