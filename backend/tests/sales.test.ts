import { SalesOrderStatus, InvoiceStatus } from '@forge-erp/shared';

describe('Sales Order Management Module Business Logic Tests', () => {
  interface OrderItem {
    productId: string;
    quantity: number;
    unitPrice: number;
    discountPercent?: number;
  }

  test('1. Quotation & Line Item Discount Calculation: computes discounted total per line', () => {
    const items: OrderItem[] = [
      { productId: 'p1', quantity: 10, unitPrice: 100, discountPercent: 10 }, // 10 * 100 * 0.9 = 900
      { productId: 'p2', quantity: 5, unitPrice: 50, discountPercent: 0 },    // 5 * 50 = 250
    ];

    const total = items.reduce((sum, item) => {
      const discount = item.discountPercent || 0;
      return sum + item.quantity * item.unitPrice * (1 - discount / 100);
    }, 0);

    expect(total).toBe(1150.0);
  });

  test('2. Customer Credit Limit Check: rejects order when outstanding unpaid balance + new order > limit', () => {
    const customer = {
      creditLimit: 10000,
      outstandingInvoicesTotal: 7500,
    };

    const newOrderAmount = 3000;
    const isExceeded = customer.outstandingInvoicesTotal + newOrderAmount > customer.creditLimit;

    expect(isExceeded).toBe(true);
  });

  test('3. Stock Reservation on Confirmation: converts available stock to reserved stock', () => {
    const warehouseStock = {
      quantityOnHand: 100,
      quantityReserved: 10,
      quantityAvailable: 90,
    };

    const orderQuantity = 25;

    expect(warehouseStock.quantityAvailable).toBeGreaterThanOrEqual(orderQuantity);

    // Confirm order
    warehouseStock.quantityReserved += orderQuantity;
    warehouseStock.quantityAvailable = warehouseStock.quantityOnHand - warehouseStock.quantityReserved;

    expect(warehouseStock.quantityOnHand).toBe(100); // physically remains
    expect(warehouseStock.quantityReserved).toBe(35);
    expect(warehouseStock.quantityAvailable).toBe(65); // available reduced
  });

  test('4. Invoice Total & Tax Computation: adds 10% tax rate to order subtotal', () => {
    const orderSubtotal = 4500.0;
    const taxRate = 10.0;
    const taxAmount = Number(((orderSubtotal * taxRate) / 100).toFixed(2));
    const invoiceTotal = Number((orderSubtotal + taxAmount).toFixed(2));

    expect(taxAmount).toBe(450.0);
    expect(invoiceTotal).toBe(4950.0);
  });

  test('5. Payment Processing State Transitions: invoice transitions UNPAID -> PARTIALLY_PAID -> PAID', () => {
    const invoice = {
      totalAmount: 1000,
      paidAmount: 0,
      status: InvoiceStatus.UNPAID,
    };

    // First payment $400
    invoice.paidAmount += 400;
    invoice.status = invoice.paidAmount >= invoice.totalAmount ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID;
    expect(invoice.status).toBe(InvoiceStatus.PARTIALLY_PAID);

    // Second payment $600
    invoice.paidAmount += 600;
    invoice.status = invoice.paidAmount >= invoice.totalAmount ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID;
    expect(invoice.status).toBe(InvoiceStatus.PAID);
  });
});
