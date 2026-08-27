import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import procurementRoutes from './modules/procurement/procurement.routes';
import salesRoutes from './modules/sales/sales.routes';
import financeRoutes from './modules/finance/finance.routes';
import hrRoutes from './modules/hr/hr.routes';
import reportsRoutes from './modules/reports/reports.routes';

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'UP',
        app: 'ForgeERP Backend API',
        timestamp: new Date().toISOString(),
      },
    });
  });

  // Module Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/inventory', inventoryRoutes);
  app.use('/api/v1/procurement', procurementRoutes);
  app.use('/api/v1/sales', salesRoutes);
  app.use('/api/v1/finance', financeRoutes);
  app.use('/api/v1/hr', hrRoutes);
  app.use('/api/v1/reports', reportsRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
