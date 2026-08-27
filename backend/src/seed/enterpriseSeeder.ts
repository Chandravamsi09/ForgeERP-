import { prisma } from '../config/db';
import { hashPassword } from '../utils/password';

export async function seedEnterpriseDatabase(tenantId?: string) {
  console.log('🌱 Starting ForgeERP Enterprise Factory Seeder...');

  // 1. Ensure Demo Tenant
  const tenant = await prisma.tenant.upsert({
    where: { code: 'FORGE-GLOBAL' },
    update: {},
    create: {
      code: 'FORGE-GLOBAL',
      name: 'Forge Global Manufacturing & Industrial Systems Corp',
      legalName: 'Forge Global Manufacturing & Industrial Systems Corp',
      currencyCode: 'USD',
      isMultiCurrency: true,
      country: 'US',
    },
  });

  const activeTenantId = tenantId || tenant.id;

  // 2. Default Chart of Accounts
  const coa = [
    { code: '1000', name: 'Operating Cash & Bank Account', type: 'ASSET' },
    { code: '1100', name: 'Accounts Receivable (Trade)', type: 'ASSET' },
    { code: '1199', name: 'Intercompany Accounts Receivable (Elimination)', type: 'ASSET' },
    { code: '1300', name: 'Raw Material Inventory Asset', type: 'ASSET' },
    { code: '1350', name: 'Finished Goods Inventory Asset', type: 'ASSET' },
    { code: '1500', name: 'Plant Machinery & CNC Equipment (Fixed Asset)', type: 'ASSET' },
    { code: '2000', name: 'Accounts Payable (Trade)', type: 'LIABILITY' },
    { code: '2010', name: 'GRN Inward Receipts Clearing (Accrual)', type: 'LIABILITY' },
    { code: '2099', name: 'Intercompany Accounts Payable (Elimination)', type: 'LIABILITY' },
    { code: '3000', name: 'Common Share Capital', type: 'EQUITY' },
    { code: '3900', name: 'Retained Earnings', type: 'EQUITY' },
    { code: '4000', name: 'Manufacturing Sales Revenue', type: 'REVENUE' },
    { code: '4999', name: 'Intercompany Sales Revenue (Elimination)', type: 'REVENUE' },
    { code: '5000', name: 'Cost of Goods Sold (Direct Materials)', type: 'EXPENSE' },
    { code: '5100', name: 'Direct Labor Manufacturing Expense', type: 'EXPENSE' },
    { code: '5200', name: 'Factory Overhead & Power Allocation', type: 'EXPENSE' },
    { code: '5999', name: 'Intercompany COGS (Elimination)', type: 'EXPENSE' },
  ];

  for (const acc of coa) {
    await prisma.account.upsert({
      where: { tenantId_accountCode: { tenantId: activeTenantId, accountCode: acc.code } },
      update: {},
      create: {
        tenantId: activeTenantId,
        accountCode: acc.code,
        accountName: acc.name,
        accountType: acc.type as any,
      },
    });
  }

  // 3. Categories & Unit of Measure
  const category = await prisma.category.upsert({
    where: { tenantId_code: { tenantId: activeTenantId, code: 'IND-GEAR' } },
    update: {},
    create: {
      tenantId: activeTenantId,
      code: 'IND-GEAR',
      name: 'Heavy Industrial Power Transmission Gears',
    },
  });

  // 4. Products (Raw Materials & Finished Assemblies)
  const rawSteel = await prisma.product.upsert({
    where: { tenantId_sku: { tenantId: activeTenantId, sku: 'RAW-STEEL-4140' } },
    update: {},
    create: {
      tenantId: activeTenantId,
      categoryId: category.id,
      sku: 'RAW-STEEL-4140',
      name: 'High-Tensile 4140 Alloy Steel Round Bar 50mm',
      unitOfMeasure: 'KG',
      costPrice: 8.50,
      sellingPrice: 14.00,
      minStockLevel: 500,
    },
  });

  const rawPinion = await prisma.product.upsert({
    where: { tenantId_sku: { tenantId: activeTenantId, sku: 'RAW-PINION-BLANK' } },
    update: {},
    create: {
      tenantId: activeTenantId,
      categoryId: category.id,
      sku: 'RAW-PINION-BLANK',
      name: 'Forged Pinion Gear Blank (Rough Machined)',
      unitOfMeasure: 'PCS',
      costPrice: 45.00,
      sellingPrice: 75.00,
      minStockLevel: 50,
    },
  });

  const finishedGearbox = await prisma.product.upsert({
    where: { tenantId_sku: { tenantId: activeTenantId, sku: 'FG-GEARBOX-500HP' } },
    update: {},
    create: {
      tenantId: activeTenantId,
      categoryId: category.id,
      sku: 'FG-GEARBOX-500HP',
      name: 'Heavy Industrial Reduction Gearbox 500HP',
      unitOfMeasure: 'UNIT',
      costPrice: 1250.00,
      sellingPrice: 2850.00,
      minStockLevel: 10,
    },
  });

  // 5. Primary Warehouse & Stock Levels
  const warehouse = await prisma.warehouse.upsert({
    where: { tenantId_code: { tenantId: activeTenantId, code: 'WH-MAIN-PLANT' } },
    update: {},
    create: {
      tenantId: activeTenantId,
      code: 'WH-MAIN-PLANT',
      name: 'Main Plant Advanced Logistics Center',
      isPrimary: true,
      location: 'Building A, High-Tech Industrial Zone',
    },
  });

  await prisma.stockLevel.upsert({
    where: { warehouseId_productId: { warehouseId: warehouse.id, productId: rawSteel.id } },
    update: {},
    create: {
      tenantId: activeTenantId,
      warehouseId: warehouse.id,
      productId: rawSteel.id,
      quantityOnHand: 2500,
      quantityReserved: 100,
      quantityAvailable: 2400,
    },
  });

  await prisma.stockLevel.upsert({
    where: { warehouseId_productId: { warehouseId: warehouse.id, productId: rawPinion.id } },
    update: {},
    create: {
      tenantId: activeTenantId,
      warehouseId: warehouse.id,
      productId: rawPinion.id,
      quantityOnHand: 120,
      quantityReserved: 20,
      quantityAvailable: 100,
    },
  });

  // 6. Vendor Master
  await prisma.vendor.upsert({
    where: { tenantId_code: { tenantId: activeTenantId, code: 'VEND-ALLOY-CORP' } },
    update: {},
    create: {
      tenantId: activeTenantId,
      code: 'VEND-ALLOY-CORP',
      companyName: 'Global Special Steel & Alloy Foundries Ltd',
      contactName: 'Robert Vance, Chief Procurement Director',
      email: 'sales@alloyspecialsteel.com',
      paymentTerms: 'NET30',
    },
  });

  // 7. Customer CRM
  await prisma.customer.upsert({
    where: { tenantId_code: { tenantId: activeTenantId, code: 'CUST-AEROTECH' } },
    update: {},
    create: {
      tenantId: activeTenantId,
      code: 'CUST-AEROTECH',
      name: 'AeroTech Commercial Aircraft Systems Corp',
      email: 'purchasing@aerotechsystems.internal',
      creditLimit: 500000.0,
      billingAddress: '9000 Aviation Parkway, Seattle, WA 98101',
    },
  });

  console.log('✅ ForgeERP Enterprise Factory Seeding Completed Successfully!');
}
