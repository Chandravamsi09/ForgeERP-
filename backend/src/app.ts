import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

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

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'UP',
      app: 'ForgeERP Backend API',
      timestamp: new Date().toISOString(),
    },
  });
});

// Domain Routing Modules (20 Subsystems Architecture)
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

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
