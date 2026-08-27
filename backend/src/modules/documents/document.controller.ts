import { Response, NextFunction } from 'express';
import { DocumentService } from './document.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class DocumentController {
  static async downloadInvoicePDF(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { invoiceId } = req.params;
      const { filename, buffer } = await DocumentService.getInvoicePDF(req.tenantId!, invoiceId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  static async downloadPurchaseOrderPDF(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { poId } = req.params;
      const { filename, buffer } = await DocumentService.getPurchaseOrderPDF(req.tenantId!, poId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  static async downloadCoAPDF(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { coaId } = req.params;
      const { filename, buffer } = await DocumentService.getCoAPDF(req.tenantId!, coaId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }
}
