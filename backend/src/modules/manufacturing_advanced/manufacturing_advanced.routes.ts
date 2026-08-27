import { Router } from 'express';
import { MANUFACTURING_ADVANCED_Controller } from './manufacturing_advanced.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/finiteschedule', MANUFACTURING_ADVANCED_Controller.listFiniteSchedule);
router.get('/finiteschedule/metrics', MANUFACTURING_ADVANCED_Controller.getFiniteScheduleMetrics);
router.get('/finiteschedule/:id', MANUFACTURING_ADVANCED_Controller.getFiniteScheduleById);
router.post('/finiteschedule', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.createFiniteSchedule);
router.put('/finiteschedule/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.updateFiniteSchedule);
router.delete('/finiteschedule/:id', requireRoles(UserRole.ADMIN), MANUFACTURING_ADVANCED_Controller.deleteFiniteSchedule);

router.get('/routingstep', MANUFACTURING_ADVANCED_Controller.listRoutingStep);
router.get('/routingstep/metrics', MANUFACTURING_ADVANCED_Controller.getRoutingStepMetrics);
router.get('/routingstep/:id', MANUFACTURING_ADVANCED_Controller.getRoutingStepById);
router.post('/routingstep', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.createRoutingStep);
router.put('/routingstep/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.updateRoutingStep);
router.delete('/routingstep/:id', requireRoles(UserRole.ADMIN), MANUFACTURING_ADVANCED_Controller.deleteRoutingStep);

router.get('/scrapfactor', MANUFACTURING_ADVANCED_Controller.listScrapFactor);
router.get('/scrapfactor/metrics', MANUFACTURING_ADVANCED_Controller.getScrapFactorMetrics);
router.get('/scrapfactor/:id', MANUFACTURING_ADVANCED_Controller.getScrapFactorById);
router.post('/scrapfactor', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.createScrapFactor);
router.put('/scrapfactor/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.updateScrapFactor);
router.delete('/scrapfactor/:id', requireRoles(UserRole.ADMIN), MANUFACTURING_ADVANCED_Controller.deleteScrapFactor);

router.get('/capacitybucket', MANUFACTURING_ADVANCED_Controller.listCapacityBucket);
router.get('/capacitybucket/metrics', MANUFACTURING_ADVANCED_Controller.getCapacityBucketMetrics);
router.get('/capacitybucket/:id', MANUFACTURING_ADVANCED_Controller.getCapacityBucketById);
router.post('/capacitybucket', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.createCapacityBucket);
router.put('/capacitybucket/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.updateCapacityBucket);
router.delete('/capacitybucket/:id', requireRoles(UserRole.ADMIN), MANUFACTURING_ADVANCED_Controller.deleteCapacityBucket);

router.get('/machinelog', MANUFACTURING_ADVANCED_Controller.listMachineLog);
router.get('/machinelog/metrics', MANUFACTURING_ADVANCED_Controller.getMachineLogMetrics);
router.get('/machinelog/:id', MANUFACTURING_ADVANCED_Controller.getMachineLogById);
router.post('/machinelog', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.createMachineLog);
router.put('/machinelog/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.updateMachineLog);
router.delete('/machinelog/:id', requireRoles(UserRole.ADMIN), MANUFACTURING_ADVANCED_Controller.deleteMachineLog);

router.get('/workcenterqueue', MANUFACTURING_ADVANCED_Controller.listWorkCenterQueue);
router.get('/workcenterqueue/metrics', MANUFACTURING_ADVANCED_Controller.getWorkCenterQueueMetrics);
router.get('/workcenterqueue/:id', MANUFACTURING_ADVANCED_Controller.getWorkCenterQueueById);
router.post('/workcenterqueue', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.createWorkCenterQueue);
router.put('/workcenterqueue/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.updateWorkCenterQueue);
router.delete('/workcenterqueue/:id', requireRoles(UserRole.ADMIN), MANUFACTURING_ADVANCED_Controller.deleteWorkCenterQueue);

router.get('/toolingregistry', MANUFACTURING_ADVANCED_Controller.listToolingRegistry);
router.get('/toolingregistry/metrics', MANUFACTURING_ADVANCED_Controller.getToolingRegistryMetrics);
router.get('/toolingregistry/:id', MANUFACTURING_ADVANCED_Controller.getToolingRegistryById);
router.post('/toolingregistry', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.createToolingRegistry);
router.put('/toolingregistry/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), MANUFACTURING_ADVANCED_Controller.updateToolingRegistry);
router.delete('/toolingregistry/:id', requireRoles(UserRole.ADMIN), MANUFACTURING_ADVANCED_Controller.deleteToolingRegistry);
export default router;
