import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { SlottingRuleService } from './wms_advanced.service';
import { PickPathService } from './wms_advanced.service';
import { CycleCountService } from './wms_advanced.service';
import { BinTransferService } from './wms_advanced.service';
import { BatchGenealogyService } from './wms_advanced.service';
import { WavePickingService } from './wms_advanced.service';
import { CrossDockService } from './wms_advanced.service';

export class WMS_ADVANCED_Controller {

  static async listSlottingRule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await SlottingRuleService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getSlottingRuleById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SlottingRuleService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createSlottingRule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SlottingRuleService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateSlottingRule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SlottingRuleService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSlottingRule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SlottingRuleService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getSlottingRuleMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SlottingRuleService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listPickPath(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await PickPathService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getPickPathById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await PickPathService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createPickPath(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await PickPathService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updatePickPath(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await PickPathService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deletePickPath(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await PickPathService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getPickPathMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await PickPathService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listCycleCount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await CycleCountService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getCycleCountById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CycleCountService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createCycleCount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await CycleCountService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateCycleCount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CycleCountService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteCycleCount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CycleCountService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getCycleCountMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await CycleCountService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listBinTransfer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await BinTransferService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getBinTransferById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BinTransferService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createBinTransfer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await BinTransferService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateBinTransfer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BinTransferService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteBinTransfer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BinTransferService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getBinTransferMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await BinTransferService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listBatchGenealogy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await BatchGenealogyService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getBatchGenealogyById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BatchGenealogyService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createBatchGenealogy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await BatchGenealogyService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateBatchGenealogy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BatchGenealogyService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteBatchGenealogy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BatchGenealogyService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getBatchGenealogyMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await BatchGenealogyService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listWavePicking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await WavePickingService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getWavePickingById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WavePickingService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createWavePicking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await WavePickingService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateWavePicking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WavePickingService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteWavePicking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WavePickingService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getWavePickingMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await WavePickingService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listCrossDock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await CrossDockService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getCrossDockById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CrossDockService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createCrossDock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await CrossDockService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateCrossDock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CrossDockService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteCrossDock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CrossDockService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getCrossDockMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await CrossDockService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
