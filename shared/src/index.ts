export * from './engines/bomRollupEngine';
export * from './engines/mrpNettingEngine';
export * from './engines/oeeEngine';
export * from './engines/inventoryValuationEngine';
export * from './engines/threeWayMatchEngine';
export * from './engines/intercompanyEliminationEngine';
export * from './engines/fixedAssetEngine';
export * from './engines/revenueRecognitionEngine';
export * from './engines/globalTradeEngine';

export * from './domain/financialRatios';
export * from './domain/taxMatrices';
export * from './domain/chartOfAccountsMaster';
export * from './domain/inventoryOptimization';
export * from './domain/finiteCapacityScheduling';
export * from './domain/fmeaReliabilityEngine';
export * from './domain/fxHedging';
export * from './domain/warehouseSlottingEngine';
export * from './domain/costCenterAllocationEngine';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  ACCOUNTANT = 'ACCOUNTANT'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

export enum TransferStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED'
}

export enum QuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum SalesOrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum InvoiceStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  VOID = 'VOID'
}

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export enum JournalEntryStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LEAVE = 'LEAVE',
  HALF_DAY = 'HALF_DAY'
}

export enum PayrollStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  PROCESSED = 'PROCESSED'
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface JwtPayload {
  userId: string;
  tenantId: string;
  email: string;
  roles: UserRole[];
}

// Canonical Shared Enterprise Entity Interfaces

export interface IProduct {
  id: string;
  sku: string;
  name: string;
  unitOfMeasure: string;
  costPrice: number;
  sellingPrice: number;
  minStockLevel: number;
  category?: { id: string; name: string };
  stockLevels?: IStockLevel[];
}

export interface IStockLevel {
  id: string;
  warehouseId: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  warehouse?: { id: string; name: string; code: string };
}

export interface IWarehouse {
  id: string;
  code: string;
  name: string;
  location?: string;
  isPrimary: boolean;
}

export interface ILowStockAlert {
  productId: string;
  sku: string;
  name: string;
  category: string;
  minStockLevel: number;
  totalOnHand: number;
  totalAvailable: number;
  isCritical: boolean;
  deficit: number;
}

export interface IVendor {
  id: string;
  code: string;
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  paymentTerms: string;
  _count?: { purchaseOrders: number };
}

export interface IPurchaseOrderItem {
  id: string;
  product: { name: string; sku: string };
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IPurchaseOrder {
  id: string;
  poNumber: string;
  vendor: { companyName: string };
  status: PurchaseOrderStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
  items?: IPurchaseOrderItem[];
}

export interface ICustomer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone?: string;
  creditLimit: number;
}

export interface ISalesOrderItem {
  id: string;
  product: { name: string };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ISalesOrder {
  id: string;
  orderNumber: string;
  customer: { name: string };
  status: SalesOrderStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
  items?: ISalesOrderItem[];
}

export interface IAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
}

export interface IExpense {
  id: string;
  expenseNumber: string;
  category: string;
  amount: number;
  taxAmount: number;
  expenseDate: string;
  description?: string;
}

export interface IProfitLoss {
  revenue: { total: number };
  expenses: { total: number };
  netProfit: number;
  isProfitable: boolean;
}

export interface IBalanceSheet {
  assets: { total: number };
  liabilities: { total: number };
  equity: { total: number };
  isBalanced: boolean;
}

export interface IEmployee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  baseSalary: number;
  _count?: { attendances: number; payslips: number };
}

export interface IAttendance {
  id: string;
  employee: { firstName: string; lastName: string };
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
}

export interface IPayrollRun {
  id: string;
  payrollPeriod: string;
  payDate: string;
  status: PayrollStatus;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  payslips?: any[];
}
