import { Router } from 'express';
import { DOCUMENTS_PORTAL_Controller } from './documents_portal.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/documenttemplate', DOCUMENTS_PORTAL_Controller.listDocumentTemplate);
router.get('/documenttemplate/metrics', DOCUMENTS_PORTAL_Controller.getDocumentTemplateMetrics);
router.get('/documenttemplate/:id', DOCUMENTS_PORTAL_Controller.getDocumentTemplateById);
router.post('/documenttemplate', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.createDocumentTemplate);
router.put('/documenttemplate/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.updateDocumentTemplate);
router.delete('/documenttemplate/:id', requireRoles(UserRole.ADMIN), DOCUMENTS_PORTAL_Controller.deleteDocumentTemplate);

router.get('/generatedpdf', DOCUMENTS_PORTAL_Controller.listGeneratedPDF);
router.get('/generatedpdf/metrics', DOCUMENTS_PORTAL_Controller.getGeneratedPDFMetrics);
router.get('/generatedpdf/:id', DOCUMENTS_PORTAL_Controller.getGeneratedPDFById);
router.post('/generatedpdf', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.createGeneratedPDF);
router.put('/generatedpdf/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.updateGeneratedPDF);
router.delete('/generatedpdf/:id', requireRoles(UserRole.ADMIN), DOCUMENTS_PORTAL_Controller.deleteGeneratedPDF);

router.get('/signaturerecord', DOCUMENTS_PORTAL_Controller.listSignatureRecord);
router.get('/signaturerecord/metrics', DOCUMENTS_PORTAL_Controller.getSignatureRecordMetrics);
router.get('/signaturerecord/:id', DOCUMENTS_PORTAL_Controller.getSignatureRecordById);
router.post('/signaturerecord', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.createSignatureRecord);
router.put('/signaturerecord/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.updateSignatureRecord);
router.delete('/signaturerecord/:id', requireRoles(UserRole.ADMIN), DOCUMENTS_PORTAL_Controller.deleteSignatureRecord);

router.get('/versionhistory', DOCUMENTS_PORTAL_Controller.listVersionHistory);
router.get('/versionhistory/metrics', DOCUMENTS_PORTAL_Controller.getVersionHistoryMetrics);
router.get('/versionhistory/:id', DOCUMENTS_PORTAL_Controller.getVersionHistoryById);
router.post('/versionhistory', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.createVersionHistory);
router.put('/versionhistory/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.updateVersionHistory);
router.delete('/versionhistory/:id', requireRoles(UserRole.ADMIN), DOCUMENTS_PORTAL_Controller.deleteVersionHistory);

router.get('/distributionlog', DOCUMENTS_PORTAL_Controller.listDistributionLog);
router.get('/distributionlog/metrics', DOCUMENTS_PORTAL_Controller.getDistributionLogMetrics);
router.get('/distributionlog/:id', DOCUMENTS_PORTAL_Controller.getDistributionLogById);
router.post('/distributionlog', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.createDistributionLog);
router.put('/distributionlog/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.updateDistributionLog);
router.delete('/distributionlog/:id', requireRoles(UserRole.ADMIN), DOCUMENTS_PORTAL_Controller.deleteDistributionLog);

router.get('/retentionpolicy', DOCUMENTS_PORTAL_Controller.listRetentionPolicy);
router.get('/retentionpolicy/metrics', DOCUMENTS_PORTAL_Controller.getRetentionPolicyMetrics);
router.get('/retentionpolicy/:id', DOCUMENTS_PORTAL_Controller.getRetentionPolicyById);
router.post('/retentionpolicy', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.createRetentionPolicy);
router.put('/retentionpolicy/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.updateRetentionPolicy);
router.delete('/retentionpolicy/:id', requireRoles(UserRole.ADMIN), DOCUMENTS_PORTAL_Controller.deleteRetentionPolicy);

router.get('/watermarkconfig', DOCUMENTS_PORTAL_Controller.listWatermarkConfig);
router.get('/watermarkconfig/metrics', DOCUMENTS_PORTAL_Controller.getWatermarkConfigMetrics);
router.get('/watermarkconfig/:id', DOCUMENTS_PORTAL_Controller.getWatermarkConfigById);
router.post('/watermarkconfig', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.createWatermarkConfig);
router.put('/watermarkconfig/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), DOCUMENTS_PORTAL_Controller.updateWatermarkConfig);
router.delete('/watermarkconfig/:id', requireRoles(UserRole.ADMIN), DOCUMENTS_PORTAL_Controller.deleteWatermarkConfig);
export default router;
