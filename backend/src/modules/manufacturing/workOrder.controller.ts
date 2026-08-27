import { Response, NextFunction } from 'express';
import { WorkOrderService } from './workOrder.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { z } from 'zod';

const createWorkOrderSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  bomId: z.string().min(1, 'BOM is required'),
  routingId: z.string().min(1, 'Routing is required'),
  warehouseId: z.string().min(1, 'Warehouse is required'),
  targetQuantity: z.number().positive('Target quantity must be positive'),
  plannedStartDate: z.string().transform((val) => new Date(val)),
  plannedEndDate: z.string().transform((val) => new Date(val)),
});

const issueMaterialSchema = z.object({
  componentProductId: z.string().min(1, 'Component product required'),
  quantityIssued: z.number().positive('Quantity must be positive'),
  batchNumber: z.string().optional(),
});

const logProgressSchema = z.object({
  sequenceNumber: z.number().int().positive(),
  completedQuantity: z.number().nonnegative(),
  scrappedQuantity: z.number().nonnegative().optional(),
  setupActualMinutes: z.number().nonnegative().optional(),
  runActualMinutes: z.number().nonnegative().optional(),
  operatorName: z.string().min(1),
});

const logDowntimeSchema = z.object({
  workCenterId: z.string().min(1),
  reasonCode: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().transform((val) => new Date(val)),
  endTime: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  durationMinutes: z.number().nonnegative(),
});

export class WorkOrderController {
  static async createWorkOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createWorkOrderSchema.parse(req.body);
      const result = await WorkOrderService.createWorkOrder(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async releaseWorkOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WorkOrderService.releaseWorkOrder(req.tenantId!, id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async issueMaterial(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dto = issueMaterialSchema.parse(req.body);
      const result = await WorkOrderService.issueMaterial(req.tenantId!, id, dto);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async logOperationProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dto = logProgressSchema.parse(req.body);
      const result = await WorkOrderService.logOperationProgress(req.tenantId!, id, dto);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async logMachineDowntime(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = logDowntimeSchema.parse(req.body);
      const result = await WorkOrderService.logMachineDowntime(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getWorkOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const result = await WorkOrderService.getWorkOrders(req.tenantId!, status as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
