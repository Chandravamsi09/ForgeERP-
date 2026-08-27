import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { ConsolidationVoucherService } from './finance_advanced.service';
import { IntercompanyTradeService } from './finance_advanced.service';
import { FXForwardService } from './finance_advanced.service';
import { AssetDepreciationService } from './finance_advanced.service';
import { RevenueContractService } from './finance_advanced.service';
import { CostAllocationService } from './finance_advanced.service';
import { TrialBalanceService } from './finance_advanced.service';

export class FINANCE_ADVANCED_Controller {

  static async listConsolidationVoucher(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await ConsolidationVoucherService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getConsolidationVoucherById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ConsolidationVoucherService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createConsolidationVoucher(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ConsolidationVoucherService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateConsolidationVoucher(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ConsolidationVoucherService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteConsolidationVoucher(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ConsolidationVoucherService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getConsolidationVoucherMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ConsolidationVoucherService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listIntercompanyTrade(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await IntercompanyTradeService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getIntercompanyTradeById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await IntercompanyTradeService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createIntercompanyTrade(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await IntercompanyTradeService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateIntercompanyTrade(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await IntercompanyTradeService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteIntercompanyTrade(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await IntercompanyTradeService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getIntercompanyTradeMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await IntercompanyTradeService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listFXForward(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await FXForwardService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getFXForwardById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await FXForwardService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createFXForward(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await FXForwardService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateFXForward(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await FXForwardService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteFXForward(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await FXForwardService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getFXForwardMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await FXForwardService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listAssetDepreciation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await AssetDepreciationService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getAssetDepreciationById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await AssetDepreciationService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createAssetDepreciation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AssetDepreciationService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateAssetDepreciation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await AssetDepreciationService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAssetDepreciation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await AssetDepreciationService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getAssetDepreciationMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AssetDepreciationService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listRevenueContract(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await RevenueContractService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getRevenueContractById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RevenueContractService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createRevenueContract(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await RevenueContractService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateRevenueContract(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RevenueContractService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteRevenueContract(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RevenueContractService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getRevenueContractMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await RevenueContractService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listCostAllocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await CostAllocationService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getCostAllocationById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CostAllocationService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createCostAllocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await CostAllocationService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateCostAllocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CostAllocationService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteCostAllocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CostAllocationService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getCostAllocationMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await CostAllocationService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listTrialBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await TrialBalanceService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getTrialBalanceById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await TrialBalanceService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createTrialBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await TrialBalanceService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateTrialBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await TrialBalanceService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteTrialBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await TrialBalanceService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getTrialBalanceMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await TrialBalanceService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
