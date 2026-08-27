import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { initializeEventSubscribers } from './events/subscribers';
import { tenantRateLimiter } from './middleware/rateLimiter';

import authRouter from './modules/auth/auth.routes';
import inventoryRouter from './modules/inventory/inventory.routes';
import procurementRouter from './modules/procurement/procurement.routes';
import salesRouter from './modules/sales/sales.routes';
import financeRouter from './modules/finance/finance.routes';
import hrRouter from './modules/hr/hr.routes';
import reportsRouter from './modules/reports/reports.routes';
import manufacturingRouter from './modules/manufacturing/workOrder.routes';
import qualityRouter from './modules/quality/quality.routes';
import wmsRouter from './modules/wms/wms.routes';
import consolidationRouter from './modules/finance/consolidation.routes';
import documentRouter from './modules/documents/document.routes';
import { openApiSpecification } from './docs/swaggerSpec';

import crmRouter from './modules/crm/crm.routes';
import procurement_advancedRouter from './modules/procurement_advanced/procurement_advanced.routes';
import manufacturing_advancedRouter from './modules/manufacturing_advanced/manufacturing_advanced.routes';
import quality_advancedRouter from './modules/quality_advanced/quality_advanced.routes';
import wms_advancedRouter from './modules/wms_advanced/wms_advanced.routes';
import finance_advancedRouter from './modules/finance_advanced/finance_advanced.routes';
import hr_advancedRouter from './modules/hr_advanced/hr_advanced.routes';
import field_serviceRouter from './modules/field_service/field_service.routes';
import tradeRouter from './modules/trade/trade.routes';
import workflowRouter from './modules/workflow/workflow.routes';
import cmmsRouter from './modules/cmms/cmms.routes';
import pricingRouter from './modules/pricing/pricing.routes';
import documents_portalRouter from './modules/documents_portal/documents_portal.routes';
import analyticsRouter from './modules/analytics/analytics.routes';
import audit_soxRouter from './modules/audit_sox/audit_sox.routes';
import inventory_valuationRouter from './modules/inventory_valuation/inventory_valuation.routes';
import engineering_bomRouter from './modules/engineering_bom/engineering_bom.routes';
import intercompanyRouter from './modules/intercompany/intercompany.routes';
import revenue_asc606Router from './modules/revenue_asc606/revenue_asc606.routes';
import fixed_assetsRouter from './modules/fixed_assets/fixed_assets.routes';

initializeEventSubscribers();

const app = express();

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', tenantRateLimiter);

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'UP',
      app: 'ForgeERP Global Enterprise API Gateway',
      timestamp: new Date().toISOString(),
    },
  });
});

app.get('/api/v1/docs', (_req, res) => {
  res.status(200).json(openApiSpecification);
});

// Primary Domain Routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/procurement', procurementRouter);
app.use('/api/v1/sales', salesRouter);
app.use('/api/v1/finance', financeRouter);
app.use('/api/v1/hr', hrRouter);
app.use('/api/v1/reports', reportsRouter);
app.use('/api/v1/manufacturing', manufacturingRouter);
app.use('/api/v1/quality', qualityRouter);
app.use('/api/v1/wms', wmsRouter);
app.use('/api/v1/consolidation', consolidationRouter);
app.use('/api/v1/documents', documentRouter);

app.use('/api/v1/crm', crmRouter);
app.use('/api/v1/procurement_advanced', procurement_advancedRouter);
app.use('/api/v1/manufacturing_advanced', manufacturing_advancedRouter);
app.use('/api/v1/quality_advanced', quality_advancedRouter);
app.use('/api/v1/wms_advanced', wms_advancedRouter);
app.use('/api/v1/finance_advanced', finance_advancedRouter);
app.use('/api/v1/hr_advanced', hr_advancedRouter);
app.use('/api/v1/field_service', field_serviceRouter);
app.use('/api/v1/trade', tradeRouter);
app.use('/api/v1/workflow', workflowRouter);
app.use('/api/v1/cmms', cmmsRouter);
app.use('/api/v1/pricing', pricingRouter);
app.use('/api/v1/documents_portal', documents_portalRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/audit_sox', audit_soxRouter);
app.use('/api/v1/inventory_valuation', inventory_valuationRouter);
app.use('/api/v1/engineering_bom', engineering_bomRouter);
app.use('/api/v1/intercompany', intercompanyRouter);
app.use('/api/v1/revenue_asc606', revenue_asc606Router);
app.use('/api/v1/fixed_assets', fixed_assetsRouter);

app.use(errorHandler);
export default app;
