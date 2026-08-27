export interface POLineMatchInput {
  poLineId: string;
  productId: string;
  quantityOrdered: number;
  unitPrice: number;
  taxPercentage: number;
}

export interface GRNLineMatchInput {
  grnLineId: string;
  poLineId: string;
  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;
}

export interface VendorInvoiceLineMatchInput {
  invoiceLineId: string;
  poLineId: string;
  quantityInvoiced: number;
  unitPriceInvoiced: number;
  taxAmountInvoiced: number;
}

export interface MatchToleranceRules {
  maxPriceVariancePercentage: number; // e.g. 2.0%
  maxQuantityVariancePercentage: number; // e.g. 0.0% (strict)
  maxTotalAmountVarianceAbsolute: number; // e.g. $5.00
}

export interface LineMatchResult {
  poLineId: string;
  status: 'EXACT_MATCH' | 'PRICE_TOLERANCE_PASS' | 'QUANTITY_TOLERANCE_PASS' | 'PRICE_MISMATCH' | 'QUANTITY_MISMATCH' | 'GRN_MISSING';
  orderedQty: number;
  receivedQty: number;
  invoicedQty: number;
  poUnitPrice: number;
  invoiceUnitPrice: number;
  priceVariancePct: number;
  quantityVariancePct: number;
  varianceAmount: number;
  discrepancyNote?: string;
}

export interface ThreeWayMatchSummary {
  overallStatus: 'PASSED' | 'PASSED_WITH_TOLERANCE' | 'FAILED_DISCREPANCY' | 'HOLD_FOR_APPROVAL';
  canAutoApprovePayment: boolean;
  totalPOAmount: number;
  totalInvoiceAmount: number;
  totalPriceVariance: number;
  totalQuantityVariance: number;
  lineResults: LineMatchResult[];
}

export class ThreeWayMatchEngine {
  /**
   * Executes 3-Way Matching between Purchase Order, Goods Receipt Note, and Vendor Invoice
   */
  static evaluateMatch(
    poLines: POLineMatchInput[],
    grnLines: GRNLineMatchInput[],
    invoiceLines: VendorInvoiceLineMatchInput[],
    tolerances: MatchToleranceRules = {
      maxPriceVariancePercentage: 2.0,
      maxQuantityVariancePercentage: 0.0,
      maxTotalAmountVarianceAbsolute: 5.0,
    }
  ): ThreeWayMatchSummary {
    const lineResults: LineMatchResult[] = [];

    let totalPOAmount = 0;
    let totalInvoiceAmount = 0;
    let totalPriceVariance = 0;
    let totalQuantityVariance = 0;
    let hasHardMismatch = false;
    let hasTolerancePass = false;

    for (const poLine of poLines) {
      const linePOTotal = poLine.quantityOrdered * poLine.unitPrice;
      totalPOAmount += linePOTotal;

      const grn = grnLines.find((g) => g.poLineId === poLine.poLineId);
      const inv = invoiceLines.find((i) => i.poLineId === poLine.poLineId);

      if (!inv) {
        lineResults.push({
          poLineId: poLine.poLineId,
          status: 'QUANTITY_MISMATCH',
          orderedQty: poLine.quantityOrdered,
          receivedQty: grn?.quantityAccepted || 0,
          invoicedQty: 0,
          poUnitPrice: poLine.unitPrice,
          invoiceUnitPrice: 0,
          priceVariancePct: 0,
          quantityVariancePct: 100,
          varianceAmount: 0,
          discrepancyNote: 'Line missing on Vendor Invoice',
        });
        hasHardMismatch = true;
        continue;
      }

      const invoicedQty = inv.quantityInvoiced;
      const receivedQty = grn?.quantityAccepted || 0;
      const invoiceUnitPrice = inv.unitPriceInvoiced;

      const lineInvoiceTotal = invoicedQty * invoiceUnitPrice;
      totalInvoiceAmount += lineInvoiceTotal;

      if (!grn || receivedQty === 0) {
        lineResults.push({
          poLineId: poLine.poLineId,
          status: 'GRN_MISSING',
          orderedQty: poLine.quantityOrdered,
          receivedQty: 0,
          invoicedQty,
          poUnitPrice: poLine.unitPrice,
          invoiceUnitPrice,
          priceVariancePct: 0,
          quantityVariancePct: 100,
          varianceAmount: lineInvoiceTotal,
          discrepancyNote: 'No Goods Receipt (GRN) found for invoiced line item',
        });
        hasHardMismatch = true;
        continue;
      }

      // 1. Calculate Price Variance %
      const priceDiff = invoiceUnitPrice - poLine.unitPrice;
      const priceVariancePct = Number(((Math.abs(priceDiff) / poLine.unitPrice) * 100).toFixed(2));
      totalPriceVariance += priceDiff * invoicedQty;

      // 2. Calculate Quantity Variance % (Invoiced vs Accepted GRN)
      const qtyDiff = invoicedQty - receivedQty;
      const quantityVariancePct = Number(((Math.abs(qtyDiff) / Math.max(1, receivedQty)) * 100).toFixed(2));
      totalQuantityVariance += qtyDiff;

      const varianceAmount = Number((lineInvoiceTotal - (receivedQty * poLine.unitPrice)).toFixed(2));

      // 3. Match Decision logic
      const isPriceExact = Math.abs(priceDiff) < 0.001;
      const isPriceWithinTolerance = priceVariancePct <= tolerances.maxPriceVariancePercentage;

      const isQtyExact = Math.abs(qtyDiff) < 0.001;
      const isQtyWithinTolerance = quantityVariancePct <= tolerances.maxQuantityVariancePercentage;

      let lineStatus: LineMatchResult['status'] = 'EXACT_MATCH';
      let note: string | undefined;

      if (!isQtyWithinTolerance) {
        lineStatus = 'QUANTITY_MISMATCH';
        note = `Invoiced quantity (${invoicedQty}) exceeds GRN received quantity (${receivedQty})`;
        hasHardMismatch = true;
      } else if (!isPriceWithinTolerance) {
        lineStatus = 'PRICE_MISMATCH';
        note = `Price variance of ${priceVariancePct}% exceeds allowed tolerance of ${tolerances.maxPriceVariancePercentage}%`;
        hasHardMismatch = true;
      } else if (!isPriceExact || !isQtyExact) {
        lineStatus = !isPriceExact ? 'PRICE_TOLERANCE_PASS' : 'QUANTITY_TOLERANCE_PASS';
        hasTolerancePass = true;
      }

      lineResults.push({
        poLineId: poLine.poLineId,
        status: lineStatus,
        orderedQty: poLine.quantityOrdered,
        receivedQty,
        invoicedQty,
        poUnitPrice: poLine.unitPrice,
        invoiceUnitPrice,
        priceVariancePct,
        quantityVariancePct,
        varianceAmount,
        discrepancyNote: note,
      });
    }

    let overallStatus: ThreeWayMatchSummary['overallStatus'] = 'PASSED';
    let canAutoApprove = true;

    if (hasHardMismatch) {
      overallStatus = 'FAILED_DISCREPANCY';
      canAutoApprove = false;
    } else if (hasTolerancePass) {
      overallStatus = 'PASSED_WITH_TOLERANCE';
      canAutoApprove = true;
    }

    return {
      overallStatus,
      canAutoApprovePayment: canAutoApprove,
      totalPOAmount: Number(totalPOAmount.toFixed(2)),
      totalInvoiceAmount: Number(totalInvoiceAmount.toFixed(2)),
      totalPriceVariance: Number(totalPriceVariance.toFixed(2)),
      totalQuantityVariance: Number(totalQuantityVariance.toFixed(2)),
      lineResults,
    };
  }
}
