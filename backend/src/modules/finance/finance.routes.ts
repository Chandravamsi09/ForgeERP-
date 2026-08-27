import { Router } from 'express';
import { FinanceController } from './finance.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();

router.use(authenticateJWT);
router.use(requireRoles(UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.MANAGER));

// Chart of Accounts
router.get('/accounts', FinanceController.getChartOfAccounts);
router.post('/accounts', requireRoles(UserRole.ADMIN, UserRole.ACCOUNTANT), FinanceController.createAccount);

// Journal Entries & Double-Entry Ledger
router.get('/journal-entries', FinanceController.getJournalEntries);
router.post('/journal-entries', requireRoles(UserRole.ADMIN, UserRole.ACCOUNTANT), FinanceController.createJournalEntry);

// Expenses
router.get('/expenses', FinanceController.getExpenses);
router.post('/expenses', FinanceController.createExpense);

// Financial Statements & Reports
router.get('/reports/profit-loss', FinanceController.getProfitAndLoss);
router.get('/reports/balance-sheet', FinanceController.getBalanceSheet);

export default router;
