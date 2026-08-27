import { Response, NextFunction } from 'express';
import { ConsolidationService } from './consolidation.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { z } from 'zod';

const runConsolidationSchema = z.object({
  periodYear: z.number().int().min(2000).max(2100),
  periodMonth: z.number().int().min(1).max(12),
  reportingCurrency: z.string().default('USD'),
  transactions: z.array(
    z.object({
      transactionId: z.string().min(1),
      sourceSubsidiaryId: z.string().min(1),
      targetSubsidiaryId: z.string().min(1),
      transactionType: z.enum(['TRADE_SALE_PURCHASE', 'INTERCOMPANY_LOAN', 'MANAGEMENT_FEE']),
      sourceAmountForeign: z.number().positive(),
      sourceCurrency: z.string().min(1),
      sourceExchangeRateToParent: z.number().positive(),
      targetAmountForeign: z.number().positive(),
      targetCurrency: z.string().min(1),
      targetExchangeRateToParent: z.number().positive(),
      markupPercentage: z.number().nonnegative().optional(),
      unsoldInventoryPercentage: z.number().nonnegative().optional(),
    })
  ),
});

export class ConsolidationController {
  static async runConsolidation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = runConsolidationSchema.parse(req.body);
      const result = await ConsolidationService.runConsolidation(req.tenantId!, dto);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getConsolidatedTrialBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ConsolidationService.getConsolidatedTrialBalance(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
