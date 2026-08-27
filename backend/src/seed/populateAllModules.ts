import { prisma } from '../config/db';

export async function populateAllERPModules(tenantId: string) {
  console.log(`🌱 Populating comprehensive ERP datasets for tenant ${tenantId}...`);

  // 1. Categories & Products
  const catMachined = await prisma.category.upsert({
    where: { tenantId_code: { tenantId, code: 'PRECISION-MACH' } },
    update: {},
    create: {
      tenantId,
      code: 'PRECISION-MACH',
      name: 'Precision Machined Industrial Components',
    },
  });

  const catRaw = await prisma.category.upsert({
    where: { tenantId_code: { tenantId, code: 'RAW-ALLOY' } },
    update: {},
    create: {
      tenantId,
      code: 'RAW-ALLOY',
      name: 'High-Tensile Raw Alloy Stocks',
    },
  });

  const prodSteel = await prisma.product.upsert({
    where: { tenantId_sku: { tenantId, sku: 'RAW-4140-BAR' } },
    update: {},
    create: {
      tenantId,
      categoryId: catRaw.id,
      sku: 'RAW-4140-BAR',
      name: '4140 Chrome-Moly Alloy Steel Bar 65mm',
      unitOfMeasure: 'KG',
      costPrice: 12.50,
      sellingPrice: 19.50,
      minStockLevel: 250,
    },
  });

  const prodGear = await prisma.product.upsert({
    where: { tenantId_sku: { tenantId, sku: 'FG-HEAVY-GEAR-40T' } },
    update: {},
    create: {
      tenantId,
      categoryId: catMachined.id,
      sku: 'FG-HEAVY-GEAR-40T',
      name: 'Precision Helical Pinion Gear 40-Tooth',
      unitOfMeasure: 'PCS',
      costPrice: 145.00,
      sellingPrice: 320.00,
      minStockLevel: 20,
    },
  });

  const prodShaft = await prisma.product.upsert({
    where: { tenantId_sku: { tenantId, sku: 'FG-ROTOR-SHAFT' } },
    update: {},
    create: {
      tenantId,
      categoryId: catMachined.id,
      sku: 'FG-ROTOR-SHAFT',
      name: 'Turbine Rotor Transmission Shaft 1200mm',
      unitOfMeasure: 'PCS',
      costPrice: 480.00,
      sellingPrice: 950.00,
      minStockLevel: 10,
    },
  });

  const prodValve = await prisma.product.upsert({
    where: { tenantId_sku: { tenantId, sku: 'RAW-VALVE-CAST' } },
    update: {},
    create: {
      tenantId,
      categoryId: catRaw.id,
      sku: 'RAW-VALVE-CAST',
      name: 'High-Pressure Hydraulic Valve Body Casting',
      unitOfMeasure: 'PCS',
      costPrice: 85.00,
      sellingPrice: 140.00,
      minStockLevel: 50,
    },
  });

  // 2. Warehouses & Stock Levels
  const whMain = await prisma.warehouse.upsert({
    where: { tenantId_code: { tenantId, code: 'WH-MAIN-PLANT' } },
    update: {},
    create: {
      tenantId,
      code: 'WH-MAIN-PLANT',
      name: 'Main Plant Advanced Logistics Center',
      location: 'Building A, High-Tech Industrial Park',
      isPrimary: true,
    },
  });

  const whAssembly = await prisma.warehouse.upsert({
    where: { tenantId_code: { tenantId, code: 'WH-ASSEMBLY-BAY' } },
    update: {},
    create: {
      tenantId,
      code: 'WH-ASSEMBLY-BAY',
      name: 'Final Assembly & QA Staging Hub',
      location: 'Bay 4, Cleanroom Facility',
      isPrimary: false,
    },
  });

  const productsList = [
    { p: prodSteel, onHand: 1850, reserved: 200, avail: 1650 },
    { p: prodGear, onHand: 85, reserved: 15, avail: 70 },
    { p: prodShaft, onHand: 34, reserved: 8, avail: 26 },
    { p: prodValve, onHand: 28, reserved: 5, avail: 23 }, // Low stock below 50
  ];

  for (const item of productsList) {
    await prisma.stockLevel.upsert({
      where: { warehouseId_productId: { warehouseId: whMain.id, productId: item.p.id } },
      update: { quantityOnHand: item.onHand, quantityReserved: item.reserved, quantityAvailable: item.avail },
      create: {
        tenantId,
        warehouseId: whMain.id,
        productId: item.p.id,
        quantityOnHand: item.onHand,
        quantityReserved: item.reserved,
        quantityAvailable: item.avail,
      },
    });
  }

  // 3. Manufacturing Work Orders
  const workOrdersSeed = [
    { num: 'WO-2026-001', prod: prodGear, target: 100, completed: 85, scrap: 3, status: 'IN_PROGRESS' },
    { num: 'WO-2026-002', prod: prodShaft, target: 50, completed: 50, scrap: 1, status: 'COMPLETED' },
    { num: 'WO-2026-003', prod: prodGear, target: 200, completed: 0, scrap: 0, status: 'RELEASED' },
    { num: 'WO-2026-004', prod: prodShaft, target: 40, completed: 0, scrap: 0, status: 'DRAFT' },
  ];

  for (const wo of workOrdersSeed) {
    await prisma.workOrder.upsert({
      where: { tenantId_woNumber: { tenantId, woNumber: wo.num } },
      update: { completedQuantity: wo.completed, scrappedQuantity: wo.scrap, status: wo.status as any },
      create: {
        tenantId,
        woNumber: wo.num,
        productId: wo.prod.id,
        targetQuantity: wo.target,
        completedQuantity: wo.completed,
        scrappedQuantity: wo.scrap,
        status: wo.status as any,
        scheduledStartDate: new Date(),
        scheduledEndDate: new Date(Date.now() + 7 * 86400000),
      },
    });
  }

  // 4. Quality Inspection Records
  const qualityPlans = await prisma.inspectionPlan.findMany({ where: { tenantId } });
  let planId = qualityPlans[0]?.id;

  if (!planId) {
    const newPlan = await prisma.inspectionPlan.create({
      data: {
        tenantId,
        productId: prodGear.id,
        planCode: 'QA-PLAN-HEAVY-GEAR',
        name: 'ISO 2859-1 Level II Precision Gear Inspection Plan',
        version: 1,
        inspectionType: 'IN_PROCESS',
        samplingStandard: 'ISO 2859-1 Level II Tightened',
        aqlLevel: '1.0 Major / 2.5 Minor',
      },
    });
    planId = newPlan.id;
  }

  const inspectionsSeed = [
    { num: 'INSP-2026-001', stage: 'IN_PROCESS', sample: 32, passed: 31, rejected: 1, status: 'PASS', inspector: 'David Vance, Lead QA Auditor' },
    { num: 'INSP-2026-002', stage: 'RECEIVING_GRN', sample: 50, passed: 50, rejected: 0, status: 'PASS', inspector: 'Elena Rostova, Inward Quality Officer' },
    { num: 'INSP-2026-003', stage: 'FINAL_DISPATCH', sample: 20, passed: 18, rejected: 2, status: 'FAIL', inspector: 'Michael Chang, Senior QM Lead' },
    { num: 'INSP-2026-004', stage: 'IN_PROCESS', sample: 15, passed: 15, rejected: 0, status: 'PASS', inspector: 'David Vance, Lead QA Auditor' },
  ];

  for (const insp of inspectionsSeed) {
    await prisma.qualityInspection.upsert({
      where: { tenantId_inspectionNumber: { tenantId, inspectionNumber: insp.num } },
      update: {},
      create: {
        tenantId,
        planId,
        inspectionNumber: insp.num,
        stage: insp.stage as any,
        sampleSize: insp.sample,
        passedQuantity: insp.passed,
        rejectedQuantity: insp.rejected,
        status: insp.status as any,
        inspectorName: insp.inspector,
        inspectionDate: new Date(),
      },
    });
  }

  // 5. WMS Batch & Inventory Ledger
  const batch1 = await prisma.batchLot.upsert({
    where: { tenantId_batchNumber: { tenantId, batchNumber: 'LOT-2026-001' } },
    update: {},
    create: {
      tenantId,
      productId: prodSteel.id,
      batchNumber: 'LOT-2026-001',
      initialQuantity: 2000,
      currentQuantity: 1850,
      status: 'RELEASED',
    },
  });

  const ledgerMovements = [
    { type: 'GRN_RECEIPT', p: prodSteel, batch: batch1, qty: 2000, unitCost: 12.50, totalCost: 25000.00, bal: 2000 },
    { type: 'WORK_ORDER_ISSUE', p: prodSteel, batch: batch1, qty: -150, unitCost: 12.50, totalCost: 1875.00, bal: 1850 },
    { type: 'WORK_ORDER_RECEIPT', p: prodGear, batch: undefined, qty: 85, unitCost: 145.00, totalCost: 12325.00, bal: 85 },
    { type: 'SALES_DISPATCH', p: prodGear, batch: undefined, qty: -15, unitCost: 145.00, totalCost: 2175.00, bal: 70 },
  ];

  for (const m of ledgerMovements) {
    await prisma.inventoryLedger.create({
      data: {
        tenantId,
        productId: m.p.id,
        batchId: m.batch ? m.batch.id : null,
        movementType: m.type as any,
        quantity: m.qty,
        unitCost: m.unitCost,
        totalCost: m.totalCost,
        balanceAfter: m.bal,
        timestamp: new Date(),
      },
    });
  }

  // 6. Vendors & Purchase Orders
  const vendorAlloy = await prisma.vendor.upsert({
    where: { tenantId_code: { tenantId, code: 'VEND-ALLOY-CORP' } },
    update: {},
    create: {
      tenantId,
      code: 'VEND-ALLOY-CORP',
      companyName: 'Global Special Steel & Alloy Foundries Ltd',
      contactName: 'Robert Vance, Chief Procurement Director',
      email: 'sales@alloyspecialsteel.com',
      paymentTerms: 'NET30',
    },
  });

  const vendorHydraulic = await prisma.vendor.upsert({
    where: { tenantId_code: { tenantId, code: 'VEND-HYDRAULIC-IND' } },
    update: {},
    create: {
      tenantId,
      code: 'VEND-HYDRAULIC-IND',
      companyName: 'Precision Hydraulic Castings & Valves GmbH',
      contactName: 'Hans Gruber, Regional Sales Lead',
      email: 'h.gruber@hydraulicvalves.de',
      paymentTerms: 'NET45',
    },
  });

  const po1 = await prisma.purchaseOrder.upsert({
    where: { tenantId_poNumber: { tenantId, poNumber: 'PO-2026-001' } },
    update: {},
    create: {
      tenantId,
      vendorId: vendorAlloy.id,
      poNumber: 'PO-2026-001',
      status: 'APPROVED',
      subtotal: 25000.00,
      taxAmount: 2500.00,
      totalAmount: 27500.00,
    },
  });

  const po2 = await prisma.purchaseOrder.upsert({
    where: { tenantId_poNumber: { tenantId, poNumber: 'PO-2026-002' } },
    update: {},
    create: {
      tenantId,
      vendorId: vendorHydraulic.id,
      poNumber: 'PO-2026-002',
      status: 'SUBMITTED',
      subtotal: 8500.00,
      taxAmount: 850.00,
      totalAmount: 9350.00,
    },
  });

  // 7. Customers & Sales Orders
  const custAero = await prisma.customer.upsert({
    where: { tenantId_code: { tenantId, code: 'CUST-AEROTECH' } },
    update: {},
    create: {
      tenantId,
      code: 'CUST-AEROTECH',
      name: 'AeroTech Commercial Aircraft Systems Corp',
      email: 'purchasing@aerotechsystems.internal',
      creditLimit: 500000.0,
      billingAddress: '9000 Aviation Parkway, Seattle, WA 98101',
    },
  });

  const custTitan = await prisma.customer.upsert({
    where: { tenantId_code: { tenantId, code: 'CUST-TITAN-HEAVY' } },
    update: {},
    create: {
      tenantId,
      code: 'CUST-TITAN-HEAVY',
      name: 'Titan Heavy Mining & Earthmoving Equipment Ltd',
      email: 'orders@titanheavyequipment.com',
      creditLimit: 750000.0,
      billingAddress: '450 Industrial Highway, Chicago, IL 60601',
    },
  });

  await prisma.salesOrder.upsert({
    where: { tenantId_orderNumber: { tenantId, orderNumber: 'SO-2026-001' } },
    update: {},
    create: {
      tenantId,
      customerId: custAero.id,
      orderNumber: 'SO-2026-001',
      status: 'CONFIRMED',
      subtotal: 48000.00,
      taxAmount: 4800.00,
      totalAmount: 52800.00,
    },
  });

  await prisma.salesOrder.upsert({
    where: { tenantId_orderNumber: { tenantId, orderNumber: 'SO-2026-002' } },
    update: {},
    create: {
      tenantId,
      customerId: custTitan.id,
      orderNumber: 'SO-2026-002',
      status: 'DELIVERED',
      subtotal: 85500.00,
      taxAmount: 8550.00,
      totalAmount: 94050.00,
    },
  });

  // 8. Employees & HR Attendance
  const deptEngineering = await prisma.department.upsert({
    where: { tenantId_code: { tenantId, code: 'DEP-ENG' } },
    update: {},
    create: {
      tenantId,
      code: 'DEP-ENG',
      name: 'Precision Engineering & Shop Floor Production',
    },
  });

  const deptQuality = await prisma.department.upsert({
    where: { tenantId_code: { tenantId, code: 'DEP-QA' } },
    update: {},
    create: {
      tenantId,
      code: 'DEP-QA',
      name: 'Quality Assurance & ISO Compliance',
    },
  });

  const emp1 = await prisma.employee.upsert({
    where: { tenantId_employeeCode: { tenantId, employeeCode: 'EMP-1001' } },
    update: {},
    create: {
      tenantId,
      employeeCode: 'EMP-1001',
      firstName: 'David',
      lastName: 'Vance',
      email: 'd.vance@elevateiq.internal',
      departmentId: deptQuality.id,
      jobTitle: 'Lead QA Systems Auditor',
      baseSalary: 95000.00,
      status: 'ACTIVE',
    },
  });

  const emp2 = await prisma.employee.upsert({
    where: { tenantId_employeeCode: { tenantId, employeeCode: 'EMP-1002' } },
    update: {},
    create: {
      tenantId,
      employeeCode: 'EMP-1002',
      firstName: 'Marcus',
      lastName: 'Reeves',
      email: 'm.reeves@elevateiq.internal',
      departmentId: deptEngineering.id,
      jobTitle: 'Senior CNC Operations Specialist',
      baseSalary: 82000.00,
      status: 'ACTIVE',
    },
  });

  // 9. General Ledger Accounts
  const coa = [
    { code: '1000', name: 'Operating Cash & Treasury Bank Account', type: 'ASSET' },
    { code: '1100', name: 'Accounts Receivable (Trade CRM)', type: 'ASSET' },
    { code: '1300', name: 'Raw Material Inventory Asset', type: 'ASSET' },
    { code: '1350', name: 'Finished Goods Inventory Asset', type: 'ASSET' },
    { code: '1500', name: 'Plant Machinery & CNC Equipment (Fixed Asset)', type: 'ASSET' },
    { code: '2000', name: 'Accounts Payable (Trade Vendors)', type: 'LIABILITY' },
    { code: '2010', name: 'GRN Inward Receipts Clearing Accrual', type: 'LIABILITY' },
    { code: '3000', name: 'Common Shareholder Capital', type: 'EQUITY' },
    { code: '3900', name: 'Retained Earnings', type: 'EQUITY' },
    { code: '4000', name: 'Manufacturing Sales Revenue', type: 'REVENUE' },
    { code: '5000', name: 'Cost of Goods Sold (Direct Materials)', type: 'EXPENSE' },
    { code: '5100', name: 'Direct Labor Manufacturing Expense', type: 'EXPENSE' },
  ];

  for (const acc of coa) {
    await prisma.account.upsert({
      where: { tenantId_accountCode: { tenantId, accountCode: acc.code } },
      update: {},
      create: {
        tenantId,
        accountCode: acc.code,
        accountName: acc.name,
        accountType: acc.type as any,
      },
    });
  }

  console.log('✅ Universal ERP Module Populator Completed Successfully for all menus!');
}
