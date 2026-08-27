import {
  FixedAssetEngine,
  DepreciationMethod,
  RevenueRecognitionEngine,
  ASC606Contract,
  GlobalTradeEngine,
  CustomsValuationInput,
} from '@forge-erp/shared';
import { ERPEventBus } from '../src/events/eventBus';
import { initializeEventSubscribers } from '../src/events/subscribers';

describe('Advanced Enterprise Subsystems & Hardening Test Suite (Deliverables 4-7)', () => {

  // ==========================================================================
  // 1. FIXED ASSET MANAGEMENT DEPRECIATION TESTS
  // ==========================================================================
  describe('1. Fixed Asset Depreciation & Disposal Engine', () => {
    test('Calculates Straight-Line monthly depreciation schedule accurately down to salvage value', () => {
      const schedule = FixedAssetEngine.generateSchedule({
        assetTag: 'AST-CNC-001',
        initialCost: 120000.0, // $120,000 CNC Milling Machine
        salvageValue: 12000.0,  // $12,000 Residual salvage
        usefulLifeYears: 5,     // 5 Years = 60 months
        depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
        inServiceDate: new Date('2026-01-01'),
      });

      expect(schedule.length).toBe(60);
      // Monthly depreciation = (120,000 - 12,000) / 60 = 108,000 / 60 = $1,800.00 / month
      expect(schedule[0].depreciationExpense).toBe(1800.0);
      expect(schedule[59].endingBookValue).toBe(12000.0);
      expect(schedule[59].accumulatedDepreciation).toBe(108000.0);
    });

    test('Computes MACRS 5-year accelerated depreciation table', () => {
      const schedule = FixedAssetEngine.generateSchedule({
        assetTag: 'AST-ROBOT-02',
        initialCost: 100000.0,
        salvageValue: 0,
        usefulLifeYears: 5,
        depreciationMethod: DepreciationMethod.MACRS_5_YEAR,
        inServiceDate: new Date('2026-01-01'),
      });

      expect(schedule.length).toBe(72); // 6 recovery years * 12 months
      expect(schedule[schedule.length - 1].endingBookValue).toBe(0);
    });

    test('Calculates gain or loss on asset disposal', () => {
      const disposal = FixedAssetEngine.calculateDisposalGainLoss(100000.0, 70000.0, 35000.0);
      // Net book value = 30,000 | Sale proceeds = 35,000 -> Gain of $5,000
      expect(disposal.netBookValueAtDisposal).toBe(30000.0);
      expect(disposal.gainOrLossAmount).toBe(5000.0);
      expect(disposal.isGain).toBe(true);
    });
  });

  // ==========================================================================
  // 2. ASC 606 / IFRS 15 REVENUE RECOGNITION TESTS
  // ==========================================================================
  describe('2. ASC 606 Standalone Selling Price Allocation & Deferred Revenue', () => {
    test('Allocates bundle transaction price based on relative Standalone Selling Price (SSP)', () => {
      const contract: ASC606Contract = {
        contractId: 'CTR-2026-009',
        totalTransactionPrice: 150000.0, // Discounted contract bundle price
        currency: 'USD',
        obligations: [
          { obligationId: 'POB-1', description: 'Equipment Hardware', standaloneSellingPrice: 120000.0, recognitionType: 'POINT_IN_TIME', isSatisfied: true },
          { obligationId: 'POB-2', description: '3-Year Maintenance Support', standaloneSellingPrice: 60000.0, recognitionType: 'OVER_TIME_MONTHLY', isSatisfied: false },
        ],
      };

      // Total SSP = 180,000
      // POB-1 Share = (120,000 / 180,000) * 150,000 = $100,000.00
      // POB-2 Share = (60,000 / 180,000) * 150,000 = $50,000.00
      const allocated = RevenueRecognitionEngine.allocateTransactionPrice(contract);

      expect(allocated.obligations[0].allocatedTransactionPrice).toBe(100000.0);
      expect(allocated.obligations[1].allocatedTransactionPrice).toBe(50000.0);
    });

    test('Generates month-by-month deferred revenue amortization schedule', () => {
      const obligation = {
        obligationId: 'POB-SLA-12M',
        description: '12-Month SLA Support',
        standaloneSellingPrice: 24000.0,
        allocatedTransactionPrice: 24000.0,
        recognitionType: 'OVER_TIME_MONTHLY' as const,
        isSatisfied: false,
      };

      const schedule = RevenueRecognitionEngine.generateAmortizationSchedule(obligation, 2026, 1, 12);

      expect(schedule.length).toBe(12);
      expect(schedule[0].recognizedRevenue).toBe(2000.0);
      expect(schedule[0].deferredRevenueBalance).toBe(22000.0);
      expect(schedule[11].deferredRevenueBalance).toBe(0.0);
    });
  });

  // ==========================================================================
  // 3. GLOBAL TRADE SERVICES & CUSTOMS DUTY TESTS
  // ==========================================================================
  describe('3. Global Trade Services (GTS) Tariff & CIF Landed Cost Engine', () => {
    test('Calculates CIF assessable customs valuation, Ad-Valorem tariffs, and anti-dumping fees', () => {
      const tradeInput: CustomsValuationInput = {
        goodsFobValue: 50000.0, // EUR 50,000
        internationalFreightCost: 3000.0,
        marineInsuranceCost: 500.0,
        currency: 'EUR',
        exchangeRateToDomestic: 1.10, // USD / EUR
        tariffRule: {
          hsCode: '8483.40.00',
          description: 'Gears and gearing; ball or roller screws; gear boxes',
          countryOfOrigin: 'DE',
          destinationCountry: 'US',
          baseAdValoremDutyRatePercentage: 4.5, // 4.5%
          antiDumpingDutyRatePercentage: 2.0,   // 2.0%
          customsProcessingFeeFixed: 31.67,
        },
      };

      const result = GlobalTradeEngine.calculateDutyAndLandedCost(tradeInput);

      // FOB Domestic = 50,000 * 1.10 = $55,000.00
      expect(result.fobValueDomestic).toBe(55000.0);

      // Freight = 3,300.00 | Insurance = 550.00 -> CIF Value = 55,000 + 3,300 + 550 = $58,850.00
      expect(result.cifCustomsValueDomestic).toBe(58850.0);

      // Base Duty = 58,850 * 4.5% = $2,648.25
      expect(result.baseDutyAmount).toBe(2648.25);

      // Anti-Dumping = 58,850 * 2.0% = $1,177.00
      expect(result.antiDumpingDutyAmount).toBe(1177.0);

      // Total Duties = 2648.25 + 1177.00 + 31.67 = $3,856.92
      expect(result.totalCustomsDutiesAndTaxes).toBe(3856.92);

      // Effective Landed Cost = 58,850 + 3,856.92 = $62,706.92
      expect(result.effectiveLandedCostTotal).toBe(62706.92);
    });
  });

  // ==========================================================================
  // 4. CROSS-MODULE EVENT BUS TESTS
  // ==========================================================================
  describe('4. Asynchronous Event Bus & Reactive Workflow Engine', () => {
    test('Dispatches events to multiple registered subscribers without throwing uncaught errors', async () => {
      ERPEventBus.clear();
      let wasCalled = false;

      ERPEventBus.subscribe('GRN_POSTED', async (event) => {
        expect(event.tenantId).toBe('tenant_test_123');
        expect(event.data.grnId).toBe('grn_999');
        wasCalled = true;
      });

      await ERPEventBus.publish('GRN_POSTED', 'tenant_test_123', { grnId: 'grn_999', poId: 'po_999', totalAmount: 5000 });
      expect(wasCalled).toBe(true);
    });
  });
});
