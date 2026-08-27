import { Router } from 'express';
import { INTERCOMPANY_Controller } from './intercompany.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/subsidiaryentity', INTERCOMPANY_Controller.listSubsidiaryEntity);
router.get('/subsidiaryentity/metrics', INTERCOMPANY_Controller.getSubsidiaryEntityMetrics);
router.get('/subsidiaryentity/:id', INTERCOMPANY_Controller.getSubsidiaryEntityById);
router.post('/subsidiaryentity', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.createSubsidiaryEntity);
router.put('/subsidiaryentity/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.updateSubsidiaryEntity);
router.delete('/subsidiaryentity/:id', requireRoles(UserRole.ADMIN), INTERCOMPANY_Controller.deleteSubsidiaryEntity);

router.get('/intercompanyagreement', INTERCOMPANY_Controller.listIntercompanyAgreement);
router.get('/intercompanyagreement/metrics', INTERCOMPANY_Controller.getIntercompanyAgreementMetrics);
router.get('/intercompanyagreement/:id', INTERCOMPANY_Controller.getIntercompanyAgreementById);
router.post('/intercompanyagreement', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.createIntercompanyAgreement);
router.put('/intercompanyagreement/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.updateIntercompanyAgreement);
router.delete('/intercompanyagreement/:id', requireRoles(UserRole.ADMIN), INTERCOMPANY_Controller.deleteIntercompanyAgreement);

router.get('/transferpricepolicy', INTERCOMPANY_Controller.listTransferPricePolicy);
router.get('/transferpricepolicy/metrics', INTERCOMPANY_Controller.getTransferPricePolicyMetrics);
router.get('/transferpricepolicy/:id', INTERCOMPANY_Controller.getTransferPricePolicyById);
router.post('/transferpricepolicy', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.createTransferPricePolicy);
router.put('/transferpricepolicy/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.updateTransferPricePolicy);
router.delete('/transferpricepolicy/:id', requireRoles(UserRole.ADMIN), INTERCOMPANY_Controller.deleteTransferPricePolicy);

router.get('/eliminationledger', INTERCOMPANY_Controller.listEliminationLedger);
router.get('/eliminationledger/metrics', INTERCOMPANY_Controller.getEliminationLedgerMetrics);
router.get('/eliminationledger/:id', INTERCOMPANY_Controller.getEliminationLedgerById);
router.post('/eliminationledger', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.createEliminationLedger);
router.put('/eliminationledger/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.updateEliminationLedger);
router.delete('/eliminationledger/:id', requireRoles(UserRole.ADMIN), INTERCOMPANY_Controller.deleteEliminationLedger);

router.get('/ctaadjustment', INTERCOMPANY_Controller.listCTAAdjustment);
router.get('/ctaadjustment/metrics', INTERCOMPANY_Controller.getCTAAdjustmentMetrics);
router.get('/ctaadjustment/:id', INTERCOMPANY_Controller.getCTAAdjustmentById);
router.post('/ctaadjustment', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.createCTAAdjustment);
router.put('/ctaadjustment/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.updateCTAAdjustment);
router.delete('/ctaadjustment/:id', requireRoles(UserRole.ADMIN), INTERCOMPANY_Controller.deleteCTAAdjustment);

router.get('/nettingsettlement', INTERCOMPANY_Controller.listNettingSettlement);
router.get('/nettingsettlement/metrics', INTERCOMPANY_Controller.getNettingSettlementMetrics);
router.get('/nettingsettlement/:id', INTERCOMPANY_Controller.getNettingSettlementById);
router.post('/nettingsettlement', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.createNettingSettlement);
router.put('/nettingsettlement/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.updateNettingSettlement);
router.delete('/nettingsettlement/:id', requireRoles(UserRole.ADMIN), INTERCOMPANY_Controller.deleteNettingSettlement);

router.get('/taxprovision', INTERCOMPANY_Controller.listTaxProvision);
router.get('/taxprovision/metrics', INTERCOMPANY_Controller.getTaxProvisionMetrics);
router.get('/taxprovision/:id', INTERCOMPANY_Controller.getTaxProvisionById);
router.post('/taxprovision', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.createTaxProvision);
router.put('/taxprovision/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), INTERCOMPANY_Controller.updateTaxProvision);
router.delete('/taxprovision/:id', requireRoles(UserRole.ADMIN), INTERCOMPANY_Controller.deleteTaxProvision);
export default router;
