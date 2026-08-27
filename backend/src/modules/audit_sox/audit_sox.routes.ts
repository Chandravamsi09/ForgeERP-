import { Router } from 'express';
import { AUDIT_SOX_Controller } from './audit_sox.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/compliancecheck', AUDIT_SOX_Controller.listComplianceCheck);
router.get('/compliancecheck/metrics', AUDIT_SOX_Controller.getComplianceCheckMetrics);
router.get('/compliancecheck/:id', AUDIT_SOX_Controller.getComplianceCheckById);
router.post('/compliancecheck', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.createComplianceCheck);
router.put('/compliancecheck/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.updateComplianceCheck);
router.delete('/compliancecheck/:id', requireRoles(UserRole.ADMIN), AUDIT_SOX_Controller.deleteComplianceCheck);

router.get('/auditsnapshot', AUDIT_SOX_Controller.listAuditSnapshot);
router.get('/auditsnapshot/metrics', AUDIT_SOX_Controller.getAuditSnapshotMetrics);
router.get('/auditsnapshot/:id', AUDIT_SOX_Controller.getAuditSnapshotById);
router.post('/auditsnapshot', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.createAuditSnapshot);
router.put('/auditsnapshot/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.updateAuditSnapshot);
router.delete('/auditsnapshot/:id', requireRoles(UserRole.ADMIN), AUDIT_SOX_Controller.deleteAuditSnapshot);

router.get('/accessreview', AUDIT_SOX_Controller.listAccessReview);
router.get('/accessreview/metrics', AUDIT_SOX_Controller.getAccessReviewMetrics);
router.get('/accessreview/:id', AUDIT_SOX_Controller.getAccessReviewById);
router.post('/accessreview', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.createAccessReview);
router.put('/accessreview/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.updateAccessReview);
router.delete('/accessreview/:id', requireRoles(UserRole.ADMIN), AUDIT_SOX_Controller.deleteAccessReview);

router.get('/segregationofduties', AUDIT_SOX_Controller.listSegregationOfDuties);
router.get('/segregationofduties/metrics', AUDIT_SOX_Controller.getSegregationOfDutiesMetrics);
router.get('/segregationofduties/:id', AUDIT_SOX_Controller.getSegregationOfDutiesById);
router.post('/segregationofduties', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.createSegregationOfDuties);
router.put('/segregationofduties/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.updateSegregationOfDuties);
router.delete('/segregationofduties/:id', requireRoles(UserRole.ADMIN), AUDIT_SOX_Controller.deleteSegregationOfDuties);

router.get('/securitylog', AUDIT_SOX_Controller.listSecurityLog);
router.get('/securitylog/metrics', AUDIT_SOX_Controller.getSecurityLogMetrics);
router.get('/securitylog/:id', AUDIT_SOX_Controller.getSecurityLogById);
router.post('/securitylog', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.createSecurityLog);
router.put('/securitylog/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.updateSecurityLog);
router.delete('/securitylog/:id', requireRoles(UserRole.ADMIN), AUDIT_SOX_Controller.deleteSecurityLog);

router.get('/policyexception', AUDIT_SOX_Controller.listPolicyException);
router.get('/policyexception/metrics', AUDIT_SOX_Controller.getPolicyExceptionMetrics);
router.get('/policyexception/:id', AUDIT_SOX_Controller.getPolicyExceptionById);
router.post('/policyexception', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.createPolicyException);
router.put('/policyexception/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.updatePolicyException);
router.delete('/policyexception/:id', requireRoles(UserRole.ADMIN), AUDIT_SOX_Controller.deletePolicyException);

router.get('/controlassessment', AUDIT_SOX_Controller.listControlAssessment);
router.get('/controlassessment/metrics', AUDIT_SOX_Controller.getControlAssessmentMetrics);
router.get('/controlassessment/:id', AUDIT_SOX_Controller.getControlAssessmentById);
router.post('/controlassessment', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.createControlAssessment);
router.put('/controlassessment/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), AUDIT_SOX_Controller.updateControlAssessment);
router.delete('/controlassessment/:id', requireRoles(UserRole.ADMIN), AUDIT_SOX_Controller.deleteControlAssessment);
export default router;
