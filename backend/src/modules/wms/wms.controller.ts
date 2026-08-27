import { Response, NextFunction } from 'express';
import { WMSService } from './wms.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { z } from 'zod';

const createBinSchema = z.object({
  warehouseId: z.string().min(1),
  binCode: z.string().min(1),
  zone: z.string().min(1),
  maxWeightKg: z.number().positive().optional(),
});

const putawaySchema = z.object({
  binId: z.string().min(1),
  productId: z.string().min(1),
  batchNumber: z.string().optional(),
  quantity: z.number().positive(),
  unitCost: z.number().nonnegative(),
  movementType: z.enum(['GRN_RECEIPT', 'PRODUCTION_RECEIPT', 'PHYSICAL_ADJUSTMENT']),
  referenceId: z.string().optional(),
});

const linkGenealogySchema = z.object({
  parentBatchId: z.string().min(1),
  childBatchId: z.string().min(1),
  workOrderId: z.string().optional(),
  quantityUsed: z.number().positive(),
});

export class WMSController {
  static async createBin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createBinSchema.parse(req.body);
      const result = await WMSService.createBin(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async putawayStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = putawaySchema.parse(req.body);
      const result = await WMSService.putawayStock(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async linkGenealogy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = linkGenealogySchema.parse(req.body);
      const result = await WMSService.linkGenealogy(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async traceGenealogy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { batchNumber } = req.params;
      const result = await WMSService.traceGenealogy(req.tenantId!, batchNumber);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getInventoryLedger(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await WMSService.getInventoryLedger(req.tenantId!, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
