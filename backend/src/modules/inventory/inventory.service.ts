import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';
import { TransferStatus } from '@forge-erp/shared';

export interface CreateProductDto {
  categoryId: string;
  sku: string;
  name: string;
  description?: string;
  unitOfMeasure?: string;
  costPrice: number;
  sellingPrice: number;
  minStockLevel?: number;
}

export interface CreateWarehouseDto {
  code: string;
  name: string;
  location?: string;
  isPrimary?: boolean;
}

export interface StockTransferRequestDto {
  sourceWarehouseId: string;
  targetWarehouseId: string;
  items: { productId: string; quantity: number }[];
  requestedBy: string;
  notes?: string;
}

export class InventoryService {
  // Category Operations
  static async createCategory(tenantId: string, data: { name: string; code: string; description?: string }) {
    const existing = await prisma.category.findFirst({
      where: { tenantId, code: data.code },
    });
    if (existing) {
      throw new AppError(`Category with code ${data.code} already exists`, 400);
    }
    return prisma.category.create({
      data: { tenantId, ...data },
    });
  }

  static async getCategories(tenantId: string) {
    return prisma.category.findMany({
      where: { tenantId },
      include: { _count: { select: { products: true } } },
    });
  }

  // Product Operations
  static async createProduct(tenantId: string, dto: CreateProductDto) {
    const existingSku = await prisma.product.findFirst({
      where: { tenantId, sku: dto.sku },
    });
    if (existingSku) {
      throw new AppError(`Product with SKU '${dto.sku}' already exists in this organization`, 400);
    }

    const product = await prisma.product.create({
      data: {
        tenantId,
        categoryId: dto.categoryId,
        sku: dto.sku,
        name: dto.name,
        description: dto.description,
        unitOfMeasure: dto.unitOfMeasure || 'units',
        costPrice: dto.costPrice,
        sellingPrice: dto.sellingPrice,
        minStockLevel: dto.minStockLevel || 10,
      },
      include: { category: true },
    });

    // Automatically initialize stock level across existing warehouses
    const warehouses = await prisma.warehouse.findMany({ where: { tenantId } });
    if (warehouses.length > 0) {
      await prisma.stockLevel.createMany({
        data: warehouses.map((wh) => ({
          tenantId,
          productId: product.id,
          warehouseId: wh.id,
          quantityOnHand: 0,
          quantityReserved: 0,
          quantityAvailable: 0,
        })),
        skipDuplicates: true,
      });
    }

    return product;
  }

  static async getProducts(tenantId: string, query?: { search?: string; categoryId?: string }) {
    const whereClause: any = { tenantId };
    if (query?.categoryId) {
      whereClause.categoryId = query.categoryId;
    }
    if (query?.search) {
      whereClause.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        stockLevels: {
          include: { warehouse: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Warehouse Operations
  static async createWarehouse(tenantId: string, dto: CreateWarehouseDto) {
    const existing = await prisma.warehouse.findFirst({
      where: { tenantId, code: dto.code },
    });
    if (existing) {
      throw new AppError(`Warehouse code '${dto.code}' already exists`, 400);
    }

    const warehouse = await prisma.warehouse.create({
      data: { tenantId, ...dto },
    });

    // Initialize stock records for existing products
    const products = await prisma.product.findMany({ where: { tenantId } });
    if (products.length > 0) {
      await prisma.stockLevel.createMany({
        data: products.map((p) => ({
          tenantId,
          productId: p.id,
          warehouseId: warehouse.id,
          quantityOnHand: 0,
          quantityReserved: 0,
          quantityAvailable: 0,
        })),
        skipDuplicates: true,
      });
    }

    return warehouse;
  }

  static async getWarehouses(tenantId: string) {
    return prisma.warehouse.findMany({
      where: { tenantId },
      include: {
        stockLevels: {
          include: { product: true },
        },
      },
    });
  }

  // Stock Adjustment / Seed
  static async adjustStock(
    tenantId: string,
    warehouseId: string,
    productId: string,
    adjustmentQuantity: number
  ) {
    return prisma.$transaction(async (tx) => {
      const stock = await tx.stockLevel.findUnique({
        where: { warehouseId_productId: { warehouseId, productId } },
      });

      if (!stock) {
        return tx.stockLevel.create({
          data: {
            tenantId,
            warehouseId,
            productId,
            quantityOnHand: Math.max(0, adjustmentQuantity),
            quantityReserved: 0,
            quantityAvailable: Math.max(0, adjustmentQuantity),
          },
        });
      }

      const newOnHand = stock.quantityOnHand + adjustmentQuantity;
      if (newOnHand < 0) {
        throw new AppError('Adjustment results in negative stock on hand', 400);
      }

      const newAvailable = newOnHand - stock.quantityReserved;

      return tx.stockLevel.update({
        where: { id: stock.id },
        data: {
          quantityOnHand: newOnHand,
          quantityAvailable: newAvailable,
        },
      });
    });
  }

  // Stock Transfer Workflow
  static async createStockTransfer(tenantId: string, dto: StockTransferRequestDto) {
    if (dto.sourceWarehouseId === dto.targetWarehouseId) {
      throw new AppError('Source and target warehouse cannot be the same', 400);
    }

    return prisma.$transaction(async (tx) => {
      // Validate availability in source warehouse
      for (const item of dto.items) {
        const stock = await tx.stockLevel.findUnique({
          where: {
            warehouseId_productId: {
              warehouseId: dto.sourceWarehouseId,
              productId: item.productId,
            },
          },
        });

        if (!stock || stock.quantityAvailable < item.quantity) {
          throw new AppError(
            `Insufficient available stock for product in source warehouse. Available: ${stock?.quantityAvailable || 0}, Requested: ${item.quantity}`,
            400
          );
        }
      }

      const transferCount = await tx.stockTransfer.count({ where: { tenantId } });
      const transferNumber = `TRF-${new Date().getFullYear()}-${String(transferCount + 1).padStart(5, '0')}`;

      const transfer = await tx.stockTransfer.create({
        data: {
          tenantId,
          transferNumber,
          sourceWarehouseId: dto.sourceWarehouseId,
          targetWarehouseId: dto.targetWarehouseId,
          status: TransferStatus.PENDING,
          requestedBy: dto.requestedBy,
          notes: dto.notes,
          items: {
            create: dto.items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      return transfer;
    });
  }

  static async completeStockTransfer(tenantId: string, transferId: string, approvedBy: string) {
    return prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findFirst({
        where: { id: transferId, tenantId },
        include: { items: true },
      });

      if (!transfer) {
        throw new AppError('Stock transfer request not found', 404);
      }

      if (transfer.status === TransferStatus.COMPLETED) {
        throw new AppError('Transfer has already been completed', 400);
      }

      // Execute inventory transfer deduction & addition
      for (const item of transfer.items) {
        // Decrement source warehouse
        const sourceStock = await tx.stockLevel.findUnique({
          where: {
            warehouseId_productId: {
              warehouseId: transfer.sourceWarehouseId,
              productId: item.productId,
            },
          },
        });

        if (!sourceStock || sourceStock.quantityAvailable < item.quantity) {
          throw new AppError('Insufficient inventory to fulfill transfer completion', 400);
        }

        await tx.stockLevel.update({
          where: { id: sourceStock.id },
          data: {
            quantityOnHand: sourceStock.quantityOnHand - item.quantity,
            quantityAvailable: sourceStock.quantityAvailable - item.quantity,
          },
        });

        // Increment target warehouse
        const targetStock = await tx.stockLevel.findUnique({
          where: {
            warehouseId_productId: {
              warehouseId: transfer.targetWarehouseId,
              productId: item.productId,
            },
          },
        });

        if (targetStock) {
          await tx.stockLevel.update({
            where: { id: targetStock.id },
            data: {
              quantityOnHand: targetStock.quantityOnHand + item.quantity,
              quantityAvailable: targetStock.quantityAvailable + item.quantity,
            },
          });
        } else {
          await tx.stockLevel.create({
            data: {
              tenantId,
              warehouseId: transfer.targetWarehouseId,
              productId: item.productId,
              quantityOnHand: item.quantity,
              quantityReserved: 0,
              quantityAvailable: item.quantity,
            },
          });
        }
      }

      return tx.stockTransfer.update({
        where: { id: transfer.id },
        data: {
          status: TransferStatus.COMPLETED,
          approvedBy,
        },
        include: { items: true },
      });
    });
  }

  static async getLowStockAlerts(tenantId: string) {
    const products = await prisma.product.findMany({
      where: { tenantId },
      include: {
        category: true,
        stockLevels: {
          include: { warehouse: true },
        },
      },
    });

    const alerts = products
      .map((p) => {
        const totalOnHand = p.stockLevels.reduce((sum, s) => sum + s.quantityOnHand, 0);
        const totalAvailable = p.stockLevels.reduce((sum, s) => sum + s.quantityAvailable, 0);
        return {
          productId: p.id,
          sku: p.sku,
          name: p.name,
          category: p.category.name,
          minStockLevel: p.minStockLevel,
          totalOnHand,
          totalAvailable,
          isCritical: totalAvailable === 0,
          deficit: Math.max(0, p.minStockLevel - totalAvailable),
        };
      })
      .filter((item) => item.totalAvailable <= item.minStockLevel);

    return alerts;
  }
}
