import { Response, NextFunction } from 'express';
import { SalesService } from './sales.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { z } from 'zod';

const createCustomerSchema = z.object({
  code: z.string().min(1, 'Customer code is required'),
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  creditLimit: z.number().nonnegative().optional(),
});

const createQuotationSchema = z.object({
  customerId: z.string().min(1),
  validUntil: z.string().transform((val) => new Date(val)),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
      discount: z.number().min(0).max(100).optional(),
    })
  ).min(1),
});

const createSalesOrderSchema = z.object({
  customerId: z.string().min(1),
  warehouseId: z.string().min(1),
  quotationId: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
      discount: z.number().min(0).max(100).optional(),
    })
  ).min(1),
});

const createInvoiceSchema = z.object({
  salesOrderId: z.string().min(1),
  dueDate: z.string().transform((val) => new Date(val)),
  taxRate: z.number().nonnegative().optional(),
});

const recordPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.string().optional(),
  reference: z.string().optional(),
});

export class SalesController {
  static async createCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createCustomerSchema.parse(req.body);
      const result = await SalesService.createCustomer(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SalesService.getCustomers(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createQuotation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createQuotationSchema.parse(req.body);
      const result = await SalesService.createQuotation(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getQuotations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SalesService.getQuotations(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createSalesOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createSalesOrderSchema.parse(req.body);
      const result = await SalesService.createSalesOrder(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async confirmSalesOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SalesService.confirmSalesOrder(req.tenantId!, id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getSalesOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SalesService.getSalesOrders(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createInvoice(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createInvoiceSchema.parse(req.body);
      const result = await SalesService.createInvoice(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async recordPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = recordPaymentSchema.parse(req.body);
      const result = await SalesService.recordPayment(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getInvoices(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SalesService.getInvoices(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
