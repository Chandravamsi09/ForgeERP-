import { Router } from 'express';
import { CMMS_Controller } from './cmms.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/equipmentasset', CMMS_Controller.listEquipmentAsset);
router.get('/equipmentasset/metrics', CMMS_Controller.getEquipmentAssetMetrics);
router.get('/equipmentasset/:id', CMMS_Controller.getEquipmentAssetById);
router.post('/equipmentasset', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.createEquipmentAsset);
router.put('/equipmentasset/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.updateEquipmentAsset);
router.delete('/equipmentasset/:id', requireRoles(UserRole.ADMIN), CMMS_Controller.deleteEquipmentAsset);

router.get('/preventiveplan', CMMS_Controller.listPreventivePlan);
router.get('/preventiveplan/metrics', CMMS_Controller.getPreventivePlanMetrics);
router.get('/preventiveplan/:id', CMMS_Controller.getPreventivePlanById);
router.post('/preventiveplan', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.createPreventivePlan);
router.put('/preventiveplan/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.updatePreventivePlan);
router.delete('/preventiveplan/:id', requireRoles(UserRole.ADMIN), CMMS_Controller.deletePreventivePlan);

router.get('/breakdownlog', CMMS_Controller.listBreakdownLog);
router.get('/breakdownlog/metrics', CMMS_Controller.getBreakdownLogMetrics);
router.get('/breakdownlog/:id', CMMS_Controller.getBreakdownLogById);
router.post('/breakdownlog', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.createBreakdownLog);
router.put('/breakdownlog/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.updateBreakdownLog);
router.delete('/breakdownlog/:id', requireRoles(UserRole.ADMIN), CMMS_Controller.deleteBreakdownLog);

router.get('/workpermit', CMMS_Controller.listWorkPermit);
router.get('/workpermit/metrics', CMMS_Controller.getWorkPermitMetrics);
router.get('/workpermit/:id', CMMS_Controller.getWorkPermitById);
router.post('/workpermit', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.createWorkPermit);
router.put('/workpermit/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.updateWorkPermit);
router.delete('/workpermit/:id', requireRoles(UserRole.ADMIN), CMMS_Controller.deleteWorkPermit);

router.get('/sparereservation', CMMS_Controller.listSpareReservation);
router.get('/sparereservation/metrics', CMMS_Controller.getSpareReservationMetrics);
router.get('/sparereservation/:id', CMMS_Controller.getSpareReservationById);
router.post('/sparereservation', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.createSpareReservation);
router.put('/sparereservation/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.updateSpareReservation);
router.delete('/sparereservation/:id', requireRoles(UserRole.ADMIN), CMMS_Controller.deleteSpareReservation);

router.get('/lubricationschedule', CMMS_Controller.listLubricationSchedule);
router.get('/lubricationschedule/metrics', CMMS_Controller.getLubricationScheduleMetrics);
router.get('/lubricationschedule/:id', CMMS_Controller.getLubricationScheduleById);
router.post('/lubricationschedule', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.createLubricationSchedule);
router.put('/lubricationschedule/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.updateLubricationSchedule);
router.delete('/lubricationschedule/:id', requireRoles(UserRole.ADMIN), CMMS_Controller.deleteLubricationSchedule);

router.get('/vibrationanalysis', CMMS_Controller.listVibrationAnalysis);
router.get('/vibrationanalysis/metrics', CMMS_Controller.getVibrationAnalysisMetrics);
router.get('/vibrationanalysis/:id', CMMS_Controller.getVibrationAnalysisById);
router.post('/vibrationanalysis', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.createVibrationAnalysis);
router.put('/vibrationanalysis/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), CMMS_Controller.updateVibrationAnalysis);
router.delete('/vibrationanalysis/:id', requireRoles(UserRole.ADMIN), CMMS_Controller.deleteVibrationAnalysis);
export default router;
