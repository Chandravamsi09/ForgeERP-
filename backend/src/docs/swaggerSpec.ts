export const openApiSpecification = {
  openapi: '3.0.3',
  info: {
    title: 'ForgeERP Enterprise REST API',
    version: '2.0.0',
    description: 'Tier-1 Manufacturing Enterprise Resource Planning (ERP) System conforming to ISO-9001 and SOX compliance standards.',
    contact: {
      name: 'ForgeERP Engineering Directorate',
      email: 'architecture@forge-erp.enterprise',
    },
  },
  servers: [
    { url: 'http://localhost:5000/api/v1', description: 'Local Development Server' },
    { url: 'https://api.forge-erp.internal/api/v1', description: 'Production High-Availability Cluster' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Multi-tenant scoped JWT Access Token',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        summary: 'Cluster Health Check',
        responses: {
          '200': { description: 'Server is healthy and responsive' },
        },
      },
    },
    '/auth/signup': {
      post: {
        summary: 'Register Enterprise Tenant & Admin Account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['companyName', 'companyCode', 'email', 'password', 'firstName', 'lastName'],
                properties: {
                  companyName: { type: 'string', example: 'AeroDynamics Global Corp' },
                  companyCode: { type: 'string', example: 'AERODYN' },
                  email: { type: 'string', format: 'email', example: 'admin@aerodyn.com' },
                  password: { type: 'string', format: 'password', example: 'StrongP@ssw0rd!' },
                  firstName: { type: 'string', example: 'David' },
                  lastName: { type: 'string', example: 'Vance' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Tenant workspace successfully created' },
          '400': { description: 'Validation error or company code already taken' },
        },
      },
    },
    '/manufacturing/orders': {
      get: {
        summary: 'List Work Orders with BOM & Operation Progression',
        responses: { '200': { description: 'Work Orders retrieved' } },
      },
      post: {
        summary: 'Create Work Order with Automated Component Allocation',
        responses: { '201': { description: 'Work Order created' } },
      },
    },
    '/quality/inspections': {
      get: { summary: 'List Quality Inspections' },
      post: { summary: 'Record In-Line or GRN Inspection with Tolerance Checks' },
    },
    '/wms/ledger': {
      get: { summary: 'Paginated Immutable Inventory Ledger' },
    },
    '/wms/genealogy/{batchNumber}': {
      get: { summary: 'Trace Bi-Directional Lot Genealogy Graph' },
    },
    '/consolidation/run': {
      post: { summary: 'Execute Multi-Subsidiary Financial Consolidation' },
    },
  },
};
