import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';
import { SalesOrderStatus, InvoiceStatus, QuotationStatus } from '@forge-erp/shared';

export interface CreateCustomerDto {
  code: string;
  name: string;
  email: string;
  phone?: string;
  billingAddress?: string;
  shippingAddress?: string;
  creditLimit?: number;
}

export interface CreateQuotationDto {
  customerId: string;
  validUntil: Date;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
}

export interface CreateSalesOrderDto {
  customerId: string;
  warehouseId: string;
  quotationId?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
}

export interface CreateInvoiceDto {
  salesOrderId: string;
  dueDate: Date;
  taxRate?: number;
}

export interface RecordPaymentDto {
  invoiceId: string;
  amount: number;
  paymentMethod?: string;
  reference?: string;
}

export class SalesService {
  // Customer Operations
  static async createCustomer(tenantId: string, dto: CreateCustomerDto) {
    const existing = await prisma.customer.findFirst({
      where: { tenantId, code: dto.code },
    });
    if (existing) {
      throw new AppError(`Customer with code '${dto.code}' already exists`, 400);
    }
    return prisma.customer.create({
      data: { tenantId, ...dto },
    });
  }

  static async getCustomers(tenantId: string) {
    return prisma.customer.findMany({
      where: { tenantId },
      include: {
        _count: { select: { salesOrders: true, invoices: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Quotation Operations
  static async createQuotation(tenantId: string, dto: CreateQuotationDto) {
    const quoteCount = await prisma.quotation.count({ where: { tenantId } });
    const quoteNumber = `QT-${new Date().getFullYear()}-${String(quoteCount + 1).padStart(5, '0')}`;

    let totalAmount = 0;
    const itemsData = dto.items.map((item) => {
      const discount = item.discount || 0;
      const lineTotal = item.quantity * item.unitPrice * (1 - discount / 100);
      totalAmount += lineTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount,
        totalPrice: Number(lineTotal.toFixed(2)),
      };
    });

    return prisma.quotation.create({
      data: {
        tenantId,
        quoteNumber,
        customerId: dto.customerId,
        validUntil: dto.validUntil,
        status: QuotationStatus.DRAFT,
        totalAmount: Number(totalAmount.toFixed(2)),
        items: {
          create: itemsData,
        },
      },
      include: { customer: true, items: { include: { product: true } } },
    });
  }

  static async getQuotations(tenantId: string) {
    return prisma.quotation.findMany({
      where: { tenantId },
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Sales Order Operations
  static async createSalesOrder(tenantId: string, dto: CreateSalesOrderDto) {
    return prisma.$transaction(async (tx) => {
      // Validate customer & outstanding credit limit
      const customer = await tx.customer.findFirst({
        where: { id: dto.customerId, tenantId },
        include: { invoices: { where: { status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID] } } } },
      });

      if (!customer) throw new AppError('Customer not found', 404);

      const outstandingBalance = customer.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

      let totalAmount = 0;
      const itemsData = dto.items.map((item) => {
        const discount = item.discount || 0;
        const lineTotal = item.quantity * item.unitPrice * (1 - discount / 100);
        totalAmount += lineTotal;
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount,
          totalPrice: Number(lineTotal.toFixed(2)),
        };
      });

      if (outstandingBalance + totalAmount > customer.creditLimit) {
        throw new AppError(
          `Credit limit exceeded. Limit: $${customer.creditLimit}, Outstanding: $${outstandingBalance}, Order: $${totalAmount}`,
          400
        );
      }

      const soCount = await tx.salesOrder.count({ where: { tenantId } });
      const soNumber = `SO-${new Date().getFullYear()}-${String(soCount + 1).padStart(5, '0')}`;

      const order = await tx.salesOrder.create({
        data: {
          tenantId,
          soNumber,
          customerId: dto.customerId,
          warehouseId: dto.warehouseId,
          quotationId: dto.quotationId,
          status: SalesOrderStatus.PENDING,
          totalAmount: Number(totalAmount.toFixed(2)),
          items: {
            create: itemsData,
          },
        },
        include: { customer: true, items: { include: { product: true } } },
      });

      if (dto.quotationId) {
        await tx.quotation.update({
          where: { id: dto.quotationId },
          data: { status: QuotationStatus.ACCEPTED },
        });
      }

      return order;
    });
  }

  static async confirmSalesOrder(tenantId: string, salesOrderId: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.salesOrder.findFirst({
        where: { id: salesOrderId, tenantId },
        include: { items: true },
      });

      if (!order) throw new AppError('Sales order not found', 404);
      if (order.status !== SalesOrderStatus.PENDING) {
        throw new AppError('Only PENDING sales orders can be confirmed', 400);
      }

      // Check warehouse availability and reserve inventory
      for (const item of order.items) {
        const stock = await tx.stockLevel.findUnique({
          where: {
            warehouseId_productId: {
              warehouseId: order.warehouseId,
              productId: item.productId,
            },
          },
        });

        if (!stock || stock.quantityAvailable < item.quantity) {
          throw new AppError(
            `Insufficient available stock for order confirmation. Available: ${stock?.quantityAvailable || 0}, Required: ${item.quantity}`,
            400
          );
        }

        // Reserve stock
        await tx.stockLevel.update({
          where: { id: stock.id },
          data: {
            quantityReserved: stock.quantityReserved + item.quantity,
            quantityAvailable: stock.quantityAvailable - item.quantity,
          },
        });
      }

      return tx.salesOrder.update({
        where: { id: order.id },
        data: { status: SalesOrderStatus.CONFIRMED },
        include: { customer: true, items: true },
      });
    });
  }

  static async getSalesOrders(tenantId: string) {
    return prisma.salesOrder.findMany({
      where: { tenantId },
      include: {
        customer: true,
        warehouse: true,
        items: { include: { product: true } },
        invoices: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Invoice & Order-to-Cash Operations
  static async createInvoice(tenantId: string, dto: CreateInvoiceDto) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.salesOrder.findFirst({
        where: { id: dto.salesOrderId, tenantId },
        include: { items: true, invoices: true },
      });

      if (!order) throw new AppError('Sales order not found', 404);
      if (order.status === SalesOrderStatus.PENDING || order.status === SalesOrderStatus.CANCELLED) {
        throw new AppError('Cannot invoice an unconfirmed or cancelled sales order', 400);
      }

      const invCount = await tx.invoice.count({ where: { tenantId } });
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invCount + 1).padStart(5, '0')}`;

      const subtotal = order.totalAmount;
      const taxRate = dto.taxRate !== undefined ? dto.taxRate : 10.0;
      const taxAmount = Number(((subtotal * taxRate) / 100).toFixed(2));
      const totalAmount = Number((subtotal + taxAmount).toFixed(2));

      const invoice = await tx.invoice.create({
        data: {
          tenantId,
          invoiceNumber,
          salesOrderId: order.id,
          customerId: order.customerId,
          status: InvoiceStatus.UNPAID,
          subtotal,
          taxRate,
          taxAmount,
          discountAmount: 0.0,
          totalAmount,
          dueDate: dto.dueDate,
          items: {
            create: order.items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              totalPrice: i.totalPrice,
            })),
          },
        },
        include: { items: true, customer: true },
      });

      return invoice;
    });
  }

  static async recordPayment(tenantId: string, dto: RecordPaymentDto) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findFirst({
        where: { id: dto.invoiceId, tenantId },
        include: { payments: true },
      });

      if (!invoice) throw new AppError('Invoice not found', 404);
      if (invoice.status === InvoiceStatus.PAID) {
        throw new AppError('Invoice is already fully paid', 400);
      }

      const paymentCount = await tx.payment.count({ where: { tenantId } });
      const paymentNumber = `PAY-${new Date().getFullYear()}-${String(paymentCount + 1).padStart(5, '0')}`;

      const payment = await tx.payment.create({
        data: {
          tenantId,
          invoiceId: invoice.id,
          paymentNumber,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod || 'BANK_TRANSFER',
          reference: dto.reference,
        },
      });

      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + dto.amount;
      const newStatus = totalPaid >= invoice.totalAmount ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID;

      await tx.invoice.update({
        where: { id: invoice.id },
        data: { status: newStatus },
      });

      return payment;
    });
  }

  static async getInvoices(tenantId: string) {
    return prisma.invoice.findMany({
      where: { tenantId },
      include: {
        customer: true,
        salesOrder: true,
        items: { include: { product: true } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
