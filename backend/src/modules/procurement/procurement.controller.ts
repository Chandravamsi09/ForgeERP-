import { Response, NextFunction } from 'express';
import { ProcurementService } from './procurement.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { z } from 'zod';

const createVendorSchema = z.object({
  code: z.string().min(1, 'Vendor code is required'),
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().optional(),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  paymentTerms: z.string().optional(),
});

const createPOSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product is required'),
      quantity: z.number().int().positive('Quantity must be positive'),
      unitPrice: z.number().positive('Unit price must be positive'),
    })
  ).min(1, 'At least one item is required'),
});

const createGRNSchema = z.object({
  purchaseOrderId: z.string().min(1),
  warehouseId: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      purchaseOrderItemId: z.string().min(1),
      quantityReceived: z.number().int().positive(),
    })
  ).min(1),
});

export class ProcurementController {
  static async createVendor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createVendorSchema.parse(req.body);
      const result = await ProcurementService.createVendor(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getVendors(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ProcurementService.getVendors(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createPurchaseOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createPOSchema.parse(req.body);
      const result = await ProcurementService.createPurchaseOrder(req.tenantId!, req.user!.userId, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getPurchaseOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ProcurementService.getPurchaseOrders(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async submitPurchaseOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ProcurementService.submitPurchaseOrder(req.tenantId!, id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async approvePurchaseOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ProcurementService.approvePurchaseOrder(req.tenantId!, id, req.user!.userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createGRN(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createGRNSchema.parse(req.body);
      const result = await ProcurementService.createGRN(req.tenantId!, req.user!.userId, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
