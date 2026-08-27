import { Router } from 'express';
import { WMS_ADVANCED_Controller } from './wms_advanced.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/slottingrule', WMS_ADVANCED_Controller.listSlottingRule);
router.get('/slottingrule/metrics', WMS_ADVANCED_Controller.getSlottingRuleMetrics);
router.get('/slottingrule/:id', WMS_ADVANCED_Controller.getSlottingRuleById);
router.post('/slottingrule', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.createSlottingRule);
router.put('/slottingrule/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.updateSlottingRule);
router.delete('/slottingrule/:id', requireRoles(UserRole.ADMIN), WMS_ADVANCED_Controller.deleteSlottingRule);

router.get('/pickpath', WMS_ADVANCED_Controller.listPickPath);
router.get('/pickpath/metrics', WMS_ADVANCED_Controller.getPickPathMetrics);
router.get('/pickpath/:id', WMS_ADVANCED_Controller.getPickPathById);
router.post('/pickpath', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.createPickPath);
router.put('/pickpath/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.updatePickPath);
router.delete('/pickpath/:id', requireRoles(UserRole.ADMIN), WMS_ADVANCED_Controller.deletePickPath);

router.get('/cyclecount', WMS_ADVANCED_Controller.listCycleCount);
router.get('/cyclecount/metrics', WMS_ADVANCED_Controller.getCycleCountMetrics);
router.get('/cyclecount/:id', WMS_ADVANCED_Controller.getCycleCountById);
router.post('/cyclecount', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.createCycleCount);
router.put('/cyclecount/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.updateCycleCount);
router.delete('/cyclecount/:id', requireRoles(UserRole.ADMIN), WMS_ADVANCED_Controller.deleteCycleCount);

router.get('/bintransfer', WMS_ADVANCED_Controller.listBinTransfer);
router.get('/bintransfer/metrics', WMS_ADVANCED_Controller.getBinTransferMetrics);
router.get('/bintransfer/:id', WMS_ADVANCED_Controller.getBinTransferById);
router.post('/bintransfer', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.createBinTransfer);
router.put('/bintransfer/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.updateBinTransfer);
router.delete('/bintransfer/:id', requireRoles(UserRole.ADMIN), WMS_ADVANCED_Controller.deleteBinTransfer);

router.get('/batchgenealogy', WMS_ADVANCED_Controller.listBatchGenealogy);
router.get('/batchgenealogy/metrics', WMS_ADVANCED_Controller.getBatchGenealogyMetrics);
router.get('/batchgenealogy/:id', WMS_ADVANCED_Controller.getBatchGenealogyById);
router.post('/batchgenealogy', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.createBatchGenealogy);
router.put('/batchgenealogy/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.updateBatchGenealogy);
router.delete('/batchgenealogy/:id', requireRoles(UserRole.ADMIN), WMS_ADVANCED_Controller.deleteBatchGenealogy);

router.get('/wavepicking', WMS_ADVANCED_Controller.listWavePicking);
router.get('/wavepicking/metrics', WMS_ADVANCED_Controller.getWavePickingMetrics);
router.get('/wavepicking/:id', WMS_ADVANCED_Controller.getWavePickingById);
router.post('/wavepicking', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.createWavePicking);
router.put('/wavepicking/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.updateWavePicking);
router.delete('/wavepicking/:id', requireRoles(UserRole.ADMIN), WMS_ADVANCED_Controller.deleteWavePicking);

router.get('/crossdock', WMS_ADVANCED_Controller.listCrossDock);
router.get('/crossdock/metrics', WMS_ADVANCED_Controller.getCrossDockMetrics);
router.get('/crossdock/:id', WMS_ADVANCED_Controller.getCrossDockById);
router.post('/crossdock', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.createCrossDock);
router.put('/crossdock/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), WMS_ADVANCED_Controller.updateCrossDock);
router.delete('/crossdock/:id', requireRoles(UserRole.ADMIN), WMS_ADVANCED_Controller.deleteCrossDock);
export default router;
