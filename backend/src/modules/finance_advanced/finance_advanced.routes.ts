import { Router } from 'express';
import { FINANCE_ADVANCED_Controller } from './finance_advanced.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/consolidationvoucher', FINANCE_ADVANCED_Controller.listConsolidationVoucher);
router.get('/consolidationvoucher/metrics', FINANCE_ADVANCED_Controller.getConsolidationVoucherMetrics);
router.get('/consolidationvoucher/:id', FINANCE_ADVANCED_Controller.getConsolidationVoucherById);
router.post('/consolidationvoucher', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.createConsolidationVoucher);
router.put('/consolidationvoucher/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.updateConsolidationVoucher);
router.delete('/consolidationvoucher/:id', requireRoles(UserRole.ADMIN), FINANCE_ADVANCED_Controller.deleteConsolidationVoucher);

router.get('/intercompanytrade', FINANCE_ADVANCED_Controller.listIntercompanyTrade);
router.get('/intercompanytrade/metrics', FINANCE_ADVANCED_Controller.getIntercompanyTradeMetrics);
router.get('/intercompanytrade/:id', FINANCE_ADVANCED_Controller.getIntercompanyTradeById);
router.post('/intercompanytrade', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.createIntercompanyTrade);
router.put('/intercompanytrade/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.updateIntercompanyTrade);
router.delete('/intercompanytrade/:id', requireRoles(UserRole.ADMIN), FINANCE_ADVANCED_Controller.deleteIntercompanyTrade);

router.get('/fxforward', FINANCE_ADVANCED_Controller.listFXForward);
router.get('/fxforward/metrics', FINANCE_ADVANCED_Controller.getFXForwardMetrics);
router.get('/fxforward/:id', FINANCE_ADVANCED_Controller.getFXForwardById);
router.post('/fxforward', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.createFXForward);
router.put('/fxforward/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.updateFXForward);
router.delete('/fxforward/:id', requireRoles(UserRole.ADMIN), FINANCE_ADVANCED_Controller.deleteFXForward);

router.get('/assetdepreciation', FINANCE_ADVANCED_Controller.listAssetDepreciation);
router.get('/assetdepreciation/metrics', FINANCE_ADVANCED_Controller.getAssetDepreciationMetrics);
router.get('/assetdepreciation/:id', FINANCE_ADVANCED_Controller.getAssetDepreciationById);
router.post('/assetdepreciation', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.createAssetDepreciation);
router.put('/assetdepreciation/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.updateAssetDepreciation);
router.delete('/assetdepreciation/:id', requireRoles(UserRole.ADMIN), FINANCE_ADVANCED_Controller.deleteAssetDepreciation);

router.get('/revenuecontract', FINANCE_ADVANCED_Controller.listRevenueContract);
router.get('/revenuecontract/metrics', FINANCE_ADVANCED_Controller.getRevenueContractMetrics);
router.get('/revenuecontract/:id', FINANCE_ADVANCED_Controller.getRevenueContractById);
router.post('/revenuecontract', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.createRevenueContract);
router.put('/revenuecontract/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.updateRevenueContract);
router.delete('/revenuecontract/:id', requireRoles(UserRole.ADMIN), FINANCE_ADVANCED_Controller.deleteRevenueContract);

router.get('/costallocation', FINANCE_ADVANCED_Controller.listCostAllocation);
router.get('/costallocation/metrics', FINANCE_ADVANCED_Controller.getCostAllocationMetrics);
router.get('/costallocation/:id', FINANCE_ADVANCED_Controller.getCostAllocationById);
router.post('/costallocation', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.createCostAllocation);
router.put('/costallocation/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.updateCostAllocation);
router.delete('/costallocation/:id', requireRoles(UserRole.ADMIN), FINANCE_ADVANCED_Controller.deleteCostAllocation);

router.get('/trialbalance', FINANCE_ADVANCED_Controller.listTrialBalance);
router.get('/trialbalance/metrics', FINANCE_ADVANCED_Controller.getTrialBalanceMetrics);
router.get('/trialbalance/:id', FINANCE_ADVANCED_Controller.getTrialBalanceById);
router.post('/trialbalance', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.createTrialBalance);
router.put('/trialbalance/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FINANCE_ADVANCED_Controller.updateTrialBalance);
router.delete('/trialbalance/:id', requireRoles(UserRole.ADMIN), FINANCE_ADVANCED_Controller.deleteTrialBalance);
export default router;
