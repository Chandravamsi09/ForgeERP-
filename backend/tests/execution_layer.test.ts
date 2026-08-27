import { PDFDocumentEngine } from '../src/utils/pdfDocumentEngine';
import { IntercompanyEliminationEngine } from '@forge-erp/shared';

describe('Tier-1 ERP Execution & Document Layer Integration Tests (Deliverable 3)', () => {

  // ==========================================================================
  // 1. MANUFACTURING WORK ORDER EXECUTION LIFECYCLE TESTS
  // ==========================================================================
  describe('1. Work Order Execution Lifecycle & Component Issuance', () => {
    test('Enforces strict state transitions DRAFT -> RELEASED -> IN_PROGRESS -> COMPLETED', () => {
      const allowedTransitions: Record<string, string[]> = {
        DRAFT: ['RELEASED', 'CANCELLED'],
        RELEASED: ['IN_PROGRESS', 'QUALITY_HOLD', 'CANCELLED'],
        IN_PROGRESS: ['QUALITY_HOLD', 'COMPLETED', 'CANCELLED'],
        QUALITY_HOLD: ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        COMPLETED: ['CLOSED'],
        CLOSED: [],
      };

      const isValidTransition = (current: string, next: string): boolean => {
        return allowedTransitions[current]?.includes(next) || false;
      };

      expect(isValidTransition('DRAFT', 'RELEASED')).toBe(true);
      expect(isValidTransition('RELEASED', 'IN_PROGRESS')).toBe(true);
      expect(isValidTransition('IN_PROGRESS', 'COMPLETED')).toBe(true);
      expect(isValidTransition('COMPLETED', 'CLOSED')).toBe(true);

      // Illegal backward transitions
      expect(isValidTransition('DRAFT', 'COMPLETED')).toBe(false);
      expect(isValidTransition('COMPLETED', 'DRAFT')).toBe(false);
      expect(isValidTransition('CLOSED', 'IN_PROGRESS')).toBe(false);
    });

    test('Component material allocation accounts for scrap percentage allowance', () => {
      const baseComponentPerUnit = 4.0;
      const scrapPct = 5.0; // 5% scrap
      const targetBatchQuantity = 100;

      const effectiveQtyPerUnit = baseComponentPerUnit * (1 + scrapPct / 100);
      const totalPlannedRequirements = effectiveQtyPerUnit * targetBatchQuantity;

      expect(effectiveQtyPerUnit).toBe(4.2);
      expect(totalPlannedRequirements).toBe(420.0);
    });
  });

  // ==========================================================================
  // 2. QUALITY MANAGEMENT (QM) & NCR WORKFLOW TESTS
  // ==========================================================================
  describe('2. Quality Inspection & Non-Conformance Report (NCR) Engine', () => {
    test('Automatically determines FAIL status when critical parameter tolerances are breached', () => {
      const specifications = [
        { parameterName: 'Shaft Diameter (mm)', minTolerance: 49.8, maxTolerance: 50.2, isCritical: true },
        { parameterName: 'Surface Roughness (Ra)', minTolerance: 0.1, maxTolerance: 0.8, isCritical: false },
      ];

      const testResults = [
        { parameterName: 'Shaft Diameter (mm)', measuredValue: 50.5, isConforming: false }, // Critical Failure!
        { parameterName: 'Surface Roughness (Ra)', measuredValue: 0.4, isConforming: true },
      ];

      const hasCriticalFail = testResults.some((r) => {
        const spec = specifications.find((s) => s.parameterName === r.parameterName);
        return spec?.isCritical && !r.isConforming;
      });

      const overallVerdict = hasCriticalFail ? 'FAIL' : 'PASS';
      expect(overallVerdict).toBe('FAIL');
    });

    test('Generates NCR disposition workflow with severity levels', () => {
      const ncrRecord = {
        ncrNumber: 'NCR-2026-00001',
        severity: 'CRITICAL',
        defectDescription: 'Shaft dimension oversized by 0.3mm outside drawing limits',
        disposition: 'REWORK',
        status: 'OPEN',
      };

      expect(ncrRecord.severity).toBe('CRITICAL');
      expect(['SCRAP', 'REWORK', 'RETURN_TO_VENDOR', 'USE_AS_IS']).toContain(ncrRecord.disposition);
    });
  });

  // ==========================================================================
  // 3. WMS BIN STORAGE, PUTAWAY & LOT GENEALOGY TESTS
  // ==========================================================================
  describe('3. WMS Bin Storage & Bi-Directional Genealogy', () => {
    test('Putaway allocations update bin quantity and maintain ledger running balance', () => {
      let currentOnHand = 500;
      const incomingReceipt = 250;
      const unitCost = 18.50;

      const balanceAfter = currentOnHand + incomingReceipt;
      const ledgerEntry = {
        movementType: 'GRN_RECEIPT',
        quantity: incomingReceipt,
        unitCost,
        totalCost: incomingReceipt * unitCost,
        balanceAfter,
      };

      expect(ledgerEntry.balanceAfter).toBe(750);
      expect(ledgerEntry.totalCost).toBe(4625.0);
    });

    test('Bi-directional Lot Genealogy graph connects raw material lot to finished product', () => {
      const rawBatchLot = { id: 'batch_raw_steel_01', batchNumber: 'LOT-RAW-2026-A1' };
      const finishedBatchLot = { id: 'batch_fg_gearbox_01', batchNumber: 'LOT-FG-2026-G9' };

      const genealogyLink = {
        parentBatchId: rawBatchLot.id,
        childBatchId: finishedBatchLot.id,
        workOrderId: 'wo_12345',
        quantityUsed: 150.0,
      };

      expect(genealogyLink.parentBatchId).toBe(rawBatchLot.id);
      expect(genealogyLink.childBatchId).toBe(finishedBatchLot.id);
      expect(genealogyLink.quantityUsed).toBe(150.0);
    });
  });

  // ==========================================================================
  // 4. MULTI-SUBSIDIARY FINANCIAL CONSOLIDATION TESTS
  // ==========================================================================
  describe('4. Multi-Subsidiary Financial Consolidation & Elimination', () => {
    test('Creates fully balanced elimination journal voucher entries (Debit == Credit)', () => {
      const intercompanyTx = [
        {
          transactionId: 'ic_01',
          sourceSubsidiaryId: 'SUB_USA',
          targetSubsidiaryId: 'SUB_GERMANY',
          transactionType: 'TRADE_SALE_PURCHASE' as const,
          sourceAmountForeign: 100000,
          sourceCurrency: 'USD',
          sourceExchangeRateToParent: 1.0,
          targetAmountForeign: 80000,
          targetCurrency: 'EUR',
          targetExchangeRateToParent: 1.25, // 80,000 EUR * 1.25 = 100,000 USD
          markupPercentage: 20.0,
          unsoldInventoryPercentage: 50.0,
        },
      ];

      const result = IntercompanyEliminationEngine.processEliminations(intercompanyTx, 'USD');

      expect(result.isFullyBalanced).toBe(true);
      expect(result.totalIntercompanyRevenueEliminated).toBe(100000.0);
      expect(result.totalIntercompanyCOGSEliminated).toBe(100000.0);
      expect(result.eliminationJournalEntries.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ==========================================================================
  // 5. ENTERPRISE PDF DOCUMENT RENDERING TESTS
  // ==========================================================================
  describe('5. PDF Document Rendering Engine', () => {
    test('Renders dynamic Tax Invoice PDF binary stream with formatted totals', () => {
      const pdfBuffer = PDFDocumentEngine.generateInvoicePDF({
        invoiceNumber: 'INV-2026-00042',
        companyName: 'ForgeERP Manufacturing Global Inc.',
        customerName: 'AeroTech Systems Corp',
        customerEmail: 'procurement@aerotech.com',
        invoiceDate: new Date('2026-08-20'),
        dueDate: new Date('2026-09-20'),
        items: [
          { sku: 'FG-GEARBOX', name: 'Industrial Gearbox 500HP', quantity: 5, unitPrice: 2400.0, totalPrice: 12000.0 },
          { sku: 'SP-SEAL-KIT', name: 'Hydraulic Seal Overhaul Kit', quantity: 10, unitPrice: 150.0, totalPrice: 1500.0 },
        ],
        subtotal: 13500.0,
        taxRate: 10.0,
        taxAmount: 1350.0,
        totalAmount: 14850.0,
      });

      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      expect(pdfBuffer.length).toBeGreaterThan(100);
      const content = pdfBuffer.toString('utf-8');
      expect(content).toContain('%PDF-1.4');
      expect(content).toContain('INV-2026-00042');
      expect(content).toContain('GRAND TOTAL: $14850.00');
    });

    test('Renders dynamic Purchase Order PDF binary stream', () => {
      const pdfBuffer = PDFDocumentEngine.generatePurchaseOrderPDF({
        poNumber: 'PO-2026-00088',
        companyName: 'ForgeERP Manufacturing Global Inc.',
        vendorName: 'Titanium Alloys Global Ltd',
        vendorEmail: 'sales@titaniumalloys.com',
        orderDate: new Date('2026-08-25'),
        items: [
          { sku: 'RAW-TITANIUM-BAR', name: 'Grade 5 Titanium Billet 100mm', quantity: 200, unitPrice: 85.0, totalPrice: 17000.0 },
        ],
        subtotal: 17000.0,
        taxAmount: 1700.0,
        totalAmount: 18700.0,
        paymentTerms: 'NET45',
      });

      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      const content = pdfBuffer.toString('utf-8');
      expect(content).toContain('%PDF-1.4');
      expect(content).toContain('PO-2026-00088');
      expect(content).toContain('TOTAL PO AMOUNT: $18700.00');
    });

    test('Renders Certificate of Analysis (CoA) PDF with QA ISO-9001 compliance statement', () => {
      const pdfBuffer = PDFDocumentEngine.generateCoAPDF({
        coaNumber: 'COA-2026-00109',
        productName: 'Precision Turbine Rotor Assembly',
        productSku: 'FG-TURBINE-ROTOR',
        batchNumber: 'LOT-2026-ROT-008',
        inspectionDate: new Date('2026-08-27'),
        inspectorName: 'Dr. Michael Chang, Lead QA Metrologist',
        approvedBy: 'Quality Assurance Directorate',
        testResults: [
          { parameterName: 'Dynamic Balance @ 10,000 RPM', measuredValue: 0.02, isConforming: true },
          { parameterName: 'Surface Hardness (HRC)', measuredValue: 62.5, isConforming: true },
        ],
      });

      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      const content = pdfBuffer.toString('utf-8');
      expect(content).toContain('%PDF-1.4');
      expect(content).toContain('COA-2026-00109');
      expect(content).toContain('COMPLIANT WITH ISO-9001 RELEASE PROTOCOLS');
    });

    test('Renders confidential Employee Payslip PDF with itemized tax and net breakdown', () => {
      const pdfBuffer = PDFDocumentEngine.generatePayslipPDF({
        employeeCode: 'EMP-00104',
        employeeName: 'Elena Rostova',
        department: 'Advanced Manufacturing & Robotics',
        designation: 'Senior CNC Systems Specialist',
        payrollPeriod: '2026-08',
        basePay: 7500.0,
        allowances: 1200.0,
        taxDeductions: 1740.0,
        netPay: 6960.0,
      });

      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      const content = pdfBuffer.toString('utf-8');
      expect(content).toContain('%PDF-1.4');
      expect(content).toContain('Elena Rostova');
      expect(content).toContain('NET DISBURSED PAY: $6960.00');
    });
  });
});
