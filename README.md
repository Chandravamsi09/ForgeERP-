# ForgeERP — Tier-1 Manufacturing Enterprise Resource Planning Platform

ForgeERP is a production-grade, multi-tenant Cloud Manufacturing Enterprise Resource Planning (ERP) platform designed for mid-to-large industrial manufacturing enterprises, benchmarked against SAP S/4HANA, Oracle NetSuite, and Microsoft Dynamics 365.

---

## 1. System Architecture

- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL / SQLite
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Shared Domain Layer**: Pure TypeScript domain math engines, calculation libraries, and Zod schemas
- **Security & Compliance**: Strict tenant isolation, token bucket rate limiter, SOX/ISO-9001 append-only audit trail

---

## 2. Installation

Clone the repository and install dependencies across all workspaces:

```bash
# Clone the repository
git clone https://github.com/Chandravamsi09/ForgeERP-.git
cd ForgeERP-

# Install monorepo dependencies
npm install
```

Copy the environment template:

```bash
cp example.env backend/.env
```

Generate database client and push schema:

```bash
cd backend
npx prisma generate
npx prisma db push
cd ..
```

---

## 3. Build

Compile all workspaces (`shared`, `backend`, and `frontend`):

```bash
# Build shared library
npm --prefix shared run build

# Build frontend bundle
npm --prefix frontend run build

# Build backend
npm --prefix backend run build
```

---

## 4. Run

Start the application services in development or production mode:

```bash
# Start backend API server (port 5000)
npm --prefix backend run dev

# Start frontend development server (port 3000)
npm --prefix frontend run dev
```

Access the applications:
- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)
- **OpenAPI / Swagger Spec**: [http://localhost:5000/api/v1/docs](http://localhost:5000/api/v1/docs)

---

## 5. Testing

Run the full automated test suite across all 20 subsystems:

```bash
npm --prefix backend test
```

---

## 6. Docker Deployment

```bash
docker-compose up -d --build
```
