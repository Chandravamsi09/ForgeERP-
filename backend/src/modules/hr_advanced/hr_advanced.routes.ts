import { Router } from 'express';
import { HR_ADVANCED_Controller } from './hr_advanced.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/shiftroster', HR_ADVANCED_Controller.listShiftRoster);
router.get('/shiftroster/metrics', HR_ADVANCED_Controller.getShiftRosterMetrics);
router.get('/shiftroster/:id', HR_ADVANCED_Controller.getShiftRosterById);
router.post('/shiftroster', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.createShiftRoster);
router.put('/shiftroster/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.updateShiftRoster);
router.delete('/shiftroster/:id', requireRoles(UserRole.ADMIN), HR_ADVANCED_Controller.deleteShiftRoster);

router.get('/skillmatrix', HR_ADVANCED_Controller.listSkillMatrix);
router.get('/skillmatrix/metrics', HR_ADVANCED_Controller.getSkillMatrixMetrics);
router.get('/skillmatrix/:id', HR_ADVANCED_Controller.getSkillMatrixById);
router.post('/skillmatrix', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.createSkillMatrix);
router.put('/skillmatrix/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.updateSkillMatrix);
router.delete('/skillmatrix/:id', requireRoles(UserRole.ADMIN), HR_ADVANCED_Controller.deleteSkillMatrix);

router.get('/overtimepolicy', HR_ADVANCED_Controller.listOvertimePolicy);
router.get('/overtimepolicy/metrics', HR_ADVANCED_Controller.getOvertimePolicyMetrics);
router.get('/overtimepolicy/:id', HR_ADVANCED_Controller.getOvertimePolicyById);
router.post('/overtimepolicy', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.createOvertimePolicy);
router.put('/overtimepolicy/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.updateOvertimePolicy);
router.delete('/overtimepolicy/:id', requireRoles(UserRole.ADMIN), HR_ADVANCED_Controller.deleteOvertimePolicy);

router.get('/statutorytaxslab', HR_ADVANCED_Controller.listStatutoryTaxSlab);
router.get('/statutorytaxslab/metrics', HR_ADVANCED_Controller.getStatutoryTaxSlabMetrics);
router.get('/statutorytaxslab/:id', HR_ADVANCED_Controller.getStatutoryTaxSlabById);
router.post('/statutorytaxslab', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.createStatutoryTaxSlab);
router.put('/statutorytaxslab/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.updateStatutoryTaxSlab);
router.delete('/statutorytaxslab/:id', requireRoles(UserRole.ADMIN), HR_ADVANCED_Controller.deleteStatutoryTaxSlab);

router.get('/benefitdeduction', HR_ADVANCED_Controller.listBenefitDeduction);
router.get('/benefitdeduction/metrics', HR_ADVANCED_Controller.getBenefitDeductionMetrics);
router.get('/benefitdeduction/:id', HR_ADVANCED_Controller.getBenefitDeductionById);
router.post('/benefitdeduction', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.createBenefitDeduction);
router.put('/benefitdeduction/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.updateBenefitDeduction);
router.delete('/benefitdeduction/:id', requireRoles(UserRole.ADMIN), HR_ADVANCED_Controller.deleteBenefitDeduction);

router.get('/performancereview', HR_ADVANCED_Controller.listPerformanceReview);
router.get('/performancereview/metrics', HR_ADVANCED_Controller.getPerformanceReviewMetrics);
router.get('/performancereview/:id', HR_ADVANCED_Controller.getPerformanceReviewById);
router.post('/performancereview', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.createPerformanceReview);
router.put('/performancereview/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.updatePerformanceReview);
router.delete('/performancereview/:id', requireRoles(UserRole.ADMIN), HR_ADVANCED_Controller.deletePerformanceReview);

router.get('/trainingrecord', HR_ADVANCED_Controller.listTrainingRecord);
router.get('/trainingrecord/metrics', HR_ADVANCED_Controller.getTrainingRecordMetrics);
router.get('/trainingrecord/:id', HR_ADVANCED_Controller.getTrainingRecordById);
router.post('/trainingrecord', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.createTrainingRecord);
router.put('/trainingrecord/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), HR_ADVANCED_Controller.updateTrainingRecord);
router.delete('/trainingrecord/:id', requireRoles(UserRole.ADMIN), HR_ADVANCED_Controller.deleteTrainingRecord);
export default router;
