import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';

export interface CreateBinDto {
  warehouseId: string;
  binCode: string;
  zone: string;
  maxWeightKg?: number;
}

export interface PutawayStockDto {
  binId: string;
  productId: string;
  batchNumber?: string;
  quantity: number;
  unitCost: number;
  movementType: 'GRN_RECEIPT' | 'PRODUCTION_RECEIPT' | 'PHYSICAL_ADJUSTMENT';
  referenceId?: string;
}

export interface LinkGenealogyDto {
  parentBatchId: string;
  childBatchId: string;
  workOrderId?: string;
  quantityUsed: number;
}

export class WMSService {
  /**
   * Creates a dedicated warehouse bin location (Zone, Aisle, Rack, Bin)
   */
  static async createBin(tenantId: string, dto: CreateBinDto) {
    const warehouse = await prisma.warehouse.findFirst({
      where: { id: dto.warehouseId, tenantId },
    });
    if (!warehouse) throw new AppError('Warehouse not found', 404);

    const existing = await prisma.warehouseBin.findUnique({
      where: {
        warehouseId_binCode: {
          warehouseId: dto.warehouseId,
          binCode: dto.binCode,
        },
      },
    });

    if (existing) throw new AppError(`Bin '${dto.binCode}' already exists in this warehouse`, 400);

    return prisma.warehouseBin.create({
      data: {
        tenantId,
        warehouseId: dto.warehouseId,
        binCode: dto.binCode,
        zone: dto.zone,
        maxWeightKg: dto.maxWeightKg || 500.0,
      },
      include: { warehouse: true },
    });
  }

  /**
   * Executes a WMS Putaway transaction: Allocates stock to specific Bin and records immutable InventoryLedger entry
   */
  static async putawayStock(tenantId: string, dto: PutawayStockDto) {
    return prisma.$transaction(async (tx) => {
      const bin = await tx.warehouseBin.findFirst({
        where: { id: dto.binId, tenantId },
        include: { warehouse: true },
      });

      if (!bin) throw new AppError('Warehouse bin location not found', 404);

      let batchId: string | null = null;
      if (dto.batchNumber) {
        const batch = await tx.batchLot.upsert({
          where: {
            tenantId_productId_batchNumber: {
              tenantId,
              productId: dto.productId,
              batchNumber: dto.batchNumber,
            },
          },
          update: {},
          create: {
            tenantId,
            productId: dto.productId,
            batchNumber: dto.batchNumber,
            manufactureDate: new Date(),
            status: 'RELEASED' as any,
          },
        });
        batchId = batch.id;
      }

      // 1. Update Bin Level Stock
      const existingBinStock = await tx.binStockLevel.findFirst({
        where: {
          binId: dto.binId,
          productId: dto.productId,
          batchId: batchId || undefined,
        },
      });

      if (existingBinStock) {
        await tx.binStockLevel.update({
          where: { id: existingBinStock.id },
          data: {
            quantityOnHand: existingBinStock.quantityOnHand + dto.quantity,
          },
        });
      } else {
        await tx.binStockLevel.create({
          data: {
            tenantId,
            productId: dto.productId,
            binId: dto.binId,
            batchId,
            quantityOnHand: dto.quantity,
          },
        });
      }

      // Mark bin as occupied
      await tx.warehouseBin.update({
        where: { id: bin.id },
        data: { isOccupied: true },
      });

      // 2. Update Facility-Level Aggregate Stock
      const existingWhStock = await tx.stockLevel.findUnique({
        where: {
          warehouseId_productId: {
            warehouseId: bin.warehouseId,
            productId: dto.productId,
          },
        },
      });

      const currentTotalOnHand = existingWhStock ? existingWhStock.quantityOnHand + dto.quantity : dto.quantity;
      const currentAvailable = existingWhStock ? existingWhStock.quantityAvailable + dto.quantity : dto.quantity;

      if (existingWhStock) {
        await tx.stockLevel.update({
          where: { id: existingWhStock.id },
          data: {
            quantityOnHand: currentTotalOnHand,
            quantityAvailable: currentAvailable,
          },
        });
      } else {
        await tx.stockLevel.create({
          data: {
            tenantId,
            productId: dto.productId,
            warehouseId: bin.warehouseId,
            quantityOnHand: currentTotalOnHand,
            quantityAvailable: currentAvailable,
          },
        });
      }

      // 3. Record Immutable Chronological Inventory Movement in Ledger
      const ledgerEntry = await tx.inventoryLedger.create({
        data: {
          tenantId,
          movementType: dto.movementType as any,
          productId: dto.productId,
          batchId,
          quantity: dto.quantity,
          unitCost: dto.unitCost,
          totalCost: dto.quantity * dto.unitCost,
          balanceAfter: currentTotalOnHand,
          referenceId: dto.referenceId,
        },
      });

      return ledgerEntry;
    });
  }

  /**
   * Links raw material batch to finished product lot (Bi-directional Lot Genealogy graph)
   */
  static async linkGenealogy(tenantId: string, dto: LinkGenealogyDto) {
    return prisma.genealogyLink.create({
      data: {
        tenantId,
        parentBatchId: dto.parentBatchId,
        childBatchId: dto.childBatchId,
        workOrderId: dto.workOrderId,
        quantityUsed: dto.quantityUsed,
      },
      include: {
        parentBatch: { include: { product: true } },
        childBatch: { include: { product: true } },
      },
    });
  }

  /**
   * Traces full genealogy tree:
   * Backward trace (What raw materials went into this batch?)
   * Forward trace (Where was this raw batch distributed / which customers received it?)
   */
  static async traceGenealogy(tenantId: string, batchNumber: string) {
    const batch = await prisma.batchLot.findFirst({
      where: { tenantId, batchNumber },
      include: {
        product: true,
        parentGenealogy: {
          include: {
            childBatch: { include: { product: true } },
            workOrder: true,
          },
        },
        childGenealogy: {
          include: {
            parentBatch: { include: { product: true } },
            workOrder: true,
          },
        },
      },
    });

    if (!batch) throw new AppError(`Batch '${batchNumber}' not found in genealogy database`, 404);

    return {
      targetBatch: batch,
      backwardTrace: batch.childGenealogy, // Raw material ancestry
      forwardTrace: batch.parentGenealogy,  // Finished good progeny
    };
  }

  /**
   * Retrieves high-volume immutable inventory ledger with server-side pagination
   */
  static async getInventoryLedger(tenantId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [total, entries] = await Promise.all([
      prisma.inventoryLedger.count({ where: { tenantId } }),
      prisma.inventoryLedger.findMany({
        where: { tenantId },
        include: { product: true, batch: true },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      entries,
    };
  }
}
