import { Response, NextFunction } from 'express';
import { InventoryService } from './inventory.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name required'),
  code: z.string().min(1, 'Category code required'),
  description: z.string().optional(),
});

const createProductSchema = z.object({
  categoryId: z.string().min(1, 'Category ID required'),
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  unitOfMeasure: z.string().default('units'),
  costPrice: z.number().nonnegative(),
  sellingPrice: z.number().nonnegative(),
  minStockLevel: z.number().int().nonnegative().default(10),
});

const createWarehouseSchema = z.object({
  code: z.string().min(1, 'Warehouse code is required'),
  name: z.string().min(1, 'Warehouse name is required'),
  location: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

const adjustStockSchema = z.object({
  warehouseId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.number().int(),
});

const transferStockSchema = z.object({
  sourceWarehouseId: z.string().min(1),
  targetWarehouseId: z.string().min(1),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'At least one item must be transferred'),
  notes: z.string().optional(),
});

export class InventoryController {
  static async createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createCategorySchema.parse(req.body);
      const result = await InventoryService.createCategory(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await InventoryService.getCategories(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createProductSchema.parse(req.body);
      const result = await InventoryService.createProduct(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { search, categoryId } = req.query;
      const result = await InventoryService.getProducts(req.tenantId!, {
        search: search as string,
        categoryId: categoryId as string,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createWarehouse(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createWarehouseSchema.parse(req.body);
      const result = await InventoryService.createWarehouse(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getWarehouses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await InventoryService.getWarehouses(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async adjustStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { warehouseId, productId, quantity } = adjustStockSchema.parse(req.body);
      const result = await InventoryService.adjustStock(req.tenantId!, warehouseId, productId, quantity);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createStockTransfer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = transferStockSchema.parse(req.body);
      const result = await InventoryService.createStockTransfer(req.tenantId!, {
        ...dto,
        requestedBy: `${req.user!.email}`,
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async completeStockTransfer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await InventoryService.completeStockTransfer(req.tenantId!, id, req.user!.email);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getLowStockAlerts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const alerts = await InventoryService.getLowStockAlerts(req.tenantId!);
      res.status(200).json({ success: true, data: alerts });
    } catch (error) {
      next(error);
    }
  }
}
