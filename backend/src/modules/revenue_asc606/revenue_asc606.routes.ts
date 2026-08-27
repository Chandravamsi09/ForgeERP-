import { Router } from 'express';
import { REVENUE_ASC606_Controller } from './revenue_asc606.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/performanceobligation', REVENUE_ASC606_Controller.listPerformanceObligation);
router.get('/performanceobligation/metrics', REVENUE_ASC606_Controller.getPerformanceObligationMetrics);
router.get('/performanceobligation/:id', REVENUE_ASC606_Controller.getPerformanceObligationById);
router.post('/performanceobligation', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.createPerformanceObligation);
router.put('/performanceobligation/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.updatePerformanceObligation);
router.delete('/performanceobligation/:id', requireRoles(UserRole.ADMIN), REVENUE_ASC606_Controller.deletePerformanceObligation);

router.get('/transactionpriceallocation', REVENUE_ASC606_Controller.listTransactionPriceAllocation);
router.get('/transactionpriceallocation/metrics', REVENUE_ASC606_Controller.getTransactionPriceAllocationMetrics);
router.get('/transactionpriceallocation/:id', REVENUE_ASC606_Controller.getTransactionPriceAllocationById);
router.post('/transactionpriceallocation', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.createTransactionPriceAllocation);
router.put('/transactionpriceallocation/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.updateTransactionPriceAllocation);
router.delete('/transactionpriceallocation/:id', requireRoles(UserRole.ADMIN), REVENUE_ASC606_Controller.deleteTransactionPriceAllocation);

router.get('/deferredschedule', REVENUE_ASC606_Controller.listDeferredSchedule);
router.get('/deferredschedule/metrics', REVENUE_ASC606_Controller.getDeferredScheduleMetrics);
router.get('/deferredschedule/:id', REVENUE_ASC606_Controller.getDeferredScheduleById);
router.post('/deferredschedule', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.createDeferredSchedule);
router.put('/deferredschedule/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.updateDeferredSchedule);
router.delete('/deferredschedule/:id', requireRoles(UserRole.ADMIN), REVENUE_ASC606_Controller.deleteDeferredSchedule);

router.get('/amortizationpost', REVENUE_ASC606_Controller.listAmortizationPost);
router.get('/amortizationpost/metrics', REVENUE_ASC606_Controller.getAmortizationPostMetrics);
router.get('/amortizationpost/:id', REVENUE_ASC606_Controller.getAmortizationPostById);
router.post('/amortizationpost', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.createAmortizationPost);
router.put('/amortizationpost/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.updateAmortizationPost);
router.delete('/amortizationpost/:id', requireRoles(UserRole.ADMIN), REVENUE_ASC606_Controller.deleteAmortizationPost);

router.get('/revenuereconciliation', REVENUE_ASC606_Controller.listRevenueReconciliation);
router.get('/revenuereconciliation/metrics', REVENUE_ASC606_Controller.getRevenueReconciliationMetrics);
router.get('/revenuereconciliation/:id', REVENUE_ASC606_Controller.getRevenueReconciliationById);
router.post('/revenuereconciliation', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.createRevenueReconciliation);
router.put('/revenuereconciliation/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.updateRevenueReconciliation);
router.delete('/revenuereconciliation/:id', requireRoles(UserRole.ADMIN), REVENUE_ASC606_Controller.deleteRevenueReconciliation);

router.get('/contractmodification', REVENUE_ASC606_Controller.listContractModification);
router.get('/contractmodification/metrics', REVENUE_ASC606_Controller.getContractModificationMetrics);
router.get('/contractmodification/:id', REVENUE_ASC606_Controller.getContractModificationById);
router.post('/contractmodification', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.createContractModification);
router.put('/contractmodification/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.updateContractModification);
router.delete('/contractmodification/:id', requireRoles(UserRole.ADMIN), REVENUE_ASC606_Controller.deleteContractModification);

router.get('/variableconsideration', REVENUE_ASC606_Controller.listVariableConsideration);
router.get('/variableconsideration/metrics', REVENUE_ASC606_Controller.getVariableConsiderationMetrics);
router.get('/variableconsideration/:id', REVENUE_ASC606_Controller.getVariableConsiderationById);
router.post('/variableconsideration', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.createVariableConsideration);
router.put('/variableconsideration/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), REVENUE_ASC606_Controller.updateVariableConsideration);
router.delete('/variableconsideration/:id', requireRoles(UserRole.ADMIN), REVENUE_ASC606_Controller.deleteVariableConsideration);
export default router;
