export interface FMEAItem {
  itemTag: string;
  componentName: string;
  failureMode: string;
  failureEffect: string;
  potentialCause: string;
  severityScore: number; // 1-10
  occurrenceScore: number; // 1-10
  detectionScore: number; // 1-10
  recommendedAction: string;
  actionOwner: string;
}

export interface FMEAEvaluationResult {
  itemTag: string;
  riskPriorityNumberRPN: number;
  criticalityClassification: 'CRITICAL_RISK' | 'HIGH_RISK' | 'MODERATE_RISK' | 'LOW_RISK';
  correctiveActionMandatory: boolean;
}

export class FMEAReliabilityEngine {
  static evaluateFMEA(items: FMEAItem[]): FMEAEvaluationResult[] {
    return items.map(item => {
      const rpn = item.severityScore * item.occurrenceScore * item.detectionScore;
      let classification: FMEAEvaluationResult['criticalityClassification'] = 'LOW_RISK';

      if (rpn >= 200 || item.severityScore >= 9) {
        classification = 'CRITICAL_RISK';
      } else if (rpn >= 120) {
        classification = 'HIGH_RISK';
      } else if (rpn >= 60) {
        classification = 'MODERATE_RISK';
      }

      return {
        itemTag: item.itemTag,
        riskPriorityNumberRPN: rpn,
        criticalityClassification: classification,
        correctiveActionMandatory: rpn >= 120 || item.severityScore >= 9,
      };
    });
  }

  static computeWeibullReliability(timeHours: number, characteristicLifeEta: number, shapeParameterBeta: number): number {
    if (timeHours <= 0 || characteristicLifeEta <= 0) return 1.0;
    const reliability = Math.exp(-Math.pow(timeHours / characteristicLifeEta, shapeParameterBeta));
    return Number(reliability.toFixed(4));
  }
}
