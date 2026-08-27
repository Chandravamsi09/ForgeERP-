import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

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

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
