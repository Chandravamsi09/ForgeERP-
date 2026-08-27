# ForgeERP - Enterprise Manufacturing Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

ForgeERP is a production-grade, multi-tenant Enterprise Resource Planning (ERP) platform architected for mid-size manufacturing enterprises. It unifies inventory control, procurement workflows, sales order-to-cash processing, double-entry financial accounting, and HR/payroll operations into a secure, single-pane management system.

---

## 1. High-Level Architecture

ForgeERP is structured as a scalable monorepo comprising a layered Express.js + Prisma backend, a modern React + Tailwind CSS client, and shared validation schemas:

```
                                    +-----------------------------------------+
                                    |         Browser / Client App            |
                                    |     (React + TypeScript + Tailwind)     |
                                    +--------------------+--------------------+
                                                         |
                                                 HTTPS / REST APIs
                                                         |
                                                         v
                                    +-----------------------------------------+
                                    |      Express API Gateway / Router       |
                                    |    (Auth Middleware, RBAC, Multi-Tenant)|
                                    +--------------------+--------------------+
                                                         |
                   +-------------------------------------+-------------------------------------+
                   |                                     |                                     |
                   v                                     v                                     v
     +---------------------------+         +---------------------------+         +---------------------------+
     |   Auth & RBAC Module      |         |   Inventory & Stock       |         |   Procurement Module      |
     | (JWT, Tenants, Audit)     |         | (SKUs, Warehouses,Alerts) |         | (Vendors, POs, GRNs)      |
     +-------------+-------------+         +-------------+-------------+         +-------------+-------------+
                   |                                     |                                     |
                   +-------------------------------------+-------------------------------------+
                                                         |
                   +-------------------------------------+-------------------------------------+
                   |                                     |                                     |
                   v                                     v                                     v
     +---------------------------+         +---------------------------+         +---------------------------+
     |   Sales Order Module      |         |   Finance & Accounting    |         |    HR & Payroll Module    |
     | (Quotes, Orders, Invoices)|         | (Chart of Accounts, Ledger)|        | (Employees, Attendance,   |
     +-------------+-------------+         +-------------+-------------+         |  Payroll Runs & Tax)      |
                   |                                     |                       +-------------+-------------+
                   +-------------------------------------+-------------------------------------+
                                                         |
                                                         v
                                    +-----------------------------------------+
                                    |       Prisma ORM (Data Layer)           |
                                    +--------------------+--------------------+
                                                         |
                                                         v
                                    +-----------------------------------------+
                                    |     PostgreSQL Database (Multi-tenant)  |
                                    +-----------------------------------------+
```

---

## 2. Core Modules & Capabilities

| Module | Core Features |
| :--- | :--- |
| **Auth & RBAC** | Multi-tenant tenant onboarding, JWT authentication with refresh token rotation, bcrypt password hashing, and granular Role-Based Access Control (`ADMIN`, `MANAGER`, `EMPLOYEE`, `ACCOUNTANT`). |
| **Inventory Management** | Product SKU master, categories, multi-warehouse support, automated stock availability calculation, warehouse transfer approvals, and low-stock alerts. |
| **Procurement** | Vendor master directory, purchase order creation, approval workflows (`DRAFT` &rarr; `SUBMITTED` &rarr; `APPROVED`), and Goods Received Notes (GRN) that automatically increment inventory. |
| **Sales Order Management** | Customer CRM with credit limit enforcement, quotation generation & conversion, sales order confirmation with stock reservation, invoice generation with 10% tax calculation, and payment processing. |
| **Finance & Accounting** | Standard Chart of Accounts (Asset, Liability, Equity, Revenue, Expense), balanced double-entry General Ledger engine (`Debit == Credit`), expense tracking, automated P&L statement, and Balance Sheet reports. |
| **HR & Payroll** | Employee master directory, daily attendance tracking, gross-to-net payroll engine (base pay, allowances, progressive income tax, unexcused absence deductions), and payslips. |
| **Admin Dashboard & Reports** | Executive KPI summary cards (revenue, stock valuation, pending POs, cash flow), 6-month sales and margin trends, inventory valuation breakdown, and CSV data export. |

---

## 3. Database Schema Overview

```
                      +-------------------+
                      |      Tenant       |
                      +---------+---------+
                                | 1
                                |
             +------------------+------------------+------------------+
             | *                | *                | *                | *
       +-----+-----+      +-----+-----+      +-----+-----+      +-----+-----+
       |   User    |      |  Product  |      | Warehouse |      | Customer  |
       +-----+-----+      +-----+-----+      +-----+-----+      +-----+-----+
             | 1                | 1                | 1                | 1
             | *                | *                | *                | *
       +-----+-----+      +-----+-----+      +-----+-----+      +-----+-----+
       | UserRole  |      |StockLevel |<-----+StockTrnsfr|      |SalesOrder |
       +-----------+      +-----+-----+      +-----------+      +-----+-----+
                                |                                     | 1
                                | *                                   | *
                          +-----+-----+                         +-----+-----+
                          |  POItem   |                         |  Invoice  |
                          +-----------+                         +-----+-----+
                                                                      | 1
                                                                      | *
                                                                +-----+-----+
                                                                |  Payment  |
                                                                +-----------+
```

---

## 4. Getting Started & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **npm** / **yarn** / **pnpm**

### Step 1: Clone Repository & Configure Environment
```bash
git clone https://github.com/Chandravamsi09/ForgeERP-.git
cd ForgeERP-

# Copy environment template
cp .env.example .env
cp .env.example backend/.env
```

### Step 2: Install Monorepo Dependencies
```bash
npm install
```

### Step 3: Database Migration & Schema Generation
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### Step 4: Run Development Services
```bash
# Start backend API (Port 5000)
npm run dev:backend

# Start frontend application (Port 3000)
npm run dev:frontend
```

---

## 5. Running the Test Suite

Each ERP module contains a suite of unit and business logic tests covering core domain math, state machine transitions, and permission guards:

```bash
# Run all backend integration and unit tests
npm run test:backend
```

### Test Coverage Highlights:
- **Auth**: Password hashing verification, JWT token rotation, cross-tenant isolation.
- **Inventory**: Stock availability calculation, warehouse transfer balance deduction, low-stock deficit alerts, stock reservation math.
- **Procurement**: Line item subtotal and VAT calculations, strict PO lifecycle transitions, GRN stock incrementing, approval authorization.
- **Sales**: Quotation discount computation, customer credit limit enforcement, invoice tax addition, payment installment progression.
- **Finance**: Balanced double-entry ledger validation, general ledger balance update rules, P&L net income calculation, Balance Sheet balance equation.
- **HR & Payroll**: Gross-to-net pay calculations, attendance penalty deductions, progressive tax brackets, duplicate attendance locks.
- **Reports**: Inventory valuation aggregation, revenue accumulation, RFC-compliant CSV serializer.

---

## 6. Monorepo Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/              # Database connection & env validation
│   │   ├── middleware/          # JWT auth, RBAC guards, error handler
│   │   ├── modules/             # Auth, Inventory, Procurement, Sales, Finance, HR, Reports
│   │   ├── prisma/              # schema.prisma & migrations
│   │   ├── utils/               # Password hashing, JWT helpers
│   │   ├── app.ts               # Express application router
│   │   └── server.ts            # Server entrypoint
│   └── tests/                   # Jest unit & business logic test suites
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI elements & ProtectedRoute guard
│   │   ├── context/             # AuthContext with tenant session
│   │   ├── layouts/             # DashboardLayout with responsive sidebar
│   │   ├── pages/               # Login, Signup, Dashboard, Inventory, Procurement, Sales, Finance, HR
│   │   ├── services/            # Axios HTTP client with JWT interceptor
│   │   ├── App.tsx              # React router setup
│   │   └── main.tsx             # DOM root
│   ├── tailwind.config.js       # Styling configuration
│   └── vite.config.ts           # Bundler configuration
├── shared/                      # Common types, enums, and API interfaces
│   └── src/index.ts
├── package.json                 # Root monorepo workspace configuration
└── README.md
```
