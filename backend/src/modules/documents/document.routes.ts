import { Router } from 'express';
import { DocumentController } from './document.controller';
import { authenticateJWT } from '../../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/invoices/:invoiceId/pdf', DocumentController.downloadInvoicePDF);
router.get('/purchase-orders/:poId/pdf', DocumentController.downloadPurchaseOrderPDF);
router.get('/coa/:coaId/pdf', DocumentController.downloadCoAPDF);

export default router;
