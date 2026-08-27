import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { RMATicketService } from './field_service.service';
import { WarrantyPolicyService } from './field_service.service';
import { RepairWorkOrderService } from './field_service.service';
import { ServiceEngineerService } from './field_service.service';
import { SparePartAllocationService } from './field_service.service';
import { ServiceContractService } from './field_service.service';
import { DispatchRouteService } from './field_service.service';

export class FIELD_SERVICE_Controller {

  static async listRMATicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await RMATicketService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getRMATicketById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RMATicketService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createRMATicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await RMATicketService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateRMATicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RMATicketService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteRMATicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RMATicketService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getRMATicketMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await RMATicketService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listWarrantyPolicy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await WarrantyPolicyService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getWarrantyPolicyById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WarrantyPolicyService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createWarrantyPolicy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await WarrantyPolicyService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateWarrantyPolicy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WarrantyPolicyService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteWarrantyPolicy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await WarrantyPolicyService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getWarrantyPolicyMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await WarrantyPolicyService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listRepairWorkOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await RepairWorkOrderService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getRepairWorkOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RepairWorkOrderService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createRepairWorkOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await RepairWorkOrderService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateRepairWorkOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RepairWorkOrderService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteRepairWorkOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RepairWorkOrderService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getRepairWorkOrderMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await RepairWorkOrderService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listServiceEngineer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await ServiceEngineerService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getServiceEngineerById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ServiceEngineerService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createServiceEngineer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ServiceEngineerService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateServiceEngineer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ServiceEngineerService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteServiceEngineer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ServiceEngineerService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getServiceEngineerMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ServiceEngineerService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listSparePartAllocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await SparePartAllocationService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getSparePartAllocationById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SparePartAllocationService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createSparePartAllocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SparePartAllocationService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateSparePartAllocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SparePartAllocationService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSparePartAllocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SparePartAllocationService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getSparePartAllocationMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SparePartAllocationService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listServiceContract(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await ServiceContractService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getServiceContractById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ServiceContractService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createServiceContract(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ServiceContractService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateServiceContract(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ServiceContractService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteServiceContract(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ServiceContractService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getServiceContractMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ServiceContractService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async listDispatchRoute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await DispatchRouteService.list({ tenantId: req.tenantId! }, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getDispatchRouteById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await DispatchRouteService.getById({ tenantId: req.tenantId! }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async createDispatchRoute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await DispatchRouteService.create({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateDispatchRoute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await DispatchRouteService.update({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async deleteDispatchRoute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await DispatchRouteService.delete({ tenantId: req.tenantId!, actorUserId: req.user?.userId }, id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getDispatchRouteMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await DispatchRouteService.calculateMetrics({ tenantId: req.tenantId! });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
