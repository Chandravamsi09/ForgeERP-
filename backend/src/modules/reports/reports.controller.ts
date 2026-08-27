import { Response, NextFunction } from 'express';
import { ReportsService } from './reports.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class ReportsController {
  static async getExecutiveMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ReportsService.getExecutiveMetrics(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getChartsData(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ReportsService.getChartsData(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async exportCsv(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { type } = req.query;
      const csvData = await ReportsService.exportToCsv([
        { report: type || 'executive_summary', date: new Date().toISOString(), status: 'GENERATED' }
      ]);
      res.header('Content-Type', 'text/csv');
      res.attachment(`report_${type || 'summary'}_${Date.now()}.csv`);
      res.send(csvData);
    } catch (error) {
      next(error);
    }
  }
}
