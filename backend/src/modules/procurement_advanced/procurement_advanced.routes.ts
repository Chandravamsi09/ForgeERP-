import { Router } from 'express';
import { PROCUREMENT_ADVANCED_Controller } from './procurement_advanced.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/vendorrating', PROCUREMENT_ADVANCED_Controller.listVendorRating);
router.get('/vendorrating/metrics', PROCUREMENT_ADVANCED_Controller.getVendorRatingMetrics);
router.get('/vendorrating/:id', PROCUREMENT_ADVANCED_Controller.getVendorRatingById);
router.post('/vendorrating', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.createVendorRating);
router.put('/vendorrating/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.updateVendorRating);
router.delete('/vendorrating/:id', requireRoles(UserRole.ADMIN), PROCUREMENT_ADVANCED_Controller.deleteVendorRating);

router.get('/purchaserequisition', PROCUREMENT_ADVANCED_Controller.listPurchaseRequisition);
router.get('/purchaserequisition/metrics', PROCUREMENT_ADVANCED_Controller.getPurchaseRequisitionMetrics);
router.get('/purchaserequisition/:id', PROCUREMENT_ADVANCED_Controller.getPurchaseRequisitionById);
router.post('/purchaserequisition', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.createPurchaseRequisition);
router.put('/purchaserequisition/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.updatePurchaseRequisition);
router.delete('/purchaserequisition/:id', requireRoles(UserRole.ADMIN), PROCUREMENT_ADVANCED_Controller.deletePurchaseRequisition);

router.get('/requestforquotation', PROCUREMENT_ADVANCED_Controller.listRequestForQuotation);
router.get('/requestforquotation/metrics', PROCUREMENT_ADVANCED_Controller.getRequestForQuotationMetrics);
router.get('/requestforquotation/:id', PROCUREMENT_ADVANCED_Controller.getRequestForQuotationById);
router.post('/requestforquotation', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.createRequestForQuotation);
router.put('/requestforquotation/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.updateRequestForQuotation);
router.delete('/requestforquotation/:id', requireRoles(UserRole.ADMIN), PROCUREMENT_ADVANCED_Controller.deleteRequestForQuotation);

router.get('/vendorbid', PROCUREMENT_ADVANCED_Controller.listVendorBid);
router.get('/vendorbid/metrics', PROCUREMENT_ADVANCED_Controller.getVendorBidMetrics);
router.get('/vendorbid/:id', PROCUREMENT_ADVANCED_Controller.getVendorBidById);
router.post('/vendorbid', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.createVendorBid);
router.put('/vendorbid/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.updateVendorBid);
router.delete('/vendorbid/:id', requireRoles(UserRole.ADMIN), PROCUREMENT_ADVANCED_Controller.deleteVendorBid);

router.get('/contractagreement', PROCUREMENT_ADVANCED_Controller.listContractAgreement);
router.get('/contractagreement/metrics', PROCUREMENT_ADVANCED_Controller.getContractAgreementMetrics);
router.get('/contractagreement/:id', PROCUREMENT_ADVANCED_Controller.getContractAgreementById);
router.post('/contractagreement', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.createContractAgreement);
router.put('/contractagreement/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.updateContractAgreement);
router.delete('/contractagreement/:id', requireRoles(UserRole.ADMIN), PROCUREMENT_ADVANCED_Controller.deleteContractAgreement);

router.get('/spendanalytics', PROCUREMENT_ADVANCED_Controller.listSpendAnalytics);
router.get('/spendanalytics/metrics', PROCUREMENT_ADVANCED_Controller.getSpendAnalyticsMetrics);
router.get('/spendanalytics/:id', PROCUREMENT_ADVANCED_Controller.getSpendAnalyticsById);
router.post('/spendanalytics', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.createSpendAnalytics);
router.put('/spendanalytics/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.updateSpendAnalytics);
router.delete('/spendanalytics/:id', requireRoles(UserRole.ADMIN), PROCUREMENT_ADVANCED_Controller.deleteSpendAnalytics);

router.get('/vendoraudit', PROCUREMENT_ADVANCED_Controller.listVendorAudit);
router.get('/vendoraudit/metrics', PROCUREMENT_ADVANCED_Controller.getVendorAuditMetrics);
router.get('/vendoraudit/:id', PROCUREMENT_ADVANCED_Controller.getVendorAuditById);
router.post('/vendoraudit', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.createVendorAudit);
router.put('/vendoraudit/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PROCUREMENT_ADVANCED_Controller.updateVendorAudit);
router.delete('/vendoraudit/:id', requireRoles(UserRole.ADMIN), PROCUREMENT_ADVANCED_Controller.deleteVendorAudit);
export default router;
