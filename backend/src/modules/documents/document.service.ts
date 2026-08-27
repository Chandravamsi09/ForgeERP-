import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';
import { PDFDocumentEngine } from '../../utils/pdfDocumentEngine';

export class DocumentService {
  /**
   * Generates Tax Invoice PDF
   */
  static async getInvoicePDF(tenantId: string, invoiceId: string): Promise<{ filename: string; buffer: Buffer }> {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, tenantId },
      include: {
        tenant: true,
        customer: true,
        items: { include: { product: true } },
      },
    });

    if (!invoice) throw new AppError('Invoice not found', 404);

    const buffer = PDFDocumentEngine.generateInvoicePDF({
      invoiceNumber: invoice.invoiceNumber,
      companyName: invoice.tenant.name,
      customerName: invoice.customer.name,
      customerEmail: invoice.customer.email,
      billingAddress: invoice.customer.billingAddress || undefined,
      invoiceDate: invoice.createdAt,
      dueDate: invoice.dueDate,
      items: invoice.items.map((i) => ({
        sku: i.product.sku,
        name: i.product.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
      })),
      subtotal: invoice.subtotal,
      taxRate: invoice.taxRate,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
    });

    return {
      filename: `Invoice-${invoice.invoiceNumber}.pdf`,
      buffer,
    };
  }

  /**
   * Generates Purchase Order PDF
   */
  static async getPurchaseOrderPDF(tenantId: string, poId: string): Promise<{ filename: string; buffer: Buffer }> {
    const po = await prisma.purchaseOrder.findFirst({
      where: { id: poId, tenantId },
      include: {
        tenant: true,
        vendor: true,
        items: { include: { product: true } },
      },
    });

    if (!po) throw new AppError('Purchase Order not found', 404);

    const buffer = PDFDocumentEngine.generatePurchaseOrderPDF({
      poNumber: po.poNumber,
      companyName: po.tenant.name,
      vendorName: po.vendor.companyName,
      vendorEmail: po.vendor.email,
      orderDate: po.createdAt,
      items: po.items.map((i) => ({
        sku: i.product.sku,
        name: i.product.name,
        quantity: i.quantityOrdered,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
      })),
      subtotal: po.subtotal,
      taxAmount: po.taxAmount,
      totalAmount: po.totalAmount,
      paymentTerms: po.vendor.paymentTerms,
    });

    return {
      filename: `PO-${po.poNumber}.pdf`,
      buffer,
    };
  }

  /**
   * Generates CoA Certificate PDF
   */
  static async getCoAPDF(tenantId: string, coaId: string): Promise<{ filename: string; buffer: Buffer }> {
    const coa = await prisma.certificateOfAnalysis.findFirst({
      where: { id: coaId, tenantId },
      include: {
        qualityInspection: {
          include: {
            plan: { include: { product: true } },
            testResults: true,
          },
        },
      },
    });

    if (!coa) throw new AppError('Certificate of Analysis not found', 404);

    const buffer = PDFDocumentEngine.generateCoAPDF({
      coaNumber: coa.coaNumber,
      productName: coa.qualityInspection.plan.product.name,
      productSku: coa.qualityInspection.plan.product.sku,
      batchNumber: coa.batchNumber,
      inspectionDate: coa.issuedDate,
      inspectorName: coa.qualityInspection.inspectorName,
      approvedBy: coa.approvedBy,
      testResults: coa.qualityInspection.testResults.map((r) => ({
        parameterName: r.parameterName,
        measuredValue: r.measuredValue || undefined,
        isConforming: r.isConforming,
      })),
    });

    return {
      filename: `CoA-${coa.coaNumber}.pdf`,
      buffer,
    };
  }
}
