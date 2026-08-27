export enum LotSizingRule {
  LOT_FOR_LOT = 'LOT_FOR_LOT',
  FIXED_ORDER_QUANTITY = 'FIXED_ORDER_QUANTITY',
  ECONOMIC_ORDER_QUANTITY = 'ECONOMIC_ORDER_QUANTITY',
  PERIOD_ORDER_QUANTITY = 'PERIOD_ORDER_QUANTITY'
}

export interface MRPTimeBucket {
  periodIndex: number;
  periodStartDate: Date;
  grossRequirement: number;
  scheduledReceipt: number;
  projectedAvailableBalance: number;
  netRequirement: number;
  plannedOrderReceipt: number;
  plannedOrderRelease: number;
  plannedOrderReleaseDate: Date;
}

export interface MRPItemParameters {
  productId: string;
  sku: string;
  currentOnHand: number;
  safetyStock: number;
  leadTimeDays: number;
  lotSizingRule: LotSizingRule;
  fixedBatchSize?: number;
  annualDemand?: number;
  orderingCost?: number;
  holdingCostPerUnitYear?: number;
}

export interface MRPDemandInput {
  date: Date;
  quantity: number;
  sourceType: 'SALES_ORDER' | 'FORECAST' | 'DEPENDENT_DEMAND';
}

export interface MRPScheduledReceiptInput {
  date: Date;
  quantity: number;
  sourceType: 'PURCHASE_ORDER' | 'WORK_ORDER';
}

export interface MRPPlanResult {
  productId: string;
  sku: string;
  planningHorizonDays: number;
  totalGrossRequirements: number;
  totalNetRequirements: number;
  totalPlannedOrders: number;
  timeBuckets: MRPTimeBucket[];
  actionMessages: {
    periodIndex: number;
    actionType: 'RELEASE_PURCHASE_ORDER' | 'RELEASE_WORK_ORDER' | 'EXPEDITE' | 'POSTPONE' | 'LOW_SAFETY_STOCK';
    suggestedDate: Date;
    quantity: number;
    reason: string;
  }[];
}

export class MRPNettingEngine {
  /**
   * Calculates Economic Order Quantity (EOQ) = sqrt((2 * Demand * OrderingCost) / HoldingCost)
   */
  static calculateEOQ(annualDemand: number, orderingCost: number, holdingCost: number): number {
    if (annualDemand <= 0 || orderingCost <= 0 || holdingCost <= 0) return 1;
    const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
    return Math.ceil(eoq);
  }

  /**
   * Applies the configured Lot Sizing Rule to net requirements
   */
  static applyLotSizing(netRequirement: number, params: MRPItemParameters): number {
    if (netRequirement <= 0) return 0;

    switch (params.lotSizingRule) {
      case LotSizingRule.LOT_FOR_LOT:
        return netRequirement;

      case LotSizingRule.FIXED_ORDER_QUANTITY: {
        const batch = Math.max(1, params.fixedBatchSize || 50);
        return Math.ceil(netRequirement / batch) * batch;
      }

      case LotSizingRule.ECONOMIC_ORDER_QUANTITY: {
        const eoq = this.calculateEOQ(
          params.annualDemand || 1000,
          params.orderingCost || 100,
          params.holdingCostPerUnitYear || 10
        );
        return Math.ceil(netRequirement / eoq) * eoq;
      }

      case LotSizingRule.PERIOD_ORDER_QUANTITY:
        return netRequirement;

      default:
        return netRequirement;
    }
  }

  /**
   * Executes the Time-Phased Gross-to-Net MRP Netting Algorithm
   */
  static executeNetting(
    params: MRPItemParameters,
    demands: MRPDemandInput[],
    scheduledReceipts: MRPScheduledReceiptInput[],
    startDate: Date = new Date(),
    numberOfBuckets: number = 12,
    bucketDays: number = 7 // Weekly buckets by default
  ): MRPPlanResult {
    const buckets: MRPTimeBucket[] = [];
    const actionMessages: MRPPlanResult['actionMessages'] = [];

    let currentPAB = params.currentOnHand;
    let totalGross = 0;
    let totalNet = 0;
    let totalPlanned = 0;

    for (let i = 0; i < numberOfBuckets; i++) {
      const bucketStart = new Date(startDate.getTime() + i * bucketDays * 24 * 60 * 60 * 1000);
      const bucketEnd = new Date(bucketStart.getTime() + bucketDays * 24 * 60 * 60 * 1000);

      // Aggregate demand for this time window
      const bucketGross = demands
        .filter((d) => d.date >= bucketStart && d.date < bucketEnd)
        .reduce((sum, d) => sum + d.quantity, 0);

      // Aggregate scheduled receipts for this time window
      const bucketScheduledReceipt = scheduledReceipts
        .filter((r) => r.date >= bucketStart && r.date < bucketEnd)
        .reduce((sum, r) => sum + r.quantity, 0);

      totalGross += bucketGross;

      // Net Requirement Equation: max(0, Gross - PAB_prev - ScheduledReceipts + SafetyStock)
      const availableBeforeNetting = currentPAB + bucketScheduledReceipt;
      const unbufferedDeficit = bucketGross + params.safetyStock - availableBeforeNetting;
      const netRequirement = Math.max(0, unbufferedDeficit);

      totalNet += netRequirement;

      // Apply Lot-Sizing
      const plannedOrderReceipt = this.applyLotSizing(netRequirement, params);
      totalPlanned += plannedOrderReceipt;

      // Calculate Planned Order Release Date with Lead Time Offset
      const leadTimeOffsetMs = params.leadTimeDays * 24 * 60 * 60 * 1000;
      const releaseDate = new Date(bucketStart.getTime() - leadTimeOffsetMs);

      // Update Projected Available Balance (PAB)
      currentPAB = availableBeforeNetting + plannedOrderReceipt - bucketGross;

      buckets.push({
        periodIndex: i + 1,
        periodStartDate: bucketStart,
        grossRequirement: bucketGross,
        scheduledReceipt: bucketScheduledReceipt,
        projectedAvailableBalance: currentPAB,
        netRequirement,
        plannedOrderReceipt,
        plannedOrderRelease: plannedOrderReceipt,
        plannedOrderReleaseDate: releaseDate,
      });

      // Action Messages Generation
      if (plannedOrderReceipt > 0) {
        actionMessages.push({
          periodIndex: i + 1,
          actionType: params.sku.startsWith('RAW') ? 'RELEASE_PURCHASE_ORDER' : 'RELEASE_WORK_ORDER',
          suggestedDate: releaseDate,
          quantity: plannedOrderReceipt,
          reason: `Net requirement of ${netRequirement} units in Period ${i + 1}`,
        });
      }

      if (currentPAB < params.safetyStock && netRequirement === 0) {
        actionMessages.push({
          periodIndex: i + 1,
          actionType: 'LOW_SAFETY_STOCK',
          suggestedDate: bucketStart,
          quantity: params.safetyStock - currentPAB,
          reason: `Projected balance (${currentPAB}) dropped below safety buffer (${params.safetyStock})`,
        });
      }
    }

    return {
      productId: params.productId,
      sku: params.sku,
      planningHorizonDays: numberOfBuckets * bucketDays,
      totalGrossRequirements: totalGross,
      totalNetRequirements: totalNet,
      totalPlannedOrders: totalPlanned,
      timeBuckets: buckets,
      actionMessages,
    };
  }
}
