import {
  BOMRollupEngine,
  BOMNode,
  RoutingStepCost,
  MRPNettingEngine,
  LotSizingRule,
  MRPItemParameters,
  OEEEngine,
  OEEShiftInput,
  InventoryValuationEngine,
  FIFOLayer,
  MovingAverageState,
  ThreeWayMatchEngine,
  POLineMatchInput,
  GRNLineMatchInput,
  VendorInvoiceLineMatchInput,
  IntercompanyEliminationEngine,
  IntercompanyTransaction
} from '@forge-erp/shared';

describe('Tier-1 Manufacturing ERP Domain Math Engines Test Suite', () => {

  // ==========================================================================
  // 1. BOM RECURSIVE EXPLOSION & SCRAP FACTOR ENGINE TESTS
  // ==========================================================================
  describe('1. BOM Rollup & Multi-Level Scrap Compounding', () => {
    test('Calculates compounded scrap across 3-level assembly hierarchy', () => {
      // Finished Product: Industrial Gearbox (A)
      // Level 1: Gear Assembly (B) - 2 units per A, 5% scrap
      // Level 2: Precision Pinion (C) - 3 units per B, 10% scrap, $15 base material cost
      const pinionNode: BOMNode = {
        productId: 'pinion_c',
        sku: 'RAW-PINION',
        name: 'Precision Pinion Gear',
        unitOfMeasure: 'PCS',
        quantityPerParent: 3.0,
        scrapPercentage: 10.0, // 3 * 1.10 = 3.3 effective
        effectiveQuantity: 0,
        materialUnitCost: 15.0,
        laborUnitCost: 2.0,
        overheadUnitCost: 1.0,
        totalUnitCost: 0,
        level: 2,
      };

      const gearAssemblyNode: BOMNode = {
        productId: 'gear_b',
        sku: 'SUB-GEAR-ASSY',
        name: 'Gear Sub-Assembly',
        unitOfMeasure: 'SET',
        quantityPerParent: 2.0,
        scrapPercentage: 5.0, // 2 * 1.05 = 2.1 effective
        effectiveQuantity: 0,
        materialUnitCost: 0,
        laborUnitCost: 8.0,
        overheadUnitCost: 5.0,
        totalUnitCost: 0,
        level: 1,
        children: [pinionNode],
      };

      const gearboxRoot: BOMNode = {
        productId: 'gearbox_a',
        sku: 'FG-GEARBOX',
        name: 'Heavy Industrial Gearbox 500HP',
        unitOfMeasure: 'UNIT',
        quantityPerParent: 1.0,
        scrapPercentage: 0.0,
        effectiveQuantity: 1.0,
        materialUnitCost: 0,
        laborUnitCost: 25.0,
        overheadUnitCost: 15.0,
        totalUnitCost: 0,
        level: 0,
        children: [gearAssemblyNode],
      };

      const routingSteps: RoutingStepCost[] = [
        {
          sequenceNumber: 10,
          operationName: 'Precision CNC Machining',
          workCenterId: 'wc_cnc_01',
          setupTimeMinutes: 60,
          runTimeMinutesPerUnit: 12,
          batchQuantity: 10,
          workCenterRates: {
            workCenterId: 'wc_cnc_01',
            hourlyLaborRate: 40.0,
            hourlyOverheadRate: 35.0,
            efficiencyRating: 0.90, // 90%
          },
        },
      ];

      const result = BOMRollupEngine.explodeAndRollupCost(gearboxRoot, routingSteps, 10);

      expect(result.directMaterialCost).toBeGreaterThan(0);
      expect(result.directLaborCost).toBeGreaterThan(0);
      expect(result.machineOverheadCost).toBeGreaterThan(0);
      expect(result.totalManufacturingCost).toBeGreaterThan(result.directMaterialCost);
      expect(result.flattenedRequirements.has('pinion_c')).toBe(true);

      // Total pinions required for 1 Gearbox = 2.1 (Gear Assy) * 3.3 (Pinion) = 6.93 units
      const pinionReq = result.flattenedRequirements.get('pinion_c')!;
      expect(pinionReq.totalQuantityRequired).toBeCloseTo(6.93, 2);
    });
  });

  // ==========================================================================
  // 2. TIME-PHASED MRP II GROSS-TO-NET NETTING ENGINE TESTS
  // ==========================================================================
  describe('2. Time-Phased MRP II Net Requirements Engine', () => {
    test('Calculates time-phased net requirements with safety stock buffers and EOQ lot-sizing', () => {
      const itemParams: MRPItemParameters = {
        productId: 'raw_steel_bar',
        sku: 'RAW-STEEL-4140',
        currentOnHand: 100,
        safetyStock: 30,
        leadTimeDays: 14, // 2 weeks lead time
        lotSizingRule: LotSizingRule.FIXED_ORDER_QUANTITY,
        fixedBatchSize: 100,
      };

      const baseDate = new Date('2026-09-01T00:00:00Z');

      const demands = [
        { date: new Date('2026-09-03T00:00:00Z'), quantity: 60, sourceType: 'SALES_ORDER' as const }, // Week 1: 100 - 60 = 40 (>= 30 safe) -> Net = 0
        { date: new Date('2026-09-10T00:00:00Z'), quantity: 50, sourceType: 'SALES_ORDER' as const }, // Week 2: 40 - 50 = -10 -> Net = 40 (Deficit to reach 30) -> Batch 100
        { date: new Date('2026-09-17T00:00:00Z'), quantity: 80, sourceType: 'FORECAST' as const },    // Week 3
      ];

      const receipts = [
        { date: new Date('2026-09-02T00:00:00Z'), quantity: 20, sourceType: 'PURCHASE_ORDER' as const },
      ];

      const plan = MRPNettingEngine.executeNetting(itemParams, demands, receipts, baseDate, 4, 7);

      expect(plan.totalGrossRequirements).toBe(190);
      expect(plan.timeBuckets.length).toBe(4);

      // Verify lead time offset
      const plannedOrder = plan.timeBuckets.find((b) => b.plannedOrderReceipt > 0);
      expect(plannedOrder).toBeDefined();
      if (plannedOrder) {
        expect(plannedOrder.plannedOrderReceipt).toBe(100); // Fixed batch size of 100
        const expectedRelease = new Date(plannedOrder.periodStartDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        expect(plannedOrder.plannedOrderReleaseDate.getTime()).toBe(expectedRelease.getTime());
      }
    });
  });

  // ==========================================================================
  // 3. SHOP FLOOR OEE & RELIABILITY ENGINE TESTS
  // ==========================================================================
  describe('3. Overall Equipment Effectiveness (OEE) ISO 22400 Engine', () => {
    test('Computes exact Availability, Performance, Quality, OEE %, and MTBF/MTTR', () => {
      const shiftData: OEEShiftInput = {
        shiftDurationMinutes: 480, // 8 Hours = 480 min
        plannedBreaksMinutes: 30,  // Lunch/breaks = 30 min
        plannedMaintenanceMinutes: 10,
        unplannedDowntimeMinutes: 40, // 40 min breakdown/setup
        downtimeIncidentsCount: 2,
        idealCycleTimeSeconds: 30, // 0.5 minutes per unit (Speed: 120 units/hr)
        totalUnitsProduced: 700,
        rejectedDefectiveUnits: 28, // 4% scrap
      };

      const result = OEEEngine.calculateOEE(shiftData);

      // Planned Production Time = 480 - 40 = 440 min
      expect(result.plannedProductionTimeMinutes).toBe(440);

      // Operating Time = 440 - 40 = 400 min
      expect(result.operatingTimeMinutes).toBe(400);

      // Availability = 400 / 440 = 0.9091 (90.91%)
      expect(result.availabilityRate).toBeCloseTo(0.9091, 2);

      // Performance = (0.5 min * 700 units) / 400 min = 350 / 400 = 0.875 (87.5%)
      expect(result.performanceRate).toBeCloseTo(0.875, 2);

      // Quality = (700 - 28) / 700 = 672 / 700 = 0.96 (96.0%)
      expect(result.qualityRate).toBeCloseTo(0.96, 2);

      // OEE = 0.9091 * 0.875 * 0.96 = 76.36% (EXCELLENT)
      expect(result.oeePercentage).toBeGreaterThan(75.0);
      expect(result.classification).toBe('EXCELLENT');

      // MTBF = 400 min / 2 = 200 min
      expect(result.mtbfMinutes).toBe(200);
      // MTTR = 40 min / 2 = 20 min
      expect(result.mttrMinutes).toBe(20);
    });
  });

  // ==========================================================================
  // 4. MULTI-CURRENCY FIFO & MOVING WEIGHTED AVERAGE COST ENGINE TESTS
  // ==========================================================================
  describe('4. Inventory Valuation: Multi-Currency FIFO & Moving Weighted Average', () => {
    test('FIFO Depletion consumes oldest layers with multi-currency exchange rate conversions', () => {
      const initialLayers: FIFOLayer[] = [
        {
          layerId: 'layer_01',
          batchNumber: 'LOT-2026-001',
          receivedDate: new Date('2026-08-01'),
          initialQuantity: 100,
          remainingQuantity: 40,
          unitCostBaseCurrency: 50.0, // $50/unit
          originalCurrencyCode: 'USD',
          exchangeRateAtReceipt: 1.0,
        },
        {
          layerId: 'layer_02',
          batchNumber: 'LOT-2026-002',
          receivedDate: new Date('2026-08-15'),
          initialQuantity: 100,
          remainingQuantity: 100,
          unitCostBaseCurrency: 55.0, // $55/unit (EUR 50 * 1.10 FX)
          originalCurrencyCode: 'EUR',
          exchangeRateAtReceipt: 1.10,
        },
      ];

      // Deplete 70 units: Consumes 40 units from Layer 1 ($50) + 30 units from Layer 2 ($55)
      const depletion = InventoryValuationEngine.depleteFIFO(initialLayers, 70);

      expect(depletion.fulfilledQuantity).toBe(70);
      // COGS = (40 * 50) + (30 * 55) = 2000 + 1650 = $3650
      expect(depletion.totalCostOfGoodsSold).toBe(3650.0);
      expect(depletion.averageDepletionUnitCost).toBeCloseTo(52.14, 2);

      // Remaining layers check
      expect(depletion.remainingLayers.length).toBe(1);
      expect(depletion.remainingLayers[0].layerId).toBe('layer_02');
      expect(depletion.remainingLayers[0].remainingQuantity).toBe(70);
    });

    test('Moving Weighted Average updates unit valuation on foreign currency receipt', () => {
      const currentState: MovingAverageState = {
        totalQuantity: 200,
        movingAverageUnitCost: 20.0, // Total = $4,000
        totalValuation: 4000.0,
      };

      // Inward receipt: 100 units @ EUR 22.0 each (FX Rate 1.15 = $25.30 Base)
      const updated = InventoryValuationEngine.calculateMovingWeightedAverage(currentState, 100, 22.0, 1.15);

      // New Total Qty = 300
      // Incoming Valuation = 100 * 25.30 = $2,530
      // Total Valuation = 4000 + 2530 = $6,530
      // New Avg Unit Cost = 6530 / 300 = $21.7667
      expect(updated.totalQuantity).toBe(300);
      expect(updated.totalValuation).toBe(6530.0);
      expect(updated.movingAverageUnitCost).toBeCloseTo(21.77, 2);
    });
  });

  // ==========================================================================
  // 5. AUTOMATED 3-WAY MATCHING ENGINE TESTS
  // ==========================================================================
  describe('5. Automated 3-Way Matching Engine', () => {
    test('Passes 3-way match within acceptable 2% price tolerance and flags quantity over-invoicing', () => {
      const poLines: POLineMatchInput[] = [
        { poLineId: 'po_line_01', productId: 'p1', quantityOrdered: 100, unitPrice: 100.0, taxPercentage: 10 },
      ];

      const grnLines: GRNLineMatchInput[] = [
        { grnLineId: 'grn_01', poLineId: 'po_line_01', quantityReceived: 100, quantityAccepted: 100, quantityRejected: 0 },
      ];

      // Vendor invoices $101.50 (1.5% higher price, within 2.0% tolerance)
      const validInvoiceLines: VendorInvoiceLineMatchInput[] = [
        { invoiceLineId: 'inv_01', poLineId: 'po_line_01', quantityInvoiced: 100, unitPriceInvoiced: 101.50, taxAmountInvoiced: 1015 },
      ];

      const matchResult = ThreeWayMatchEngine.evaluateMatch(poLines, grnLines, validInvoiceLines, {
        maxPriceVariancePercentage: 2.0,
        maxQuantityVariancePercentage: 0.0,
        maxTotalAmountVarianceAbsolute: 10.0,
      });

      expect(matchResult.overallStatus).toBe('PASSED_WITH_TOLERANCE');
      expect(matchResult.canAutoApprovePayment).toBe(true);

      // Over-invoicing quantity test (Vendor bills 110 units when only 100 accepted)
      const invalidInvoiceLines: VendorInvoiceLineMatchInput[] = [
        { invoiceLineId: 'inv_02', poLineId: 'po_line_01', quantityInvoiced: 110, unitPriceInvoiced: 100.0, taxAmountInvoiced: 1100 },
      ];

      const failedResult = ThreeWayMatchEngine.evaluateMatch(poLines, grnLines, invalidInvoiceLines);
      expect(failedResult.overallStatus).toBe('FAILED_DISCREPANCY');
      expect(failedResult.canAutoApprovePayment).toBe(false);
      expect(failedResult.lineResults[0].status).toBe('QUANTITY_MISMATCH');
    });
  });

  // ==========================================================================
  // 6. MULTI-SUBSIDIARY INTERCOMPANY ELIMINATIONS & CTA TESTS
  // ==========================================================================
  describe('6. Multi-Subsidiary Intercompany Elimination & CTA Engine', () => {
    test('Eliminates intercompany trade revenue, AR/AP balances and writes down unrealized inventory profit', () => {
      const transactions: IntercompanyTransaction[] = [
        {
          transactionId: 'ic_tx_001',
          sourceSubsidiaryId: 'SUB_USA',
          targetSubsidiaryId: 'SUB_UK',
          transactionType: 'TRADE_SALE_PURCHASE',
          sourceAmountForeign: 50000, // USD
          sourceCurrency: 'USD',
          sourceExchangeRateToParent: 1.0,
          targetAmountForeign: 40000, // GBP @ 1.25 FX = 50,000 USD
          targetCurrency: 'GBP',
          targetExchangeRateToParent: 1.25,
          markupPercentage: 25.0, // 25% markup on transfer price
          unsoldInventoryPercentage: 40.0, // 40% of goods remain unsold in SUB_UK inventory
        },
      ];

      const elimination = IntercompanyEliminationEngine.processEliminations(transactions, 'USD');

      expect(elimination.totalIntercompanyRevenueEliminated).toBe(50000.0);
      expect(elimination.totalIntercompanyCOGSEliminated).toBe(50000.0);
      expect(elimination.totalIntercompanyAREliminated).toBe(50000.0);
      expect(elimination.totalIntercompanyAPEliminated).toBe(50000.0);

      // Unrealized profit in ending inventory = (50,000 * 40%) * (25 / 125) = 20,000 * 0.20 = $4,000
      expect(elimination.totalUnrealizedInventoryProfitEliminated).toBe(4000.0);
      expect(elimination.isFullyBalanced).toBe(true);
    });
  });
});
