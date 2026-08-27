import { Router } from 'express';
import { ANALYTICS_Controller } from './analytics.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/executivekpi', ANALYTICS_Controller.listExecutiveKPI);
router.get('/executivekpi/metrics', ANALYTICS_Controller.getExecutiveKPIMetrics);
router.get('/executivekpi/:id', ANALYTICS_Controller.getExecutiveKPIById);
router.post('/executivekpi', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.createExecutiveKPI);
router.put('/executivekpi/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.updateExecutiveKPI);
router.delete('/executivekpi/:id', requireRoles(UserRole.ADMIN), ANALYTICS_Controller.deleteExecutiveKPI);

router.get('/oeetrend', ANALYTICS_Controller.listOEETrend);
router.get('/oeetrend/metrics', ANALYTICS_Controller.getOEETrendMetrics);
router.get('/oeetrend/:id', ANALYTICS_Controller.getOEETrendById);
router.post('/oeetrend', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.createOEETrend);
router.put('/oeetrend/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.updateOEETrend);
router.delete('/oeetrend/:id', requireRoles(UserRole.ADMIN), ANALYTICS_Controller.deleteOEETrend);

router.get('/cashflowforecast', ANALYTICS_Controller.listCashFlowForecast);
router.get('/cashflowforecast/metrics', ANALYTICS_Controller.getCashFlowForecastMetrics);
router.get('/cashflowforecast/:id', ANALYTICS_Controller.getCashFlowForecastById);
router.post('/cashflowforecast', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.createCashFlowForecast);
router.put('/cashflowforecast/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.updateCashFlowForecast);
router.delete('/cashflowforecast/:id', requireRoles(UserRole.ADMIN), ANALYTICS_Controller.deleteCashFlowForecast);

router.get('/inventoryaging', ANALYTICS_Controller.listInventoryAging);
router.get('/inventoryaging/metrics', ANALYTICS_Controller.getInventoryAgingMetrics);
router.get('/inventoryaging/:id', ANALYTICS_Controller.getInventoryAgingById);
router.post('/inventoryaging', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.createInventoryAging);
router.put('/inventoryaging/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.updateInventoryAging);
router.delete('/inventoryaging/:id', requireRoles(UserRole.ADMIN), ANALYTICS_Controller.deleteInventoryAging);

router.get('/marginbreakdown', ANALYTICS_Controller.listMarginBreakdown);
router.get('/marginbreakdown/metrics', ANALYTICS_Controller.getMarginBreakdownMetrics);
router.get('/marginbreakdown/:id', ANALYTICS_Controller.getMarginBreakdownById);
router.post('/marginbreakdown', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.createMarginBreakdown);
router.put('/marginbreakdown/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.updateMarginBreakdown);
router.delete('/marginbreakdown/:id', requireRoles(UserRole.ADMIN), ANALYTICS_Controller.deleteMarginBreakdown);

router.get('/supplierscorecard', ANALYTICS_Controller.listSupplierScorecard);
router.get('/supplierscorecard/metrics', ANALYTICS_Controller.getSupplierScorecardMetrics);
router.get('/supplierscorecard/:id', ANALYTICS_Controller.getSupplierScorecardById);
router.post('/supplierscorecard', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.createSupplierScorecard);
router.put('/supplierscorecard/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.updateSupplierScorecard);
router.delete('/supplierscorecard/:id', requireRoles(UserRole.ADMIN), ANALYTICS_Controller.deleteSupplierScorecard);

router.get('/productionthroughput', ANALYTICS_Controller.listProductionThroughput);
router.get('/productionthroughput/metrics', ANALYTICS_Controller.getProductionThroughputMetrics);
router.get('/productionthroughput/:id', ANALYTICS_Controller.getProductionThroughputById);
router.post('/productionthroughput', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.createProductionThroughput);
router.put('/productionthroughput/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ANALYTICS_Controller.updateProductionThroughput);
router.delete('/productionthroughput/:id', requireRoles(UserRole.ADMIN), ANALYTICS_Controller.deleteProductionThroughput);
export default router;
