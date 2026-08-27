import { Router } from 'express';
import { FIELD_SERVICE_Controller } from './field_service.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/rmaticket', FIELD_SERVICE_Controller.listRMATicket);
router.get('/rmaticket/metrics', FIELD_SERVICE_Controller.getRMATicketMetrics);
router.get('/rmaticket/:id', FIELD_SERVICE_Controller.getRMATicketById);
router.post('/rmaticket', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.createRMATicket);
router.put('/rmaticket/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.updateRMATicket);
router.delete('/rmaticket/:id', requireRoles(UserRole.ADMIN), FIELD_SERVICE_Controller.deleteRMATicket);

router.get('/warrantypolicy', FIELD_SERVICE_Controller.listWarrantyPolicy);
router.get('/warrantypolicy/metrics', FIELD_SERVICE_Controller.getWarrantyPolicyMetrics);
router.get('/warrantypolicy/:id', FIELD_SERVICE_Controller.getWarrantyPolicyById);
router.post('/warrantypolicy', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.createWarrantyPolicy);
router.put('/warrantypolicy/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.updateWarrantyPolicy);
router.delete('/warrantypolicy/:id', requireRoles(UserRole.ADMIN), FIELD_SERVICE_Controller.deleteWarrantyPolicy);

router.get('/repairworkorder', FIELD_SERVICE_Controller.listRepairWorkOrder);
router.get('/repairworkorder/metrics', FIELD_SERVICE_Controller.getRepairWorkOrderMetrics);
router.get('/repairworkorder/:id', FIELD_SERVICE_Controller.getRepairWorkOrderById);
router.post('/repairworkorder', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.createRepairWorkOrder);
router.put('/repairworkorder/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.updateRepairWorkOrder);
router.delete('/repairworkorder/:id', requireRoles(UserRole.ADMIN), FIELD_SERVICE_Controller.deleteRepairWorkOrder);

router.get('/serviceengineer', FIELD_SERVICE_Controller.listServiceEngineer);
router.get('/serviceengineer/metrics', FIELD_SERVICE_Controller.getServiceEngineerMetrics);
router.get('/serviceengineer/:id', FIELD_SERVICE_Controller.getServiceEngineerById);
router.post('/serviceengineer', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.createServiceEngineer);
router.put('/serviceengineer/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.updateServiceEngineer);
router.delete('/serviceengineer/:id', requireRoles(UserRole.ADMIN), FIELD_SERVICE_Controller.deleteServiceEngineer);

router.get('/sparepartallocation', FIELD_SERVICE_Controller.listSparePartAllocation);
router.get('/sparepartallocation/metrics', FIELD_SERVICE_Controller.getSparePartAllocationMetrics);
router.get('/sparepartallocation/:id', FIELD_SERVICE_Controller.getSparePartAllocationById);
router.post('/sparepartallocation', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.createSparePartAllocation);
router.put('/sparepartallocation/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.updateSparePartAllocation);
router.delete('/sparepartallocation/:id', requireRoles(UserRole.ADMIN), FIELD_SERVICE_Controller.deleteSparePartAllocation);

router.get('/servicecontract', FIELD_SERVICE_Controller.listServiceContract);
router.get('/servicecontract/metrics', FIELD_SERVICE_Controller.getServiceContractMetrics);
router.get('/servicecontract/:id', FIELD_SERVICE_Controller.getServiceContractById);
router.post('/servicecontract', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.createServiceContract);
router.put('/servicecontract/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.updateServiceContract);
router.delete('/servicecontract/:id', requireRoles(UserRole.ADMIN), FIELD_SERVICE_Controller.deleteServiceContract);

router.get('/dispatchroute', FIELD_SERVICE_Controller.listDispatchRoute);
router.get('/dispatchroute/metrics', FIELD_SERVICE_Controller.getDispatchRouteMetrics);
router.get('/dispatchroute/:id', FIELD_SERVICE_Controller.getDispatchRouteById);
router.post('/dispatchroute', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.createDispatchRoute);
router.put('/dispatchroute/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIELD_SERVICE_Controller.updateDispatchRoute);
router.delete('/dispatchroute/:id', requireRoles(UserRole.ADMIN), FIELD_SERVICE_Controller.deleteDispatchRoute);
export default router;
