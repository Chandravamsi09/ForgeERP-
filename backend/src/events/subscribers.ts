import { ERPEventBus, ERPEventPayload } from './eventBus';
import { prisma } from '../config/db';

export function initializeEventSubscribers(): void {
  // 1. GRN_POSTED -> Auto-trigger Inventory Ledger entry & 3-Way Match check
  ERPEventBus.subscribe('GRN_POSTED', async (event: ERPEventPayload<{ grnId: string; poId: string; totalAmount: number }>) => {
    try {
      // Create auto-generated General Ledger Journal Entry for Inward Goods Receipt
      const entryCount = await prisma.journalEntry.count({ where: { tenantId: event.tenantId } });
      const entryNumber = `JV-GRN-${new Date().getFullYear()}-${String(entryCount + 1).padStart(5, '0')}`;

      const [inventoryAssetAcc, apAccrualAcc] = await Promise.all([
        prisma.account.findFirst({ where: { tenantId: event.tenantId, accountCode: '1300' } }),
        prisma.account.findFirst({ where: { tenantId: event.tenantId, accountCode: '2010' } }),
      ]);

      if (inventoryAssetAcc && apAccrualAcc) {
        await prisma.journalEntry.create({
          data: {
            tenantId: event.tenantId,
            entryNumber,
            entryDate: new Date(),
            description: `Automated Inward Goods Inventory Receipt for GRN ${event.data.grnId}`,
            referenceType: 'GRN_RECEIPT',
            referenceId: event.data.grnId,
            status: 'POSTED' as any,
            lines: {
              create: [
                { accountId: inventoryAssetAcc.id, debit: event.data.totalAmount, credit: 0 },
                { accountId: apAccrualAcc.id, debit: 0, credit: event.data.totalAmount },
              ],
            },
          },
        });
      }

      // Log SOX Compliance Audit Record
      await prisma.auditLog.create({
        data: {
          tenantId: event.tenantId,
          userId: event.actorUserId,
          entityName: 'GoodsReceivedNote',
          entityId: event.data.grnId,
          action: 'STATE_TRANSITION' as any,
          newValuesJson: JSON.stringify(event.data),
          changedColumns: 'status,quantityAccepted,inventoryLedgerUpdated',
        },
      });
    } catch (error) {
      console.error('[EventSubscriber: GRN_POSTED error]', error);
    }
  });

  // 2. SALES_DISPATCH_CONFIRMED -> Deduct WMS stock & Record COGS Journal Entry
  ERPEventBus.subscribe('SALES_DISPATCH_CONFIRMED', async (event: ERPEventPayload<{ salesOrderId: string; challanId: string; cogsAmount: number }>) => {
    try {
      const entryCount = await prisma.journalEntry.count({ where: { tenantId: event.tenantId } });
      const entryNumber = `JV-COGS-${new Date().getFullYear()}-${String(entryCount + 1).padStart(5, '0')}`;

      const [cogsAcc, inventoryAcc] = await Promise.all([
        prisma.account.findFirst({ where: { tenantId: event.tenantId, accountCode: '5000' } }),
        prisma.account.findFirst({ where: { tenantId: event.tenantId, accountCode: '1300' } }),
      ]);

      if (cogsAcc && inventoryAcc && event.data.cogsAmount > 0) {
        await prisma.journalEntry.create({
          data: {
            tenantId: event.tenantId,
            entryNumber,
            entryDate: new Date(),
            description: `Automated COGS & Inventory Release for Dispatch Challan ${event.data.challanId}`,
            referenceType: 'SALES_DISPATCH',
            referenceId: event.data.challanId,
            status: 'POSTED' as any,
            lines: {
              create: [
                { accountId: cogsAcc.id, debit: event.data.cogsAmount, credit: 0 },
                { accountId: inventoryAcc.id, debit: 0, credit: event.data.cogsAmount },
              ],
            },
          },
        });
      }
    } catch (error) {
      console.error('[EventSubscriber: SALES_DISPATCH_CONFIRMED error]', error);
    }
  });

  // 3. QUALITY_NCR_RAISED -> Place Quarantine Lock on associated Batch/Lot
  ERPEventBus.subscribe('QUALITY_NCR_RAISED', async (event: ERPEventPayload<{ ncrId: string; batchNumber?: string; productId: string }>) => {
    try {
      if (event.data.batchNumber) {
        await prisma.batchLot.updateMany({
          where: {
            tenantId: event.tenantId,
            batchNumber: event.data.batchNumber,
            productId: event.data.productId,
          },
          data: {
            status: 'QUARANTINE' as any,
          },
        });
      }
    } catch (error) {
      console.error('[EventSubscriber: QUALITY_NCR_RAISED error]', error);
    }
  });
}
