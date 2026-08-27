import { Router } from 'express';
import { FIXED_ASSETS_Controller } from './fixed_assets.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/assetregister', FIXED_ASSETS_Controller.listAssetRegister);
router.get('/assetregister/metrics', FIXED_ASSETS_Controller.getAssetRegisterMetrics);
router.get('/assetregister/:id', FIXED_ASSETS_Controller.getAssetRegisterById);
router.post('/assetregister', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.createAssetRegister);
router.put('/assetregister/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.updateAssetRegister);
router.delete('/assetregister/:id', requireRoles(UserRole.ADMIN), FIXED_ASSETS_Controller.deleteAssetRegister);

router.get('/depreciationbook', FIXED_ASSETS_Controller.listDepreciationBook);
router.get('/depreciationbook/metrics', FIXED_ASSETS_Controller.getDepreciationBookMetrics);
router.get('/depreciationbook/:id', FIXED_ASSETS_Controller.getDepreciationBookById);
router.post('/depreciationbook', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.createDepreciationBook);
router.put('/depreciationbook/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.updateDepreciationBook);
router.delete('/depreciationbook/:id', requireRoles(UserRole.ADMIN), FIXED_ASSETS_Controller.deleteDepreciationBook);

router.get('/maintenancecapitalization', FIXED_ASSETS_Controller.listMaintenanceCapitalization);
router.get('/maintenancecapitalization/metrics', FIXED_ASSETS_Controller.getMaintenanceCapitalizationMetrics);
router.get('/maintenancecapitalization/:id', FIXED_ASSETS_Controller.getMaintenanceCapitalizationById);
router.post('/maintenancecapitalization', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.createMaintenanceCapitalization);
router.put('/maintenancecapitalization/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.updateMaintenanceCapitalization);
router.delete('/maintenancecapitalization/:id', requireRoles(UserRole.ADMIN), FIXED_ASSETS_Controller.deleteMaintenanceCapitalization);

router.get('/disposalevent', FIXED_ASSETS_Controller.listDisposalEvent);
router.get('/disposalevent/metrics', FIXED_ASSETS_Controller.getDisposalEventMetrics);
router.get('/disposalevent/:id', FIXED_ASSETS_Controller.getDisposalEventById);
router.post('/disposalevent', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.createDisposalEvent);
router.put('/disposalevent/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.updateDisposalEvent);
router.delete('/disposalevent/:id', requireRoles(UserRole.ADMIN), FIXED_ASSETS_Controller.deleteDisposalEvent);

router.get('/assetrevaluation', FIXED_ASSETS_Controller.listAssetRevaluation);
router.get('/assetrevaluation/metrics', FIXED_ASSETS_Controller.getAssetRevaluationMetrics);
router.get('/assetrevaluation/:id', FIXED_ASSETS_Controller.getAssetRevaluationById);
router.post('/assetrevaluation', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.createAssetRevaluation);
router.put('/assetrevaluation/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.updateAssetRevaluation);
router.delete('/assetrevaluation/:id', requireRoles(UserRole.ADMIN), FIXED_ASSETS_Controller.deleteAssetRevaluation);

router.get('/impairmenttest', FIXED_ASSETS_Controller.listImpairmentTest);
router.get('/impairmenttest/metrics', FIXED_ASSETS_Controller.getImpairmentTestMetrics);
router.get('/impairmenttest/:id', FIXED_ASSETS_Controller.getImpairmentTestById);
router.post('/impairmenttest', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.createImpairmentTest);
router.put('/impairmenttest/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.updateImpairmentTest);
router.delete('/impairmenttest/:id', requireRoles(UserRole.ADMIN), FIXED_ASSETS_Controller.deleteImpairmentTest);

router.get('/physicalinventorytag', FIXED_ASSETS_Controller.listPhysicalInventoryTag);
router.get('/physicalinventorytag/metrics', FIXED_ASSETS_Controller.getPhysicalInventoryTagMetrics);
router.get('/physicalinventorytag/:id', FIXED_ASSETS_Controller.getPhysicalInventoryTagById);
router.post('/physicalinventorytag', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.createPhysicalInventoryTag);
router.put('/physicalinventorytag/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), FIXED_ASSETS_Controller.updatePhysicalInventoryTag);
router.delete('/physicalinventorytag/:id', requireRoles(UserRole.ADMIN), FIXED_ASSETS_Controller.deletePhysicalInventoryTag);
export default router;
