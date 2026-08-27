import { Response, NextFunction } from 'express';
import { QualityService } from './quality.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { z } from 'zod';

const createPlanSchema = z.object({
  productId: z.string().min(1),
  planNumber: z.string().min(1),
  stage: z.enum(['INWARD_GOODS_RECEIPT', 'IN_PROCESS_ROUTING', 'PRE_DISPATCH_FINISHED_GOODS', 'CALIBRATION_CHECK']),
  aqlLevel: z.string().optional(),
  samplePercentage: z.number().positive().optional(),
  specifications: z.array(
    z.object({
      parameterName: z.string().min(1),
      testMethod: z.string().min(1),
      targetValue: z.number().optional(),
      minTolerance: z.number().optional(),
      maxTolerance: z.number().optional(),
      isCritical: z.boolean().optional(),
    })
  ),
});

const recordInspectionSchema = z.object({
  planId: z.string().min(1),
  stage: z.enum(['INWARD_GOODS_RECEIPT', 'IN_PROCESS_ROUTING', 'PRE_DISPATCH_FINISHED_GOODS', 'CALIBRATION_CHECK']),
  referenceType: z.enum(['GRN', 'WORK_ORDER', 'PRE_DISPATCH']),
  referenceId: z.string().min(1),
  batchNumber: z.string().optional(),
  sampleSize: z.number().int().positive(),
  passedQuantity: z.number().int().nonnegative(),
  rejectedQuantity: z.number().int().nonnegative(),
  inspectorName: z.string().min(1),
  remarks: z.string().optional(),
  testResults: z.array(
    z.object({
      parameterName: z.string().min(1),
      measuredValue: z.number().optional(),
      isConforming: z.boolean(),
      notes: z.string().optional(),
    })
  ),
});

const createNCRSchema = z.object({
  qualityInspectionId: z.string().min(1),
  severity: z.enum(['MINOR', 'MAJOR', 'CRITICAL']),
  defectDescription: z.string().min(1),
  rootCause: z.string().optional(),
  correctiveAction: z.string().optional(),
  disposition: z.enum(['SCRAP', 'REWORK', 'RETURN_TO_VENDOR', 'USE_AS_IS', 'DOWNGRADE']),
});

export class QualityController {
  static async createInspectionPlan(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createPlanSchema.parse(req.body);
      const result = await QualityService.createInspectionPlan(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async recordInspection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = recordInspectionSchema.parse(req.body);
      const result = await QualityService.recordInspection(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async raiseNCR(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createNCRSchema.parse(req.body);
      const result = await QualityService.raiseNCR(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async generateCoA(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { inspectionId } = req.params;
      const { approvedBy } = req.body;
      const result = await QualityService.generateCoA(req.tenantId!, inspectionId, approvedBy || req.user?.email || 'Quality Manager');
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getInspections(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await QualityService.getInspections(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
