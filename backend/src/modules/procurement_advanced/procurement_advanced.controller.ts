import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { VendorRatingService } from './procurement_advanced.service';
import { PurchaseRequisitionService } from './procurement_advanced.service';
import { RequestForQuotationService } from './procurement_advanced.service';
import { VendorBidService } from './procurement_advanced.service';
import { ContractAgreementService } from './procurement_advanced.service';
import { SpendAnalyticsService } from './procurement_advanced.service';
import { VendorAuditService } from './procurement_advanced.service';

export class PROCUREMENT_ADVANCED_Controller {

  static async listVendorRating(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await VendorRatingService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getVendorRatingById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VendorRatingService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createVendorRating(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await VendorRatingService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateVendorRating(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VendorRatingService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteVendorRating(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VendorRatingService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getVendorRatingMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await VendorRatingService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listPurchaseRequisition(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await PurchaseRequisitionService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getPurchaseRequisitionById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await PurchaseRequisitionService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createPurchaseRequisition(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await PurchaseRequisitionService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updatePurchaseRequisition(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await PurchaseRequisitionService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deletePurchaseRequisition(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await PurchaseRequisitionService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getPurchaseRequisitionMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await PurchaseRequisitionService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listRequestForQuotation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await RequestForQuotationService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getRequestForQuotationById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RequestForQuotationService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createRequestForQuotation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await RequestForQuotationService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateRequestForQuotation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RequestForQuotationService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteRequestForQuotation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RequestForQuotationService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getRequestForQuotationMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await RequestForQuotationService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listVendorBid(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await VendorBidService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getVendorBidById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VendorBidService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createVendorBid(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await VendorBidService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateVendorBid(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VendorBidService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteVendorBid(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VendorBidService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getVendorBidMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await VendorBidService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listContractAgreement(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await ContractAgreementService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getContractAgreementById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ContractAgreementService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createContractAgreement(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ContractAgreementService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateContractAgreement(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ContractAgreementService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteContractAgreement(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ContractAgreementService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getContractAgreementMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ContractAgreementService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listSpendAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await SpendAnalyticsService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getSpendAnalyticsById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SpendAnalyticsService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createSpendAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SpendAnalyticsService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateSpendAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SpendAnalyticsService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSpendAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SpendAnalyticsService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getSpendAnalyticsMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SpendAnalyticsService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listVendorAudit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await VendorAuditService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getVendorAuditById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VendorAuditService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createVendorAudit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await VendorAuditService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateVendorAudit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VendorAuditService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteVendorAudit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await VendorAuditService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getVendorAuditMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await VendorAuditService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
