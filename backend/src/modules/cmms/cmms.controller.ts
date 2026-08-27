import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { EquipmentAssetService } from './cmms.service';
import { PreventivePlanService } from './cmms.service';
import { BreakdownLogService } from './cmms.service';
import { WorkPermitService } from './cmms.service';
import { SpareReservationService } from './cmms.service';
import { LubricationScheduleService } from './cmms.service';
import { VibrationAnalysisService } from './cmms.service';

export class CMMS_Controller {

  static async listEquipmentAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await EquipmentAssetService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getEquipmentAssetById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await EquipmentAssetService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createEquipmentAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await EquipmentAssetService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateEquipmentAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await EquipmentAssetService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteEquipmentAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await EquipmentAssetService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getEquipmentAssetMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await EquipmentAssetService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listPreventivePlan(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await PreventivePlanService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getPreventivePlanById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await PreventivePlanService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createPreventivePlan(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await PreventivePlanService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updatePreventivePlan(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await PreventivePlanService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deletePreventivePlan(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await PreventivePlanService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getPreventivePlanMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await PreventivePlanService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listBreakdownLog(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await BreakdownLogService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getBreakdownLogById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BreakdownLogService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createBreakdownLog(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await BreakdownLogService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateBreakdownLog(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BreakdownLogService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteBreakdownLog(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BreakdownLogService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getBreakdownLogMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await BreakdownLogService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listWorkPermit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await WorkPermitService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getWorkPermitById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WorkPermitService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createWorkPermit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await WorkPermitService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateWorkPermit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WorkPermitService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteWorkPermit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WorkPermitService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getWorkPermitMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await WorkPermitService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listSpareReservation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await SpareReservationService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getSpareReservationById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SpareReservationService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createSpareReservation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SpareReservationService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateSpareReservation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SpareReservationService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSpareReservation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SpareReservationService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getSpareReservationMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SpareReservationService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listLubricationSchedule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await LubricationScheduleService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getLubricationScheduleById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await LubricationScheduleService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createLubricationSchedule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await LubricationScheduleService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateLubricationSchedule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await LubricationScheduleService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteLubricationSchedule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await LubricationScheduleService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getLubricationScheduleMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await LubricationScheduleService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listVibrationAnalysis(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await VibrationAnalysisService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getVibrationAnalysisById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VibrationAnalysisService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createVibrationAnalysis(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await VibrationAnalysisService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateVibrationAnalysis(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VibrationAnalysisService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteVibrationAnalysis(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VibrationAnalysisService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getVibrationAnalysisMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await VibrationAnalysisService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
