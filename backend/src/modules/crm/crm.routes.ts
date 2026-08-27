import { Router } from 'express';
import { CRM_Controller } from './crm.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/lead', CRM_Controller.listLead);
router.get('/lead/metrics', CRM_Controller.getLeadMetrics);
router.get('/lead/:id', CRM_Controller.getLeadById);
router.post('/lead', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.createLead);
router.put('/lead/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.updateLead);
router.delete('/lead/:id', requireRoles(UserRole.ADMIN), CRM_Controller.deleteLead);

router.get('/opportunity', CRM_Controller.listOpportunity);
router.get('/opportunity/metrics', CRM_Controller.getOpportunityMetrics);
router.get('/opportunity/:id', CRM_Controller.getOpportunityById);
router.post('/opportunity', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.createOpportunity);
router.put('/opportunity/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.updateOpportunity);
router.delete('/opportunity/:id', requireRoles(UserRole.ADMIN), CRM_Controller.deleteOpportunity);

router.get('/customeraccount', CRM_Controller.listCustomerAccount);
router.get('/customeraccount/metrics', CRM_Controller.getCustomerAccountMetrics);
router.get('/customeraccount/:id', CRM_Controller.getCustomerAccountById);
router.post('/customeraccount', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.createCustomerAccount);
router.put('/customeraccount/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.updateCustomerAccount);
router.delete('/customeraccount/:id', requireRoles(UserRole.ADMIN), CRM_Controller.deleteCustomerAccount);

router.get('/salesterritory', CRM_Controller.listSalesTerritory);
router.get('/salesterritory/metrics', CRM_Controller.getSalesTerritoryMetrics);
router.get('/salesterritory/:id', CRM_Controller.getSalesTerritoryById);
router.post('/salesterritory', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.createSalesTerritory);
router.put('/salesterritory/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.updateSalesTerritory);
router.delete('/salesterritory/:id', requireRoles(UserRole.ADMIN), CRM_Controller.deleteSalesTerritory);

router.get('/salesquota', CRM_Controller.listSalesQuota);
router.get('/salesquota/metrics', CRM_Controller.getSalesQuotaMetrics);
router.get('/salesquota/:id', CRM_Controller.getSalesQuotaById);
router.post('/salesquota', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.createSalesQuota);
router.put('/salesquota/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.updateSalesQuota);
router.delete('/salesquota/:id', requireRoles(UserRole.ADMIN), CRM_Controller.deleteSalesQuota);

router.get('/customercontact', CRM_Controller.listCustomerContact);
router.get('/customercontact/metrics', CRM_Controller.getCustomerContactMetrics);
router.get('/customercontact/:id', CRM_Controller.getCustomerContactById);
router.post('/customercontact', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.createCustomerContact);
router.put('/customercontact/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.updateCustomerContact);
router.delete('/customercontact/:id', requireRoles(UserRole.ADMIN), CRM_Controller.deleteCustomerContact);

router.get('/activitylog', CRM_Controller.listActivityLog);
router.get('/activitylog/metrics', CRM_Controller.getActivityLogMetrics);
router.get('/activitylog/:id', CRM_Controller.getActivityLogById);
router.post('/activitylog', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.createActivityLog);
router.put('/activitylog/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CRM_Controller.updateActivityLog);
router.delete('/activitylog/:id', requireRoles(UserRole.ADMIN), CRM_Controller.deleteActivityLog);
export default router;
