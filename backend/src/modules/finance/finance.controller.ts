import { Response, NextFunction } from 'express';
import { FinanceService } from './finance.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { AccountType } from '@forge-erp/shared';
import { z } from 'zod';

const createAccountSchema = z.object({
  accountCode: z.string().min(1, 'Account code is required'),
  accountName: z.string().min(1, 'Account name is required'),
  accountType: z.nativeEnum(AccountType),
  initialBalance: z.number().optional(),
});

const createJournalEntrySchema = z.object({
  description: z.string().min(1, 'Description is required'),
  entryDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
  lines: z.array(
    z.object({
      accountId: z.string().min(1),
      debit: z.number().nonnegative(),
      credit: z.number().nonnegative(),
    })
  ).min(2, 'Journal entry requires at least 2 balancing lines'),
});

const createExpenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be greater than zero'),
  taxAmount: z.number().nonnegative().optional(),
  expenseDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
});

export class FinanceController {
  static async createAccount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createAccountSchema.parse(req.body);
      const result = await FinanceService.createAccount(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getChartOfAccounts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await FinanceService.getChartOfAccounts(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createJournalEntry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createJournalEntrySchema.parse(req.body);
      const result = await FinanceService.createJournalEntry(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getJournalEntries(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await FinanceService.getJournalEntries(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createExpense(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createExpenseSchema.parse(req.body);
      const result = await FinanceService.createExpense(req.tenantId!, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getExpenses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await FinanceService.getExpenses(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getProfitAndLoss(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await FinanceService.getProfitAndLoss(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getBalanceSheet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await FinanceService.getBalanceSheet(req.tenantId!);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
