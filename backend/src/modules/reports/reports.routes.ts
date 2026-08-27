import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authenticateJWT } from '../../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/metrics', ReportsController.getExecutiveMetrics);
router.get('/charts', ReportsController.getChartsData);
router.get('/export/csv', ReportsController.exportCsv);

export default router;
