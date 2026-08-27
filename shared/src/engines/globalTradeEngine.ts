export interface HSCodeTariffRule {
  hsCode: string; // 6 to 10-digit Harmonized System code (e.g. '8483.40.00')
  description: string;
  countryOfOrigin: string;
  destinationCountry: string;
  baseAdValoremDutyRatePercentage: number; // e.g. 4.5%
  antiDumpingDutyRatePercentage?: number; // e.g. 2.0%
  customsProcessingFeeFixed?: number; // e.g. $31.67
}

export interface CustomsValuationInput {
  goodsFobValue: number;
  internationalFreightCost: number;
  marineInsuranceCost: number;
  currency: string;
  exchangeRateToDomestic: number;
  tariffRule: HSCodeTariffRule;
}

export interface CustomsDutyCalculationResult {
  fobValueDomestic: number;
  cifCustomsValueDomestic: number;
  baseDutyAmount: number;
  antiDumpingDutyAmount: number;
  processingFees: number;
  totalCustomsDutiesAndTaxes: number;
  effectiveLandedCostTotal: number;
}

export class GlobalTradeEngine {
  /**
   * Calculates Landed Cost and Customs Duty under international CIF (Cost, Insurance, Freight) valuation rules
   */
  static calculateDutyAndLandedCost(input: CustomsValuationInput): CustomsDutyCalculationResult {
    const fx = Math.max(0.0001, input.exchangeRateToDomestic);

    // 1. Convert FOB, Freight, Insurance to domestic currency
    const fobDomestic = Number((input.goodsFobValue * fx).toFixed(2));
    const freightDomestic = Number((input.internationalFreightCost * fx).toFixed(2));
    const insuranceDomestic = Number((input.marineInsuranceCost * fx).toFixed(2));

    // 2. CIF Customs Assessable Value = FOB + Freight + Insurance
    const cifCustomsValue = Number((fobDomestic + freightDomestic + insuranceDomestic).toFixed(2));

    // 3. Base Ad-Valorem Duty = CIF * Duty%
    const baseDuty = Number((cifCustomsValue * (input.tariffRule.baseAdValoremDutyRatePercentage / 100)).toFixed(2));

    // 4. Anti-Dumping Duty (if applicable)
    const antiDumpingRate = input.tariffRule.antiDumpingDutyRatePercentage || 0;
    const antiDumpingDuty = Number((cifCustomsValue * (antiDumpingRate / 100)).toFixed(2));

    // 5. Processing Fees
    const fees = input.tariffRule.customsProcessingFeeFixed || 0;

    // 6. Total Duties and Landed Cost
    const totalDuties = Number((baseDuty + antiDumpingDuty + fees).toFixed(2));
    const effectiveLandedCost = Number((cifCustomsValue + totalDuties).toFixed(2));

    return {
      fobValueDomestic: fobDomestic,
      cifCustomsValueDomestic: cifCustomsValue,
      baseDutyAmount: baseDuty,
      antiDumpingDutyAmount: antiDumpingDuty,
      processingFees: fees,
      totalCustomsDutiesAndTaxes: totalDuties,
      effectiveLandedCostTotal: effectiveLandedCost,
    };
  }
}
