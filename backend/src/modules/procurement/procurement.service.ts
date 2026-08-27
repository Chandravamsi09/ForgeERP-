import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';
import { PurchaseOrderStatus } from '@forge-erp/shared';

export interface CreateVendorDto {
  code: string;
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  address?: string;
  paymentTerms?: string;
}

export interface CreatePurchaseOrderDto {
  vendorId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface CreateGRNDto {
  purchaseOrderId: string;
  warehouseId: string;
  notes?: string;
  items: {
    purchaseOrderItemId: string;
    quantityReceived: number;
  }[];
}

export class ProcurementService {
  // Vendor Operations
  static async createVendor(tenantId: string, dto: CreateVendorDto) {
    const existing = await prisma.vendor.findFirst({
      where: { tenantId, code: dto.code },
    });
    if (existing) {
      throw new AppError(`Vendor code '${dto.code}' already exists`, 400);
    }
    return prisma.vendor.create({
      data: { tenantId, ...dto },
    });
  }

  static async getVendors(tenantId: string) {
    return prisma.vendor.findMany({
      where: { tenantId },
      include: { _count: { select: { purchaseOrders: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Purchase Order Operations
  static async createPurchaseOrder(tenantId: string, createdById: string, dto: CreatePurchaseOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new AppError('Purchase order must contain at least one line item', 400);
    }

    const poCount = await prisma.purchaseOrder.count({ where: { tenantId } });
    const poNumber = `PO-${new Date().getFullYear()}-${String(poCount + 1).padStart(5, '0')}`;

    let subtotal = 0;
    const itemsData = dto.items.map((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      subtotal += lineTotal;
      return {
        productId: item.productId,
        unitPrice: item.unitPrice,
        quantityOrdered: item.quantity,
        quantityReceived: 0,
        totalPrice: lineTotal,
      };
    });

    const taxAmount = Number((subtotal * 0.1).toFixed(2)); // Standard 10% VAT
    const totalAmount = Number((subtotal + taxAmount).toFixed(2));

    return prisma.purchaseOrder.create({
      data: {
        tenantId,
        poNumber,
        vendorId: dto.vendorId,
        createdById,
        status: PurchaseOrderStatus.DRAFT,
        subtotal,
        taxAmount,
        totalAmount,
        items: {
          create: itemsData,
        },
      },
      include: {
        vendor: true,
        items: { include: { product: true } },
      },
    });
  }

  static async getPurchaseOrders(tenantId: string) {
    return prisma.purchaseOrder.findMany({
      where: { tenantId },
      include: {
        vendor: true,
        items: { include: { product: true } },
        goodsReceived: { include: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async submitPurchaseOrder(tenantId: string, poId: string) {
    const po = await prisma.purchaseOrder.findFirst({
      where: { id: poId, tenantId },
    });
    if (!po) throw new AppError('Purchase order not found', 404);
    if (po.status !== PurchaseOrderStatus.DRAFT) {
      throw new AppError('Only DRAFT purchase orders can be submitted for approval', 400);
    }

    return prisma.purchaseOrder.update({
      where: { id: po.id },
      data: { status: PurchaseOrderStatus.SUBMITTED },
      include: { vendor: true, items: true },
    });
  }

  static async approvePurchaseOrder(tenantId: string, poId: string, approvedById: string) {
    const po = await prisma.purchaseOrder.findFirst({
      where: { id: poId, tenantId },
    });
    if (!po) throw new AppError('Purchase order not found', 404);
    if (po.status !== PurchaseOrderStatus.SUBMITTED) {
      throw new AppError('Only SUBMITTED purchase orders can be approved', 400);
    }

    return prisma.purchaseOrder.update({
      where: { id: po.id },
      data: {
        status: PurchaseOrderStatus.APPROVED,
        approvedById,
        approvedAt: new Date(),
      },
      include: { vendor: true, items: true },
    });
  }

  // Goods Received Note (GRN) & Automated Stock Update
  static async createGRN(tenantId: string, receivedById: string, dto: CreateGRNDto) {
    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.findFirst({
        where: { id: dto.purchaseOrderId, tenantId },
        include: { items: true },
      });

      if (!po) throw new AppError('Purchase order not found', 404);
      if (po.status !== PurchaseOrderStatus.APPROVED && po.status !== PurchaseOrderStatus.SUBMITTED) {
        throw new AppError('Cannot receive goods for an unapproved or cancelled purchase order', 400);
      }

      const grnCount = await tx.goodsReceivedNote.count({ where: { tenantId } });
      const grnNumber = `GRN-${new Date().getFullYear()}-${String(grnCount + 1).padStart(5, '0')}`;

      // Create GRN
      const grn = await tx.goodsReceivedNote.create({
        data: {
          tenantId,
          grnNumber,
          purchaseOrderId: dto.purchaseOrderId,
          warehouseId: dto.warehouseId,
          receivedById,
          notes: dto.notes,
          items: {
            create: dto.items.map((i) => ({
              purchaseOrderItemId: i.purchaseOrderItemId,
              quantityReceived: i.quantityReceived,
            })),
          },
        },
      });

      // Update PO items quantityReceived and warehouse stock levels
      for (const itemDto of dto.items) {
        const poItem = po.items.find((i) => i.id === itemDto.purchaseOrderItemId);
        if (!poItem) continue;

        // Update PO item
        await tx.purchaseOrderItem.update({
          where: { id: poItem.id },
          data: {
            quantityReceived: poItem.quantityReceived + itemDto.quantityReceived,
          },
        });

        // Update / Insert stock level in destination warehouse
        const stock = await tx.stockLevel.findUnique({
          where: {
            warehouseId_productId: {
              warehouseId: dto.warehouseId,
              productId: poItem.productId,
            },
          },
        });

        if (stock) {
          await tx.stockLevel.update({
            where: { id: stock.id },
            data: {
              quantityOnHand: stock.quantityOnHand + itemDto.quantityReceived,
              quantityAvailable: stock.quantityAvailable + itemDto.quantityReceived,
            },
          });
        } else {
          await tx.stockLevel.create({
            data: {
              tenantId,
              warehouseId: dto.warehouseId,
              productId: poItem.productId,
              quantityOnHand: itemDto.quantityReceived,
              quantityReserved: 0,
              quantityAvailable: itemDto.quantityReceived,
            },
          });
        }
      }

      // Check if all items are fully fulfilled
      const updatedPoItems = await tx.purchaseOrderItem.findMany({
        where: { purchaseOrderId: po.id },
      });
      const allFulfilled = updatedPoItems.every((item) => item.quantityReceived >= item.quantityOrdered);

      if (allFulfilled) {
        await tx.purchaseOrder.update({
          where: { id: po.id },
          data: { status: PurchaseOrderStatus.FULFILLED },
        });
      }

      return grn;
    });
  }
}
