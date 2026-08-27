export interface FXForwardContract {
  contractNumber: string;
  pair: string; // e.g. 'EUR/USD'
  notionalAmountForeign: number;
  forwardRateAgreed: number;
  spotRateAtMaturity: number;
  maturityDate: Date;
  isBuyForeign: boolean;
}

export class FXHedgingEngine {
  static evaluateForwardSettlement(contract: FXForwardContract): {
    gainLossDomestic: number;
    effectiveRate: number;
    isHedgeEffective: boolean;
  } {
    const rateDiff = contract.spotRateAtMaturity - contract.forwardRateAgreed;
    const multiplier = contract.isBuyForeign ? 1 : -1;
    const gainLoss = Number((contract.notionalAmountForeign * rateDiff * multiplier).toFixed(2));

    return {
      gainLossDomestic: gainLoss,
      effectiveRate: contract.forwardRateAgreed,
      isHedgeEffective: Math.abs(gainLoss) > 0,
    };
  }

  static calculateGarmanKohlhagenOptionPrice(
    spotRate: number,
    strikeRate: number,
    timeToMaturityYears: number,
    domesticRiskFreeRate: number,
    foreignRiskFreeRate: number,
    volatility: number,
    isCall: boolean
  ): number {
    const s = spotRate;
    const k = strikeRate;
    const t = timeToMaturityYears;
    const rd = domesticRiskFreeRate;
    const rf = foreignRiskFreeRate;
    const v = volatility;

    const d1 = (Math.log(s / k) + (rd - rf + (v * v) / 2) * t) / (v * Math.sqrt(t));
    const d2 = d1 - v * Math.sqrt(t);

    const normalCDF = (x: number): number => {
      const b1 = 0.319381530;
      const b2 = -0.356563782;
      const b3 = 1.781477937;
      const b4 = -1.821255978;
      const b5 = 1.330274429;
      const p = 0.2316419;
      const c = 0.39894228;
      if (x >= 0) {
        const kVal = 1.0 / (1.0 + p * x);
        return 1.0 - c * Math.exp((-x * x) / 2.0) * kVal * (b1 + kVal * (b2 + kVal * (b3 + kVal * (b4 + b5 * kVal))));
      } else {
        const kVal = 1.0 / (1.0 - p * x);
        return c * Math.exp((-x * x) / 2.0) * kVal * (b1 + kVal * (b2 + kVal * (b3 + kVal * (b4 + b5 * kVal))));
      }
    };

    if (isCall) {
      const price = s * Math.exp(-rf * t) * normalCDF(d1) - k * Math.exp(-rd * t) * normalCDF(d2);
      return Number(price.toFixed(4));
    } else {
      const price = k * Math.exp(-rd * t) * normalCDF(-d2) - s * Math.exp(-rf * t) * normalCDF(-d1);
      return Number(price.toFixed(4));
    }
  }
}
