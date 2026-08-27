import { Router } from 'express';
import { PRICING_Controller } from './pricing.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();
router.use(authenticateJWT);

router.get('/pricematrix', PRICING_Controller.listPriceMatrix);
router.get('/pricematrix/metrics', PRICING_Controller.getPriceMatrixMetrics);
router.get('/pricematrix/:id', PRICING_Controller.getPriceMatrixById);
router.post('/pricematrix', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.createPriceMatrix);
router.put('/pricematrix/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.updatePriceMatrix);
router.delete('/pricematrix/:id', requireRoles(UserRole.ADMIN), PRICING_Controller.deletePriceMatrix);

router.get('/volumetier', PRICING_Controller.listVolumeTier);
router.get('/volumetier/metrics', PRICING_Controller.getVolumeTierMetrics);
router.get('/volumetier/:id', PRICING_Controller.getVolumeTierById);
router.post('/volumetier', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.createVolumeTier);
router.put('/volumetier/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.updateVolumeTier);
router.delete('/volumetier/:id', requireRoles(UserRole.ADMIN), PRICING_Controller.deleteVolumeTier);

router.get('/customergroupdiscount', PRICING_Controller.listCustomerGroupDiscount);
router.get('/customergroupdiscount/metrics', PRICING_Controller.getCustomerGroupDiscountMetrics);
router.get('/customergroupdiscount/:id', PRICING_Controller.getCustomerGroupDiscountById);
router.post('/customergroupdiscount', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.createCustomerGroupDiscount);
router.put('/customergroupdiscount/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.updateCustomerGroupDiscount);
router.delete('/customergroupdiscount/:id', requireRoles(UserRole.ADMIN), PRICING_Controller.deleteCustomerGroupDiscount);

router.get('/promotionalcampaign', PRICING_Controller.listPromotionalCampaign);
router.get('/promotionalcampaign/metrics', PRICING_Controller.getPromotionalCampaignMetrics);
router.get('/promotionalcampaign/:id', PRICING_Controller.getPromotionalCampaignById);
router.post('/promotionalcampaign', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.createPromotionalCampaign);
router.put('/promotionalcampaign/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.updatePromotionalCampaign);
router.delete('/promotionalcampaign/:id', requireRoles(UserRole.ADMIN), PRICING_Controller.deletePromotionalCampaign);

router.get('/marginrule', PRICING_Controller.listMarginRule);
router.get('/marginrule/metrics', PRICING_Controller.getMarginRuleMetrics);
router.get('/marginrule/:id', PRICING_Controller.getMarginRuleById);
router.post('/marginrule', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.createMarginRule);
router.put('/marginrule/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.updateMarginRule);
router.delete('/marginrule/:id', requireRoles(UserRole.ADMIN), PRICING_Controller.deleteMarginRule);

router.get('/priceflooroverride', PRICING_Controller.listPriceFloorOverride);
router.get('/priceflooroverride/metrics', PRICING_Controller.getPriceFloorOverrideMetrics);
router.get('/priceflooroverride/:id', PRICING_Controller.getPriceFloorOverrideById);
router.post('/priceflooroverride', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.createPriceFloorOverride);
router.put('/priceflooroverride/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.updatePriceFloorOverride);
router.delete('/priceflooroverride/:id', requireRoles(UserRole.ADMIN), PRICING_Controller.deletePriceFloorOverride);

router.get('/currencysurcharge', PRICING_Controller.listCurrencySurcharge);
router.get('/currencysurcharge/metrics', PRICING_Controller.getCurrencySurchargeMetrics);
router.get('/currencysurcharge/:id', PRICING_Controller.getCurrencySurchargeById);
router.post('/currencysurcharge', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.createCurrencySurcharge);
router.put('/currencysurcharge/:id', requireRoles(UserRole.ADMIN, UserRole.MANAGER), PRICING_Controller.updateCurrencySurcharge);
router.delete('/currencysurcharge/:id', requireRoles(UserRole.ADMIN), PRICING_Controller.deleteCurrencySurcharge);
export default router;
