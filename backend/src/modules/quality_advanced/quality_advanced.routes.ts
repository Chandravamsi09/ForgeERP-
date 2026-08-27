import { Router } from 'express';
import { QUALITY_ADVANCED_Controller } from './quality_advanced.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/capaaction', QUALITY_ADVANCED_Controller.listCAPAAction);
router.get('/capaaction/metrics', QUALITY_ADVANCED_Controller.getCAPAActionMetrics);
router.get('/capaaction/:id', QUALITY_ADVANCED_Controller.getCAPAActionById);
router.post('/capaaction', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.createCAPAAction);
router.put('/capaaction/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.updateCAPAAction);
router.delete('/capaaction/:id', requireRoles(UserRole.ADMIN), QUALITY_ADVANCED_Controller.deleteCAPAAction);

router.get('/inspectionmatrix', QUALITY_ADVANCED_Controller.listInspectionMatrix);
router.get('/inspectionmatrix/metrics', QUALITY_ADVANCED_Controller.getInspectionMatrixMetrics);
router.get('/inspectionmatrix/:id', QUALITY_ADVANCED_Controller.getInspectionMatrixById);
router.post('/inspectionmatrix', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.createInspectionMatrix);
router.put('/inspectionmatrix/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.updateInspectionMatrix);
router.delete('/inspectionmatrix/:id', requireRoles(UserRole.ADMIN), QUALITY_ADVANCED_Controller.deleteInspectionMatrix);

router.get('/defecttaxonomy', QUALITY_ADVANCED_Controller.listDefectTaxonomy);
router.get('/defecttaxonomy/metrics', QUALITY_ADVANCED_Controller.getDefectTaxonomyMetrics);
router.get('/defecttaxonomy/:id', QUALITY_ADVANCED_Controller.getDefectTaxonomyById);
router.post('/defecttaxonomy', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.createDefectTaxonomy);
router.put('/defecttaxonomy/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.updateDefectTaxonomy);
router.delete('/defecttaxonomy/:id', requireRoles(UserRole.ADMIN), QUALITY_ADVANCED_Controller.deleteDefectTaxonomy);

router.get('/samplingplan', QUALITY_ADVANCED_Controller.listSamplingPlan);
router.get('/samplingplan/metrics', QUALITY_ADVANCED_Controller.getSamplingPlanMetrics);
router.get('/samplingplan/:id', QUALITY_ADVANCED_Controller.getSamplingPlanById);
router.post('/samplingplan', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.createSamplingPlan);
router.put('/samplingplan/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.updateSamplingPlan);
router.delete('/samplingplan/:id', requireRoles(UserRole.ADMIN), QUALITY_ADVANCED_Controller.deleteSamplingPlan);

router.get('/calibrationrecord', QUALITY_ADVANCED_Controller.listCalibrationRecord);
router.get('/calibrationrecord/metrics', QUALITY_ADVANCED_Controller.getCalibrationRecordMetrics);
router.get('/calibrationrecord/:id', QUALITY_ADVANCED_Controller.getCalibrationRecordById);
router.post('/calibrationrecord', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.createCalibrationRecord);
router.put('/calibrationrecord/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.updateCalibrationRecord);
router.delete('/calibrationrecord/:id', requireRoles(UserRole.ADMIN), QUALITY_ADVANCED_Controller.deleteCalibrationRecord);

router.get('/auditfinding', QUALITY_ADVANCED_Controller.listAuditFinding);
router.get('/auditfinding/metrics', QUALITY_ADVANCED_Controller.getAuditFindingMetrics);
router.get('/auditfinding/:id', QUALITY_ADVANCED_Controller.getAuditFindingById);
router.post('/auditfinding', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.createAuditFinding);
router.put('/auditfinding/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.updateAuditFinding);
router.delete('/auditfinding/:id', requireRoles(UserRole.ADMIN), QUALITY_ADVANCED_Controller.deleteAuditFinding);

router.get('/qualitycost', QUALITY_ADVANCED_Controller.listQualityCost);
router.get('/qualitycost/metrics', QUALITY_ADVANCED_Controller.getQualityCostMetrics);
router.get('/qualitycost/:id', QUALITY_ADVANCED_Controller.getQualityCostById);
router.post('/qualitycost', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.createQualityCost);
router.put('/qualitycost/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), QUALITY_ADVANCED_Controller.updateQualityCost);
router.delete('/qualitycost/:id', requireRoles(UserRole.ADMIN), QUALITY_ADVANCED_Controller.deleteQualityCost);
export default router;
