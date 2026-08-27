export interface BOMNode {
  productId: string;
  sku: string;
  name: string;
  unitOfMeasure: string;
  quantityPerParent: number;
  scrapPercentage: number;
  effectiveQuantity: number;
  materialUnitCost: number;
  laborUnitCost: number;
  overheadUnitCost: number;
  totalUnitCost: number;
  level: number;
  children?: BOMNode[];
}

export interface WorkCenterCostRate {
  workCenterId: string;
  hourlyLaborRate: number;
  hourlyOverheadRate: number;
  efficiencyRating: number; // e.g. 0.85 for 85%
}

export interface RoutingStepCost {
  sequenceNumber: number;
  operationName: string;
  workCenterId: string;
  setupTimeMinutes: number;
  runTimeMinutesPerUnit: number;
  batchQuantity: number;
  workCenterRates: WorkCenterCostRate;
}

export interface CostRollupSummary {
  directMaterialCost: number;
  directLaborCost: number;
  machineOverheadCost: number;
  totalManufacturingCost: number;
  scrapAllowanceCost: number;
  standardCostPerUnit: number;
  indentedBOMTree: BOMNode;
  flattenedRequirements: Map<string, { sku: string; name: string; totalQuantityRequired: number; totalCost: number }>;
}

export class BOMRollupEngine {
  /**
   * Recursively explodes a multi-level BOM, compounding scrap percentage factors at each tier
   * Effective Quantity = Base Quantity * (1 + Scrap% / 100)
   */
  static calculateEffectiveQuantity(quantity: number, scrapPercentage: number): number {
    const scrapFactor = Math.max(0, scrapPercentage) / 100;
    return Number((quantity * (1 + scrapFactor)).toFixed(4));
  }

  /**
   * Calculates labor and machine overhead costs for sequential routing operations
   */
  static calculateRoutingCosts(steps: RoutingStepCost[], batchQuantity: number = 1): { directLabor: number; machineOverhead: number } {
    let totalLabor = 0;
    let totalOverhead = 0;

    for (const step of steps) {
      const batchSize = Math.max(1, batchQuantity);
      const setupTimePerUnit = step.setupTimeMinutes / batchSize;
      const totalTimePerUnitMinutes = (setupTimePerUnit + step.runTimeMinutesPerUnit) / Math.max(0.1, step.workCenterRates.efficiencyRating);
      const totalTimeHours = totalTimePerUnitMinutes / 60;

      const laborCost = totalTimeHours * step.workCenterRates.hourlyLaborRate;
      const overheadCost = totalTimeHours * step.workCenterRates.hourlyOverheadRate;

      totalLabor += laborCost;
      totalOverhead += overheadCost;
    }

    return {
      directLabor: Number(totalLabor.toFixed(4)),
      machineOverhead: Number(totalOverhead.toFixed(4)),
    };
  }

  /**
   * Recursively rolls up standard manufacturing costs across all sub-assemblies and raw materials
   */
  static explodeAndRollupCost(
    rootBOM: BOMNode,
    routingSteps: RoutingStepCost[] = [],
    batchSize: number = 1
  ): CostRollupSummary {
    const flattened = new Map<string, { sku: string; name: string; totalQuantityRequired: number; totalCost: number }>();

    let totalRawMaterialCost = 0;
    let totalScrapAllowanceCost = 0;

    const traverse = (node: BOMNode, parentMultiplier: number = 1, currentLevel: number = 0): number => {
      node.level = currentLevel;
      const effectiveQtyPerParent = this.calculateEffectiveQuantity(node.quantityPerParent, node.scrapPercentage);
      node.effectiveQuantity = effectiveQtyPerParent;
      const totalQuantityAtThisNode = effectiveQtyPerParent * parentMultiplier;

      // Base component material cost without scrap
      const baseCost = node.quantityPerParent * node.materialUnitCost;
      const scrapCost = (effectiveQtyPerParent - node.quantityPerParent) * node.materialUnitCost;

      if (!node.children || node.children.length === 0) {
        // Leaf component (Raw material)
        const nodeMaterialTotal = totalQuantityAtThisNode * node.materialUnitCost;
        totalRawMaterialCost += totalQuantityAtThisNode * node.materialUnitCost;
        totalScrapAllowanceCost += (effectiveQtyPerParent - node.quantityPerParent) * parentMultiplier * node.materialUnitCost;

        if (flattened.has(node.productId)) {
          const existing = flattened.get(node.productId)!;
          existing.totalQuantityRequired += totalQuantityAtThisNode;
          existing.totalCost += nodeMaterialTotal;
        } else {
          flattened.set(node.productId, {
            sku: node.sku,
            name: node.name,
            totalQuantityRequired: totalQuantityAtThisNode,
            totalCost: nodeMaterialTotal,
          });
        }

        node.totalUnitCost = Number((baseCost + scrapCost + node.laborUnitCost + node.overheadUnitCost).toFixed(4));
        return node.totalUnitCost;
      }

      // Sub-assembly: Roll up children costs recursively
      let rolledUpChildrenCost = 0;
      for (const child of node.children) {
        rolledUpChildrenCost += traverse(child, totalQuantityAtThisNode, currentLevel + 1);
      }

      node.materialUnitCost = Number(rolledUpChildrenCost.toFixed(4));
      node.totalUnitCost = Number((node.materialUnitCost + node.laborUnitCost + node.overheadUnitCost).toFixed(4));
      return node.totalUnitCost;
    };

    const rolledUpMaterialCost = traverse(rootBOM, 1, 0);
    const routing = this.calculateRoutingCosts(routingSteps, batchSize);

    const totalManufacturingCost = Number((rolledUpMaterialCost + routing.directLabor + routing.machineOverhead).toFixed(2));

    return {
      directMaterialCost: Number(rolledUpMaterialCost.toFixed(2)),
      directLaborCost: routing.directLabor,
      machineOverheadCost: routing.machineOverhead,
      scrapAllowanceCost: Number(totalScrapAllowanceCost.toFixed(2)),
      totalManufacturingCost,
      standardCostPerUnit: Number((totalManufacturingCost / Math.max(1, batchSize)).toFixed(2)),
      indentedBOMTree: rootBOM,
      flattenedRequirements: flattened,
    };
  }
}
