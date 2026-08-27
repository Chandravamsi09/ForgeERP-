import { Router } from 'express';
import { INVENTORY_VALUATION_Controller } from './inventory_valuation.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/fifolayer', INVENTORY_VALUATION_Controller.listFIFOLayer);
router.get('/fifolayer/metrics', INVENTORY_VALUATION_Controller.getFIFOLayerMetrics);
router.get('/fifolayer/:id', INVENTORY_VALUATION_Controller.getFIFOLayerById);
router.post('/fifolayer', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.createFIFOLayer);
router.put('/fifolayer/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.updateFIFOLayer);
router.delete('/fifolayer/:id', requireRoles(UserRole.ADMIN), INVENTORY_VALUATION_Controller.deleteFIFOLayer);

router.get('/movingaveragerecord', INVENTORY_VALUATION_Controller.listMovingAverageRecord);
router.get('/movingaveragerecord/metrics', INVENTORY_VALUATION_Controller.getMovingAverageRecordMetrics);
router.get('/movingaveragerecord/:id', INVENTORY_VALUATION_Controller.getMovingAverageRecordById);
router.post('/movingaveragerecord', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.createMovingAverageRecord);
router.put('/movingaveragerecord/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.updateMovingAverageRecord);
router.delete('/movingaveragerecord/:id', requireRoles(UserRole.ADMIN), INVENTORY_VALUATION_Controller.deleteMovingAverageRecord);

router.get('/standardcostvariance', INVENTORY_VALUATION_Controller.listStandardCostVariance);
router.get('/standardcostvariance/metrics', INVENTORY_VALUATION_Controller.getStandardCostVarianceMetrics);
router.get('/standardcostvariance/:id', INVENTORY_VALUATION_Controller.getStandardCostVarianceById);
router.post('/standardcostvariance', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.createStandardCostVariance);
router.put('/standardcostvariance/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.updateStandardCostVariance);
router.delete('/standardcostvariance/:id', requireRoles(UserRole.ADMIN), INVENTORY_VALUATION_Controller.deleteStandardCostVariance);

router.get('/inventorywritedown', INVENTORY_VALUATION_Controller.listInventoryWriteDown);
router.get('/inventorywritedown/metrics', INVENTORY_VALUATION_Controller.getInventoryWriteDownMetrics);
router.get('/inventorywritedown/:id', INVENTORY_VALUATION_Controller.getInventoryWriteDownById);
router.post('/inventorywritedown', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.createInventoryWriteDown);
router.put('/inventorywritedown/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.updateInventoryWriteDown);
router.delete('/inventorywritedown/:id', requireRoles(UserRole.ADMIN), INVENTORY_VALUATION_Controller.deleteInventoryWriteDown);

router.get('/revaluationhistory', INVENTORY_VALUATION_Controller.listRevaluationHistory);
router.get('/revaluationhistory/metrics', INVENTORY_VALUATION_Controller.getRevaluationHistoryMetrics);
router.get('/revaluationhistory/:id', INVENTORY_VALUATION_Controller.getRevaluationHistoryById);
router.post('/revaluationhistory', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.createRevaluationHistory);
router.put('/revaluationhistory/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.updateRevaluationHistory);
router.delete('/revaluationhistory/:id', requireRoles(UserRole.ADMIN), INVENTORY_VALUATION_Controller.deleteRevaluationHistory);

router.get('/lotagedistribution', INVENTORY_VALUATION_Controller.listLotAgeDistribution);
router.get('/lotagedistribution/metrics', INVENTORY_VALUATION_Controller.getLotAgeDistributionMetrics);
router.get('/lotagedistribution/:id', INVENTORY_VALUATION_Controller.getLotAgeDistributionById);
router.post('/lotagedistribution', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.createLotAgeDistribution);
router.put('/lotagedistribution/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.updateLotAgeDistribution);
router.delete('/lotagedistribution/:id', requireRoles(UserRole.ADMIN), INVENTORY_VALUATION_Controller.deleteLotAgeDistribution);

router.get('/scrapreserve', INVENTORY_VALUATION_Controller.listScrapReserve);
router.get('/scrapreserve/metrics', INVENTORY_VALUATION_Controller.getScrapReserveMetrics);
router.get('/scrapreserve/:id', INVENTORY_VALUATION_Controller.getScrapReserveById);
router.post('/scrapreserve', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.createScrapReserve);
router.put('/scrapreserve/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INVENTORY_VALUATION_Controller.updateScrapReserve);
router.delete('/scrapreserve/:id', requireRoles(UserRole.ADMIN), INVENTORY_VALUATION_Controller.deleteScrapReserve);
export default router;
