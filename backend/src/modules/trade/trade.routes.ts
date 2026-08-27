import { Router } from 'express';
import { TRADE_Controller } from './trade.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/hstariffrule', TRADE_Controller.listHSTariffRule);
router.get('/hstariffrule/metrics', TRADE_Controller.getHSTariffRuleMetrics);
router.get('/hstariffrule/:id', TRADE_Controller.getHSTariffRuleById);
router.post('/hstariffrule', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.createHSTariffRule);
router.put('/hstariffrule/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.updateHSTariffRule);
router.delete('/hstariffrule/:id', requireRoles(UserRole.ADMIN), TRADE_Controller.deleteHSTariffRule);

router.get('/customsdeclaration', TRADE_Controller.listCustomsDeclaration);
router.get('/customsdeclaration/metrics', TRADE_Controller.getCustomsDeclarationMetrics);
router.get('/customsdeclaration/:id', TRADE_Controller.getCustomsDeclarationById);
router.post('/customsdeclaration', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.createCustomsDeclaration);
router.put('/customsdeclaration/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.updateCustomsDeclaration);
router.delete('/customsdeclaration/:id', requireRoles(UserRole.ADMIN), TRADE_Controller.deleteCustomsDeclaration);

router.get('/dutycalculation', TRADE_Controller.listDutyCalculation);
router.get('/dutycalculation/metrics', TRADE_Controller.getDutyCalculationMetrics);
router.get('/dutycalculation/:id', TRADE_Controller.getDutyCalculationById);
router.post('/dutycalculation', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.createDutyCalculation);
router.put('/dutycalculation/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.updateDutyCalculation);
router.delete('/dutycalculation/:id', requireRoles(UserRole.ADMIN), TRADE_Controller.deleteDutyCalculation);

router.get('/exportcontrol', TRADE_Controller.listExportControl);
router.get('/exportcontrol/metrics', TRADE_Controller.getExportControlMetrics);
router.get('/exportcontrol/:id', TRADE_Controller.getExportControlById);
router.post('/exportcontrol', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.createExportControl);
router.put('/exportcontrol/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.updateExportControl);
router.delete('/exportcontrol/:id', requireRoles(UserRole.ADMIN), TRADE_Controller.deleteExportControl);

router.get('/certificateoforigin', TRADE_Controller.listCertificateOfOrigin);
router.get('/certificateoforigin/metrics', TRADE_Controller.getCertificateOfOriginMetrics);
router.get('/certificateoforigin/:id', TRADE_Controller.getCertificateOfOriginById);
router.post('/certificateoforigin', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.createCertificateOfOrigin);
router.put('/certificateoforigin/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.updateCertificateOfOrigin);
router.delete('/certificateoforigin/:id', requireRoles(UserRole.ADMIN), TRADE_Controller.deleteCertificateOfOrigin);

router.get('/sanctionscreening', TRADE_Controller.listSanctionScreening);
router.get('/sanctionscreening/metrics', TRADE_Controller.getSanctionScreeningMetrics);
router.get('/sanctionscreening/:id', TRADE_Controller.getSanctionScreeningById);
router.post('/sanctionscreening', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.createSanctionScreening);
router.put('/sanctionscreening/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.updateSanctionScreening);
router.delete('/sanctionscreening/:id', requireRoles(UserRole.ADMIN), TRADE_Controller.deleteSanctionScreening);

router.get('/landedcostsummary', TRADE_Controller.listLandedCostSummary);
router.get('/landedcostsummary/metrics', TRADE_Controller.getLandedCostSummaryMetrics);
router.get('/landedcostsummary/:id', TRADE_Controller.getLandedCostSummaryById);
router.post('/landedcostsummary', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.createLandedCostSummary);
router.put('/landedcostsummary/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), TRADE_Controller.updateLandedCostSummary);
router.delete('/landedcostsummary/:id', requireRoles(UserRole.ADMIN), TRADE_Controller.deleteLandedCostSummary);
export default router;
