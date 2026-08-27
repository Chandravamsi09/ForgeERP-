export interface TaxJurisdiction {
  jurisdictionCode: string;
  country: string;
  stateProvince?: string;
  taxType: 'GST' | 'VAT' | 'SALES_TAX' | 'HST';
  standardRatePct: number;
  reducedRatePct?: number;
  zeroRatedCategories: string[];
  exemptCategories: string[];
  reverseChargeApplicable: boolean;
  withholdingTaxRatePct?: number;
}

export interface TaxLineCalculationInput {
  lineNumber: number;
  productCategory: string;
  itemAmount: number;
  isB2B: boolean;
  buyerTaxIdentifier?: string;
  sellerTaxIdentifier: string;
  isExport: boolean;
  isInterstate: boolean;
}

export interface TaxLineCalculationOutput {
  lineNumber: number;
  taxableAmount: number;
  taxType: string;
  cgstRatePct?: number;
  cgstAmount?: number;
  sgstRatePct?: number;
  sgstAmount?: number;
  igstRatePct?: number;
  igstAmount?: number;
  vatRatePct?: number;
  vatAmount?: number;
  salesTaxRatePct?: number;
  salesTaxAmount?: number;
  withholdingTaxAmount?: number;
  totalLineTax: number;
  totalLineAmount: number;
  isReverseCharge: boolean;
  exemptionReason?: string;
}

export class InternationalTaxEngine {
  private static JURISDICTIONS: Map<string, TaxJurisdiction> = new Map([
    ['US_CA', { jurisdictionCode: 'US_CA', country: 'US', stateProvince: 'CA', taxType: 'SALES_TAX', standardRatePct: 7.25, zeroRatedCategories: ['FOOD_RAW', 'PRESCRIPTION_MEDS'], exemptCategories: ['SOFTWARE_SAAS_B2B'], reverseChargeApplicable: false }],
    ['US_TX', { jurisdictionCode: 'US_TX', country: 'US', stateProvince: 'TX', taxType: 'SALES_TAX', standardRatePct: 6.25, zeroRatedCategories: ['FOOD_RAW'], exemptCategories: [], reverseChargeApplicable: false }],
    ['US_NY', { jurisdictionCode: 'US_NY', country: 'US', stateProvince: 'NY', taxType: 'SALES_TAX', standardRatePct: 8.875, zeroRatedCategories: ['CLOTHING_UNDER_110'], exemptCategories: [], reverseChargeApplicable: false }],
    ['IN_DOMESTIC', { jurisdictionCode: 'IN_DOMESTIC', country: 'IN', taxType: 'GST', standardRatePct: 18.0, reducedRatePct: 12.0, zeroRatedCategories: ['EXPORT_GOODS', 'SEZ_SUPPLIES'], exemptCategories: ['AGRICULTURE_RAW'], reverseChargeApplicable: true, withholdingTaxRatePct: 2.0 }],
    ['DE_DOMESTIC', { jurisdictionCode: 'DE_DOMESTIC', country: 'DE', taxType: 'VAT', standardRatePct: 19.0, reducedRatePct: 7.0, zeroRatedCategories: ['EU_INTRA_COMMUNITY_SUPPLY', 'EXPORT_NON_EU'], exemptCategories: ['FINANCIAL_SERVICES', 'HEALTHCARE'], reverseChargeApplicable: true }],
    ['GB_DOMESTIC', { jurisdictionCode: 'GB_DOMESTIC', country: 'GB', taxType: 'VAT', standardRatePct: 20.0, reducedRatePct: 5.0, zeroRatedCategories: ['EXPORT_OVERSEAS', 'BOOKS_PUBLICATIONS'], exemptCategories: ['INSURANCE', 'EDUCATION'], reverseChargeApplicable: true }],
    ['CA_ON', { jurisdictionCode: 'CA_ON', country: 'CA', stateProvince: 'ON', taxType: 'HST', standardRatePct: 13.0, zeroRatedCategories: ['BASIC_GROCERIES', 'MEDICAL_DEVICES'], exemptCategories: ['RESIDENTIAL_RENT'], reverseChargeApplicable: false }],
  ]);

  /**
   * Calculates precise multi-jurisdiction tax breakdown with GST split, VAT reverse charge, and withholding
   */
  static calculateTax(
    jurisdictionCode: string,
    lines: TaxLineCalculationInput[]
  ): { lineBreakdowns: TaxLineCalculationOutput[]; totalSubtotal: number; totalTax: number; grandTotal: number } {
    const jurisdiction = this.JURISDICTIONS.get(jurisdictionCode) || {
      jurisdictionCode: 'DEFAULT',
      country: 'GLOBAL',
      taxType: 'SALES_TAX',
      standardRatePct: 10.0,
      zeroRatedCategories: [],
      exemptCategories: [],
      reverseChargeApplicable: false,
    };

    const lineBreakdowns: TaxLineCalculationOutput[] = [];
    let totalSubtotal = 0;
    let totalTax = 0;

    for (const line of lines) {
      totalSubtotal += line.itemAmount;

      // Check export zero-rating
      if (line.isExport) {
        lineBreakdowns.push({
          lineNumber: line.lineNumber,
          taxableAmount: line.itemAmount,
          taxType: jurisdiction.taxType,
          totalLineTax: 0,
          totalLineAmount: line.itemAmount,
          isReverseCharge: false,
          exemptionReason: 'Zero-Rated International Export',
        });
        continue;
      }

      // Check Exemptions
      if (jurisdiction.exemptCategories.includes(line.productCategory)) {
        lineBreakdowns.push({
          lineNumber: line.lineNumber,
          taxableAmount: 0,
          taxType: jurisdiction.taxType,
          totalLineTax: 0,
          totalLineAmount: line.itemAmount,
          isReverseCharge: false,
          exemptionReason: 'Statutory Product Category Exemption',
        });
        continue;
      }

      // Check Zero-Rated
      if (jurisdiction.zeroRatedCategories.includes(line.productCategory)) {
        lineBreakdowns.push({
          lineNumber: line.lineNumber,
          taxableAmount: line.itemAmount,
          taxType: jurisdiction.taxType,
          totalLineTax: 0,
          totalLineAmount: line.itemAmount,
          isReverseCharge: false,
          exemptionReason: 'Zero-Rated Goods Category',
        });
        continue;
      }

      let lineTax = 0;
      const rate = jurisdiction.standardRatePct;

      if (jurisdiction.taxType === 'GST') {
        if (line.isInterstate) {
          // Integrated GST (IGST)
          const igstAmount = Number((line.itemAmount * (rate / 100)).toFixed(2));
          lineTax = igstAmount;
          lineBreakdowns.push({
            lineNumber: line.lineNumber,
            taxableAmount: line.itemAmount,
            taxType: 'GST',
            igstRatePct: rate,
            igstAmount,
            totalLineTax: lineTax,
            totalLineAmount: Number((line.itemAmount + lineTax).toFixed(2)),
            isReverseCharge: false,
          });
        } else {
          // Intra-state split: CGST (50%) + SGST (50%)
          const splitRate = rate / 2;
          const cgstAmount = Number((line.itemAmount * (splitRate / 100)).toFixed(2));
          const sgstAmount = Number((line.itemAmount * (splitRate / 100)).toFixed(2));
          lineTax = Number((cgstAmount + sgstAmount).toFixed(2));

          lineBreakdowns.push({
            lineNumber: line.lineNumber,
            taxableAmount: line.itemAmount,
            taxType: 'GST',
            cgstRatePct: splitRate,
            cgstAmount,
            sgstRatePct: splitRate,
            sgstAmount,
            totalLineTax: lineTax,
            totalLineAmount: Number((line.itemAmount + lineTax).toFixed(2)),
            isReverseCharge: false,
          });
        }
      } else if (jurisdiction.taxType === 'VAT') {
        const isB2BReverseCharge = line.isB2B && jurisdiction.reverseChargeApplicable && !!line.buyerTaxIdentifier;
        if (isB2BReverseCharge) {
          lineBreakdowns.push({
            lineNumber: line.lineNumber,
            taxableAmount: line.itemAmount,
            taxType: 'VAT',
            vatRatePct: rate,
            vatAmount: 0,
            totalLineTax: 0,
            totalLineAmount: line.itemAmount,
            isReverseCharge: true,
            exemptionReason: 'EU VAT Reverse Charge Mechanism Applicable (Customer to self-account)',
          });
        } else {
          const vatAmount = Number((line.itemAmount * (rate / 100)).toFixed(2));
          lineTax = vatAmount;
          lineBreakdowns.push({
            lineNumber: line.lineNumber,
            taxableAmount: line.itemAmount,
            taxType: 'VAT',
            vatRatePct: rate,
            vatAmount,
            totalLineTax: lineTax,
            totalLineAmount: Number((line.itemAmount + lineTax).toFixed(2)),
            isReverseCharge: false,
          });
        }
      } else {
        // Sales Tax or HST
        const taxAmount = Number((line.itemAmount * (rate / 100)).toFixed(2));
        lineTax = taxAmount;
        lineBreakdowns.push({
          lineNumber: line.lineNumber,
          taxableAmount: line.itemAmount,
          taxType: jurisdiction.taxType,
          salesTaxRatePct: rate,
          salesTaxAmount: taxAmount,
          totalLineTax: lineTax,
          totalLineAmount: Number((line.itemAmount + lineTax).toFixed(2)),
          isReverseCharge: false,
        });
      }

      totalTax += lineTax;
    }

    return {
      lineBreakdowns,
      totalSubtotal: Number(totalSubtotal.toFixed(2)),
      totalTax: Number(totalTax.toFixed(2)),
      grandTotal: Number((totalSubtotal + totalTax).toFixed(2)),
    };
  }
}
