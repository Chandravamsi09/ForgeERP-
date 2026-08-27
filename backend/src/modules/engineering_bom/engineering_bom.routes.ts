import { Router } from 'express';
import { ENGINEERING_BOM_Controller } from './engineering_bom.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/engineeringchangeorder', ENGINEERING_BOM_Controller.listEngineeringChangeOrder);
router.get('/engineeringchangeorder/metrics', ENGINEERING_BOM_Controller.getEngineeringChangeOrderMetrics);
router.get('/engineeringchangeorder/:id', ENGINEERING_BOM_Controller.getEngineeringChangeOrderById);
router.post('/engineeringchangeorder', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.createEngineeringChangeOrder);
router.put('/engineeringchangeorder/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.updateEngineeringChangeOrder);
router.delete('/engineeringchangeorder/:id', requireRoles(UserRole.ADMIN), ENGINEERING_BOM_Controller.deleteEngineeringChangeOrder);

router.get('/bomrevision', ENGINEERING_BOM_Controller.listBOMRevision);
router.get('/bomrevision/metrics', ENGINEERING_BOM_Controller.getBOMRevisionMetrics);
router.get('/bomrevision/:id', ENGINEERING_BOM_Controller.getBOMRevisionById);
router.post('/bomrevision', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.createBOMRevision);
router.put('/bomrevision/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.updateBOMRevision);
router.delete('/bomrevision/:id', requireRoles(UserRole.ADMIN), ENGINEERING_BOM_Controller.deleteBOMRevision);

router.get('/componentsubstitute', ENGINEERING_BOM_Controller.listComponentSubstitute);
router.get('/componentsubstitute/metrics', ENGINEERING_BOM_Controller.getComponentSubstituteMetrics);
router.get('/componentsubstitute/:id', ENGINEERING_BOM_Controller.getComponentSubstituteById);
router.post('/componentsubstitute', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.createComponentSubstitute);
router.put('/componentsubstitute/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.updateComponentSubstitute);
router.delete('/componentsubstitute/:id', requireRoles(UserRole.ADMIN), ENGINEERING_BOM_Controller.deleteComponentSubstitute);

router.get('/toolingrequirement', ENGINEERING_BOM_Controller.listToolingRequirement);
router.get('/toolingrequirement/metrics', ENGINEERING_BOM_Controller.getToolingRequirementMetrics);
router.get('/toolingrequirement/:id', ENGINEERING_BOM_Controller.getToolingRequirementById);
router.post('/toolingrequirement', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.createToolingRequirement);
router.put('/toolingrequirement/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.updateToolingRequirement);
router.delete('/toolingrequirement/:id', requireRoles(UserRole.ADMIN), ENGINEERING_BOM_Controller.deleteToolingRequirement);

router.get('/designdrawing', ENGINEERING_BOM_Controller.listDesignDrawing);
router.get('/designdrawing/metrics', ENGINEERING_BOM_Controller.getDesignDrawingMetrics);
router.get('/designdrawing/:id', ENGINEERING_BOM_Controller.getDesignDrawingById);
router.post('/designdrawing', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.createDesignDrawing);
router.put('/designdrawing/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.updateDesignDrawing);
router.delete('/designdrawing/:id', requireRoles(UserRole.ADMIN), ENGINEERING_BOM_Controller.deleteDesignDrawing);

router.get('/whereusedreport', ENGINEERING_BOM_Controller.listWhereUsedReport);
router.get('/whereusedreport/metrics', ENGINEERING_BOM_Controller.getWhereUsedReportMetrics);
router.get('/whereusedreport/:id', ENGINEERING_BOM_Controller.getWhereUsedReportById);
router.post('/whereusedreport', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.createWhereUsedReport);
router.put('/whereusedreport/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.updateWhereUsedReport);
router.delete('/whereusedreport/:id', requireRoles(UserRole.ADMIN), ENGINEERING_BOM_Controller.deleteWhereUsedReport);

router.get('/cadintegration', ENGINEERING_BOM_Controller.listCadIntegration);
router.get('/cadintegration/metrics', ENGINEERING_BOM_Controller.getCadIntegrationMetrics);
router.get('/cadintegration/:id', ENGINEERING_BOM_Controller.getCadIntegrationById);
router.post('/cadintegration', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.createCadIntegration);
router.put('/cadintegration/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), ENGINEERING_BOM_Controller.updateCadIntegration);
router.delete('/cadintegration/:id', requireRoles(UserRole.ADMIN), ENGINEERING_BOM_Controller.deleteCadIntegration);
export default router;
