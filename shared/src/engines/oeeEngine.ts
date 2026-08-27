export interface OEEShiftInput {
  shiftDurationMinutes: number;
  plannedBreaksMinutes: number;
  plannedMaintenanceMinutes: number;
  unplannedDowntimeMinutes: number;
  downtimeIncidentsCount: number;
  idealCycleTimeSeconds: number; // Design standard speed to produce 1 unit
  totalUnitsProduced: number;
  rejectedDefectiveUnits: number;
}

export interface OEEResult {
  plannedProductionTimeMinutes: number;
  operatingTimeMinutes: number;
  availabilityRate: number; // 0.0 to 1.0 (e.g. 0.90 for 90%)
  performanceRate: number;  // 0.0 to 1.0
  qualityRate: number;      // 0.0 to 1.0
  oeePercentage: number;    // 0.0 to 100.0%
  goodUnitsCount: number;
  scrapUnitsCount: number;
  mtbfMinutes: number;      // Mean Time Between Failures
  mttrMinutes: number;      // Mean Time To Repair
  classification: 'WORLD_CLASS' | 'EXCELLENT' | 'TYPICAL' | 'NEEDS_IMPROVEMENT';
}

export class OEEEngine {
  /**
   * Calculates overall equipment effectiveness and reliability statistics
   */
  static calculateOEE(input: OEEShiftInput): OEEResult {
    // 1. Planned Production Time (PPT)
    const plannedProductionTimeMinutes = Math.max(
      1,
      input.shiftDurationMinutes - (input.plannedBreaksMinutes + input.plannedMaintenanceMinutes)
    );

    // 2. Operating Time
    const operatingTimeMinutes = Math.max(
      0,
      plannedProductionTimeMinutes - input.unplannedDowntimeMinutes
    );

    // 3. Availability = Operating Time / Planned Production Time
    const availabilityRate = Number((operatingTimeMinutes / plannedProductionTimeMinutes).toFixed(4));

    // 4. Performance = (Ideal Cycle Time (min) * Total Units) / Operating Time (min)
    const idealCycleTimeMinutes = input.idealCycleTimeSeconds / 60;
    const standardOperatingTimeNeeded = idealCycleTimeMinutes * input.totalUnitsProduced;
    const rawPerformance = operatingTimeMinutes > 0 ? standardOperatingTimeNeeded / operatingTimeMinutes : 0;
    const performanceRate = Number(Math.min(1.0, Math.max(0, rawPerformance)).toFixed(4));

    // 5. Quality = Good Units / Total Units
    const goodUnitsCount = Math.max(0, input.totalUnitsProduced - input.rejectedDefectiveUnits);
    const scrapUnitsCount = input.rejectedDefectiveUnits;
    const rawQuality = input.totalUnitsProduced > 0 ? goodUnitsCount / input.totalUnitsProduced : 1.0;
    const qualityRate = Number(Math.min(1.0, Math.max(0, rawQuality)).toFixed(4));

    // 6. Total OEE = Availability * Performance * Quality * 100
    const oeeFraction = availabilityRate * performanceRate * qualityRate;
    const oeePercentage = Number((oeeFraction * 100).toFixed(2));

    // 7. Reliability Metrics: MTBF and MTTR
    const failureCount = Math.max(1, input.downtimeIncidentsCount);
    const mtbfMinutes = input.downtimeIncidentsCount > 0 ? Number((operatingTimeMinutes / failureCount).toFixed(1)) : operatingTimeMinutes;
    const mttrMinutes = input.downtimeIncidentsCount > 0 ? Number((input.unplannedDowntimeMinutes / failureCount).toFixed(1)) : 0;

    // Classification standard benchmark
    let classification: OEEResult['classification'] = 'NEEDS_IMPROVEMENT';
    if (oeePercentage >= 85.0) {
      classification = 'WORLD_CLASS';
    } else if (oeePercentage >= 75.0) {
      classification = 'EXCELLENT';
    } else if (oeePercentage >= 60.0) {
      classification = 'TYPICAL';
    }

    return {
      plannedProductionTimeMinutes,
      operatingTimeMinutes,
      availabilityRate,
      performanceRate,
      qualityRate,
      oeePercentage,
      goodUnitsCount,
      scrapUnitsCount,
      mtbfMinutes,
      mttrMinutes,
      classification,
    };
  }
}
