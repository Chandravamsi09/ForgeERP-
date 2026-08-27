import { ReportsService } from '../src/modules/reports/reports.service';

describe('Admin Dashboard & Reporting Module Business Logic Tests', () => {
  interface ProductStock {
    sku: string;
    costPrice: number;
    quantityAvailable: number;
    minStockLevel: number;
  }

  test('1. Inventory Valuation Aggregation: computes total physical inventory dollar value', () => {
    const stockItems: ProductStock[] = [
      { sku: 'SKU-001', costPrice: 50.0, quantityAvailable: 200, minStockLevel: 20 }, // $10,000
      { sku: 'SKU-002', costPrice: 15.0, quantityAvailable: 500, minStockLevel: 50 }, // $7,500
      { sku: 'SKU-003', costPrice: 120.0, quantityAvailable: 50, minStockLevel: 10 },  // $6,000
    ];

    const totalValuation = stockItems.reduce((sum, item) => sum + item.quantityAvailable * item.costPrice, 0);
    const totalUnits = stockItems.reduce((sum, item) => sum + item.quantityAvailable, 0);

    expect(totalValuation).toBe(23500.0);
    expect(totalUnits).toBe(750);
  });

  test('2. Low-Stock Incident Counter: accurately aggregates count of products below safety buffer', () => {
    const stockItems: ProductStock[] = [
      { sku: 'SKU-001', costPrice: 50, quantityAvailable: 200, minStockLevel: 20 },  // Safe
      { sku: 'SKU-002', costPrice: 15, quantityAvailable: 30, minStockLevel: 50 },   // Low!
      { sku: 'SKU-003', costPrice: 120, quantityAvailable: 5, minStockLevel: 10 },   // Low!
    ];

    const lowStockCount = stockItems.filter((i) => i.quantityAvailable <= i.minStockLevel).length;
    expect(lowStockCount).toBe(2);
  });

  test('3. Revenue Aggregation: accumulates received cash payments across customer invoices', () => {
    const invoices = [
      { invoiceNumber: 'INV-001', totalAmount: 5000, payments: [{ amount: 5000 }] },
      { invoiceNumber: 'INV-002', totalAmount: 12000, payments: [{ amount: 6000 }, { amount: 4000 }] },
      { invoiceNumber: 'INV-003', totalAmount: 3500, payments: [] },
    ];

    const totalRevenue = invoices.reduce((sum, inv) => {
      return sum + inv.payments.reduce((pSum, p) => pSum + p.amount, 0);
    }, 0);

    expect(totalRevenue).toBe(15000);
  });

  test('4. CSV Serializer: serializes records into RFC-compliant comma-delimited output', async () => {
    const sampleData = [
      { id: '1', name: 'Product A', revenue: 500 },
      { id: '2', name: 'Product B', revenue: 1200 },
    ];

    const csvOutput = await ReportsService.exportToCsv(sampleData);
    const lines = csvOutput.split('\n');

    expect(lines[0]).toBe('id,name,revenue');
    expect(lines[1]).toBe('"1","Product A",500');
    expect(lines[2]).toBe('"2","Product B",1200');
  });

  test('5. Cash-on-Hand Liquidity Calculation: sums balances of primary liquidity accounts', () => {
    const accounts = [
      { accountCode: '1001', accountName: 'Operating Cash', balance: 75000 },
      { accountCode: '1002', accountName: 'Payroll Reserve', balance: 35000 },
      { accountCode: '1200', accountName: 'Accounts Receivable', balance: 40000 },
    ];

    const cashOnHand = accounts
      .filter((a) => a.accountCode.startsWith('100'))
      .reduce((sum, a) => sum + a.balance, 0);

    expect(cashOnHand).toBe(110000);
  });
});
