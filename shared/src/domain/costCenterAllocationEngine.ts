export interface CostCenter {
  centerId: string;
  name: string;
  type: 'SERVICE' | 'PRODUCTION';
  directCosts: number;
  allocationBasis: 'SQUARE_METERS' | 'HEADCOUNT' | 'MACHINE_HOURS' | 'DIRECT_LABOR_HOURS';
  allocationMetricValue: number;
}

export class CostCenterAllocationEngine {
  static performStepDownAllocation(
    serviceCenters: CostCenter[],
    productionCenters: CostCenter[],
    serviceToProdMatrix: Record<string, Record<string, number>>
  ): { finalProductionCenterCosts: { centerId: string; name: string; directCost: number; allocatedServiceCost: number; totalCost: number }[] } {
    const prodCosts = new Map<string, { name: string; direct: number; allocated: number }>();
    productionCenters.forEach(p => prodCosts.set(p.centerId, { name: p.name, direct: p.directCosts, allocated: 0 }));

    for (const sc of serviceCenters) {
      const shares = serviceToProdMatrix[sc.centerId] || {};
      for (const [prodId, pct] of Object.entries(shares)) {
        if (prodCosts.has(prodId)) {
          const entry = prodCosts.get(prodId);
          if (entry) {
            entry.allocated += (sc.directCosts * pct) / 100;
          }
        }
      }
    }

    const results: any[] = [];
    for (const [id, data] of prodCosts.entries()) {
      results.push({
        centerId: id,
        name: data.name,
        directCost: Number(data.direct.toFixed(2)),
        allocatedServiceCost: Number(data.allocated.toFixed(2)),
        totalCost: Number((data.direct + data.allocated).toFixed(2)),
      });
    }

    return { finalProductionCenterCosts: results };
  }
}
