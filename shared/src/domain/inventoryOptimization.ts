export interface DemandTimeSeriesPoint {
  periodDate: Date;
  actualDemandUnits: number;
}

export interface InventorySafetyStockResult {
  meanDemandPerPeriod: number;
  demandStandardDeviation: number;
  serviceLevelZScore: number;
  safetyStockUnits: number;
  reorderPointUnits: number;
  economicOrderQuantityEOQ: number;
  annualHoldingCostTotal: number;
  annualOrderingCostTotal: number;
  totalAnnualInventoryCost: number;
  abcClassification: 'A_HIGH_VALUE' | 'B_MEDIUM_VALUE' | 'C_LOW_VALUE';
  xyzPredictability: 'X_STEADY' | 'Y_VARIABLE' | 'Z_VOLATILE';
}

export class InventoryOptimizationEngine {
  private static SERVICE_LEVEL_Z_TABLE: Record<number, number> = {
    90: 1.282,
    95: 1.645,
    97.5: 1.960,
    98: 2.054,
    99: 2.326,
    99.5: 2.576,
    99.9: 3.090,
  };

  static computeSafetyStockAndROP(
    demandHistory: DemandTimeSeriesPoint[],
    leadTimePeriods: number,
    leadTimeStdDevPeriods: number,
    desiredServiceLevelPct: number,
    unitCost: number,
    annualDemandUnits: number,
    orderPlacementCost: number,
    holdingCostRatePct: number = 0.20
  ): InventorySafetyStockResult {
    const n = Math.max(1, demandHistory.length);
    const meanDemand = demandHistory.reduce((sum, d) => sum + d.actualDemandUnits, 0) / n;
    
    const variance = demandHistory.reduce((sum, d) => sum + Math.pow(d.actualDemandUnits - meanDemand, 2), 0) / n;
    const stdDevDemand = Math.sqrt(variance);

    const zScore = this.SERVICE_LEVEL_Z_TABLE[desiredServiceLevelPct] || 1.645;

    // Safety Stock equation with variable lead time & variable demand:
    // SS = Z * sqrt( L * sigma_D^2 + D_bar^2 * sigma_L^2 )
    const demandVarianceTerm = leadTimePeriods * Math.pow(stdDevDemand, 2);
    const leadTimeVarianceTerm = Math.pow(meanDemand, 2) * Math.pow(leadTimeStdDevPeriods, 2);
    const combinedStdDev = Math.sqrt(demandVarianceTerm + leadTimeVarianceTerm);

    const safetyStock = Math.ceil(zScore * combinedStdDev);
    const reorderPoint = Math.ceil(meanDemand * leadTimePeriods + safetyStock);

    // Wilson EOQ
    const holdingCostPerUnitYear = unitCost * holdingCostRatePct;
    const eoq = Math.ceil(Math.sqrt((2 * annualDemandUnits * orderPlacementCost) / Math.max(0.01, holdingCostPerUnitYear)));

    const annualOrderingCost = (annualDemandUnits / Math.max(1, eoq)) * orderPlacementCost;
    const annualHoldingCost = (eoq / 2) * holdingCostPerUnitYear;
    const totalCost = annualOrderingCost + annualHoldingCost;

    // ABC / XYZ
    const cv = stdDevDemand / Math.max(0.001, meanDemand);
    const xyz: InventorySafetyStockResult['xyzPredictability'] = cv < 0.2 ? 'X_STEADY' : cv < 0.5 ? 'Y_VARIABLE' : 'Z_VOLATILE';
    const annualValuation = annualDemandUnits * unitCost;
    const abc: InventorySafetyStockResult['abcClassification'] = annualValuation > 100000 ? 'A_HIGH_VALUE' : annualValuation > 25000 ? 'B_MEDIUM_VALUE' : 'C_LOW_VALUE';

    return {
      meanDemandPerPeriod: Number(meanDemand.toFixed(2)),
      demandStandardDeviation: Number(stdDevDemand.toFixed(2)),
      serviceLevelZScore: zScore,
      safetyStockUnits: safetyStock,
      reorderPointUnits: reorderPoint,
      economicOrderQuantityEOQ: eoq,
      annualHoldingCostTotal: Number(annualHoldingCost.toFixed(2)),
      annualOrderingCostTotal: Number(annualOrderingCost.toFixed(2)),
      totalAnnualInventoryCost: Number(totalCost.toFixed(2)),
      abcClassification: abc,
      xyzPredictability: xyz,
    };
  }
}
