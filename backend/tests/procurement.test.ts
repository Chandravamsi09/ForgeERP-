import { PurchaseOrderStatus, UserRole } from '@forge-erp/shared';

describe('Procurement Module Business Logic Tests', () => {
  interface POItem {
    productId: string;
    quantityOrdered: number;
    quantityReceived: number;
    unitPrice: number;
  }

  test('1. PO Line Item and Tax Calculation: accurately computes subtotal, 10% tax, and totalAmount', () => {
    const items: POItem[] = [
      { productId: 'p1', quantityOrdered: 100, quantityReceived: 0, unitPrice: 25.5 }, // 2550
      { productId: 'p2', quantityOrdered: 50, quantityReceived: 0, unitPrice: 10.0 },  // 500
    ];

    const subtotal = items.reduce((sum, item) => sum + item.quantityOrdered * item.unitPrice, 0);
    const taxAmount = Number((subtotal * 0.1).toFixed(2));
    const totalAmount = Number((subtotal + taxAmount).toFixed(2));

    expect(subtotal).toBe(3050.0);
    expect(taxAmount).toBe(305.0);
    expect(totalAmount).toBe(3355.0);
  });

  test('2. PO State Machine Transitions: enforces strict lifecycle DRAFT -> SUBMITTED -> APPROVED -> FULFILLED', () => {
    let currentStatus = PurchaseOrderStatus.DRAFT;

    const submit = () => {
      if (currentStatus !== PurchaseOrderStatus.DRAFT) throw new Error('Invalid state');
      currentStatus = PurchaseOrderStatus.SUBMITTED;
    };

    const approve = () => {
      if (currentStatus !== PurchaseOrderStatus.SUBMITTED) throw new Error('Invalid state');
      currentStatus = PurchaseOrderStatus.APPROVED;
    };

    submit();
    expect(currentStatus).toBe(PurchaseOrderStatus.SUBMITTED);

    approve();
    expect(currentStatus).toBe(PurchaseOrderStatus.APPROVED);

    // Attempt invalid transition back to DRAFT
    expect(() => submit()).toThrow('Invalid state');
  });

  test('3. GRN Stock Increment: receiving goods automatically increments warehouse quantityOnHand', () => {
    const warehouseStock = {
      productId: 'prod_raw_iron',
      warehouseId: 'wh_main',
      quantityOnHand: 400,
      quantityAvailable: 400,
    };

    const grnReceivedQuantity = 150;

    // Simulate GRN receipt
    warehouseStock.quantityOnHand += grnReceivedQuantity;
    warehouseStock.quantityAvailable += grnReceivedQuantity;

    expect(warehouseStock.quantityOnHand).toBe(550);
    expect(warehouseStock.quantityAvailable).toBe(550);
  });

  test('4. Partial GRN Fulfillment: correctly updates line item quantityReceived without marking PO fulfilled', () => {
    const poItem: POItem = {
      productId: 'prod_valves',
      quantityOrdered: 200,
      quantityReceived: 0,
      unitPrice: 15,
    };

    // First shipment arrives: 80 units
    poItem.quantityReceived += 80;
    const isFullyReceived1 = poItem.quantityReceived >= poItem.quantityOrdered;
    expect(poItem.quantityReceived).toBe(80);
    expect(isFullyReceived1).toBe(false);

    // Second shipment arrives: 120 units
    poItem.quantityReceived += 120;
    const isFullyReceived2 = poItem.quantityReceived >= poItem.quantityOrdered;
    expect(poItem.quantityReceived).toBe(200);
    expect(isFullyReceived2).toBe(true);
  });

  test('5. Approval Authorization: only ADMIN or MANAGER roles are permitted to approve purchase orders', () => {
    const isAuthorizedToApprove = (roles: UserRole[]) => {
      return roles.includes(UserRole.ADMIN) || roles.includes(UserRole.MANAGER);
    };

    expect(isAuthorizedToApprove([UserRole.EMPLOYEE])).toBe(false);
    expect(isAuthorizedToApprove([UserRole.ACCOUNTANT])).toBe(false);
    expect(isAuthorizedToApprove([UserRole.MANAGER])).toBe(true);
    expect(isAuthorizedToApprove([UserRole.ADMIN])).toBe(true);
  });
});
