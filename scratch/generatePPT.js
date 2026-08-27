const pptxgen = require('pptxgenjs');
const path = require('path');

async function createPresentation() {
  const pres = new pptxgen();

  pres.layout = 'LAYOUT_16x9';
  pres.author = 'ForgeERP Engineering Team';
  pres.company = 'ForgeERP Enterprise';
  pres.title = 'ForgeERP - Project Presentation';

  // Design Constants
  const BG_COLOR = '0F172A'; // Slate 900
  const CARD_BG = '1E293B';  // Slate 800
  const ACCENT_BLUE = '38BDF8'; // Sky 400
  const ACCENT_GREEN = '34D399'; // Emerald 400
  const ACCENT_AMBER = 'FBBF24'; // Amber 400
  const TEXT_WHITE = 'FFFFFF';
  const TEXT_MUTED = '94A3B8'; // Slate 400
  const BORDER_COLOR = '334155';

  const addHeader = (slide, title, category = 'FORGE-ERP ENTERPRISE PLATFORM') => {
    slide.background = { color: BG_COLOR };
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.4,
      w: 11.5,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: ACCENT_BLUE,
    });
    slide.addText(title, {
      x: 0.8,
      y: 0.7,
      w: 11.5,
      h: 0.6,
      fontSize: 22,
      fontFace: 'Arial',
      bold: true,
      color: TEXT_WHITE,
    });
    slide.addShape(pres.shapes.LINE, {
      x: 0.8,
      y: 1.35,
      w: 11.7,
      h: 0,
      line: { color: BORDER_COLOR, width: 1 },
    });
  };

  // ==========================================
  // SLIDE 1: Title Slide
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 0.8,
      w: 1.2,
      h: 1.2,
      rectRadius: 0.2,
      fill: { color: '0284C7' },
      line: { color: ACCENT_BLUE, width: 2 },
    });
    slide.addText('F', {
      x: 0.8,
      y: 0.8,
      w: 1.2,
      h: 1.2,
      fontSize: 36,
      bold: true,
      color: TEXT_WHITE,
      align: 'center',
      valign: 'middle',
    });

    slide.addText('ForgeERP: Next-Generation Tier-1 Manufacturing ERP & Financial Intelligence Platform', {
      x: 0.8,
      y: 2.2,
      w: 11.5,
      h: 1.4,
      fontSize: 26,
      fontFace: 'Arial',
      bold: true,
      color: TEXT_WHITE,
    });

    slide.addText('A Full-Scale Multi-Tenant Cloud Architecture with MRP II, ISO 22400 OEE, Bi-Directional Genealogy & Automated Financial Consolidation', {
      x: 0.8,
      y: 3.7,
      w: 11.5,
      h: 0.8,
      fontSize: 13,
      fontFace: 'Arial',
      color: ACCENT_BLUE,
    });

    // Metadata Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 4.7,
      w: 11.7,
      h: 2.0,
      rectRadius: 0.1,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
    });

    slide.addText([
      { text: 'Project Title: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'ForgeERP — Cloud-Native Manufacturing Execution & Enterprise Resource Planning\n', options: { color: TEXT_WHITE } },
      { text: 'Team Members: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'Avvaru Chandra Vamsi & Engineering Team\n', options: { color: TEXT_WHITE } },
      { text: 'Project Mentor: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'Faculty Guide & Industry Technical Mentor\n', options: { color: TEXT_WHITE } },
      { text: 'Department: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'Department of Computer Science & Engineering\n', options: { color: TEXT_WHITE } },
      { text: 'Date: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'August 2026', options: { color: TEXT_WHITE } },
    ], {
      x: 1.1,
      y: 4.85,
      w: 11.0,
      h: 1.7,
      fontSize: 11,
      fontFace: 'Arial',
    });
  }

  // ==========================================
  // SLIDE 2: Introduction
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Introduction & Project Overview');

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.6,
      w: 5.6,
      h: 5.0,
      rectRadius: 0.1,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
    });
    slide.addText('What is ForgeERP?', {
      x: 1.1,
      y: 1.8,
      w: 5.0,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: ACCENT_BLUE,
    });
    slide.addText([
      { text: '• Enterprise-Grade Solution: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'ForgeERP is a modern, full-stack Tier-1 Enterprise Resource Planning platform designed for precision discrete manufacturing.\n\n', options: { color: TEXT_MUTED } },
      { text: '• Unified Ecosystem: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Integrates 10 mission-critical industrial subsystems into a single high-performance cloud architecture.\n\n', options: { color: TEXT_MUTED } },
      { text: '• End-to-End Traceability: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Spans Raw Material Procurement &rarr; Shop Floor Routing &rarr; Quality AQL &rarr; Lot Genealogy &rarr; General Ledger.', options: { color: TEXT_MUTED } },
    ], {
      x: 1.1,
      y: 2.3,
      w: 5.0,
      h: 4.1,
      fontSize: 12,
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.8,
      y: 1.6,
      w: 5.7,
      h: 5.0,
      rectRadius: 0.1,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
    });
    slide.addText('Why Choose This Project?', {
      x: 7.1,
      y: 1.8,
      w: 5.1,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: ACCENT_GREEN,
    });
    slide.addText([
      { text: '• Overcoming Legacy Silos: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Traditional manufacturing runs on fragmented spreadsheets, causing inventory stockouts and production delays.\n\n', options: { color: TEXT_MUTED } },
      { text: '• Compliance & Speed: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Modern enterprises require strict ISO-9001 quality audits, SOX 404 financial compliance, and real-time OEE visibility.\n\n', options: { color: TEXT_MUTED } },
      { text: '• High Computational Rigor: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Demonstrates deep domain mathematics including MRP II net explosion, ASC 606 revenue amortization, and intercompany eliminations.', options: { color: TEXT_MUTED } },
    ], {
      x: 7.1,
      y: 2.3,
      w: 5.1,
      h: 4.1,
      fontSize: 12,
    });
  }

  // ==========================================
  // SLIDE 3: Problem Statement
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Problem Statement & Industry Pain Points');

    const problems = [
      {
        title: 'Data Silos & Disconnected Systems',
        desc: 'Shop floor machines, inventory warehouses, quality auditors, and accounting operate on disparate tools without real-time data synchronization.',
        color: 'F87171',
      },
      {
        title: 'Lack of Bi-Directional Traceability',
        desc: 'When a defective component is reported, legacy systems take days to track affected raw material heat batches and downstream customer shipments.',
        color: ACCENT_AMBER,
      },
      {
        title: 'Unreliable Material Netting & Costs',
        desc: 'Manual MRP and inventory valuation lead to over-purchasing, material shortages, inaccurate COGS reporting, and failed 3-way matching.',
        color: 'A78BFA',
      },
    ];

    problems.forEach((p, idx) => {
      const x = 0.8 + idx * 4.0;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y: 1.8,
        w: 3.7,
        h: 4.8,
        rectRadius: 0.1,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
      });
      slide.addText(`0${idx + 1}`, {
        x: x + 0.3,
        y: 2.1,
        w: 3.1,
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: p.color,
      });
      slide.addText(p.title, {
        x: x + 0.3,
        y: 2.7,
        w: 3.1,
        h: 0.8,
        fontSize: 15,
        bold: true,
        color: TEXT_WHITE,
      });
      slide.addText(p.desc, {
        x: x + 0.3,
        y: 3.6,
        w: 3.1,
        h: 2.8,
        fontSize: 12,
        color: TEXT_MUTED,
      });
    });
  }

  // ==========================================
  // SLIDE 4: Objectives
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Project Objectives & Goals');

    const objectives = [
      { num: '1', title: 'Full-Scale Discrete Manufacturing Control', desc: 'Implement multi-level BOM recursive explosion with scrap compounding, work order dispatching, and ISO 22400 OEE analytics.' },
      { num: '2', title: 'ISO 2859-1 Quality & Bi-Directional Genealogy', desc: 'Automate AQL sampling inspection gates, Non-Conformance Reports (NCR), and instant forward/backward lot recall graph traceability.' },
      { num: '3', title: 'Automated 3-Way Match & SCM', desc: 'Execute automated tolerance-based 3-Way Matching across Purchase Orders, Goods Receipt Notes (GRN), and Vendor Invoices.' },
      { num: '4', title: 'Multi-Entity Financial Consolidation & CTA', desc: 'Maintain double-entry General Ledger with NetSuite-style intercompany revenue/COGS eliminations and FX CTA adjustments.' },
    ];

    objectives.forEach((obj, idx) => {
      const y = 1.6 + idx * 1.3;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.8,
        y,
        w: 11.7,
        h: 1.15,
        rectRadius: 0.1,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
      });

      slide.addShape(pres.shapes.OVAL, {
        x: 1.1,
        y: y + 0.2,
        w: 0.75,
        h: 0.75,
        fill: { color: '0284C7' },
      });
      slide.addText(obj.num, {
        x: 1.1,
        y: y + 0.2,
        w: 0.75,
        h: 0.75,
        fontSize: 16,
        bold: true,
        color: TEXT_WHITE,
        align: 'center',
        valign: 'middle',
      });

      slide.addText(obj.title, {
        x: 2.1,
        y: y + 0.15,
        w: 10.0,
        h: 0.35,
        fontSize: 14,
        bold: true,
        color: ACCENT_BLUE,
      });
      slide.addText(obj.desc, {
        x: 2.1,
        y: y + 0.52,
        w: 10.0,
        h: 0.5,
        fontSize: 11,
        color: TEXT_MUTED,
      });
    });
  }

  // ==========================================
  // SLIDE 5: Existing System vs Proposed System
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Existing System vs. Proposed ForgeERP');

    // Existing System Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.6,
      w: 5.6,
      h: 5.0,
      rectRadius: 0.1,
      fill: { color: CARD_BG },
      line: { color: 'EF4444', width: 1.5 },
    });
    slide.addText('❌ Existing / Legacy Systems', {
      x: 1.1,
      y: 1.8,
      w: 5.0,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: 'EF4444',
    });
    slide.addText([
      { text: '• Siloed Spreadsheets: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Data entered multiple times across departments with high human error.\n\n', options: { color: TEXT_MUTED } },
      { text: '• Manual Batch Recall: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Takes 48–72 hours to audit which customer received defective parts.\n\n', options: { color: TEXT_MUTED } },
      { text: '• High Invoice Fraud Risk: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Lack of automated 3-way matching allows over-invoicing and duplicate payments.\n\n', options: { color: TEXT_MUTED } },
      { text: '• Slow Financial Close: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Month-end intercompany consolidation takes weeks of manual ledger balancing.', options: { color: TEXT_MUTED } },
    ], {
      x: 1.1,
      y: 2.4,
      w: 5.0,
      h: 4.0,
      fontSize: 11,
    });

    // Proposed System Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.8,
      y: 1.6,
      w: 5.7,
      h: 5.0,
      rectRadius: 0.1,
      fill: { color: CARD_BG },
      line: { color: ACCENT_GREEN, width: 1.5 },
    });
    slide.addText('✨ Proposed ForgeERP Solution', {
      x: 7.1,
      y: 1.8,
      w: 5.1,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: ACCENT_GREEN,
    });
    slide.addText([
      { text: '• Unified Single Source of Truth: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'All modules share real-time state with zero data re-entry.\n\n', options: { color: TEXT_MUTED } },
      { text: '• Instant Bi-Directional Genealogy: ', options: { bold: true, color: TEXT_WHITE } },
      { text: '1-click sub-second forward & backward tree trace for defective batches.\n\n', options: { color: TEXT_MUTED } },
      { text: '• Automated 3-Way Match Validation: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Zero tolerance breach enforcement between PO, GRN, and Invoice.\n\n', options: { color: TEXT_MUTED } },
      { text: '• Real-Time Consolidation & CTA: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Automatic intercompany elimination entries with instant balanced trial balance.', options: { color: TEXT_MUTED } },
    ], {
      x: 7.1,
      y: 2.4,
      w: 5.1,
      h: 4.0,
      fontSize: 11,
    });
  }

  // ==========================================
  // SLIDE 6: Methodology & Architecture Workflow
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'End-to-End Enterprise Workflow Pipeline');

    const steps = [
      { step: 'STEP 1', title: 'Sales Order & MRP', desc: 'Customer PO confirmed &rarr; MRP II netting explodes BOM & schedules Purchase Orders.' },
      { step: 'STEP 2', title: 'Procurement & GRN', desc: 'Vendors supply raw materials &rarr; Inward Goods Receipt (GRN) increments stock.' },
      { step: 'STEP 3', title: 'Quality Gate & AQL', desc: 'ISO 2859-1 inspection sampling &rarr; Pass generates CoA; Fail triggers NCR.' },
      { step: 'STEP 4', title: 'Shop Floor & OEE', desc: 'Work Order routing dispatches &rarr; Real-time machine OEE tracking.' },
      { step: 'STEP 5', title: 'GL & Consolidation', desc: 'Shipment posted &rarr; Tax invoice generated &rarr; GL debits/credits balanced.' },
    ];

    steps.forEach((st, idx) => {
      const x = 0.8 + idx * 2.38;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y: 2.0,
        w: 2.2,
        h: 4.5,
        rectRadius: 0.1,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
      });

      slide.addText(st.step, {
        x: x + 0.15,
        y: 2.2,
        w: 1.9,
        h: 0.3,
        fontSize: 11,
        bold: true,
        color: ACCENT_BLUE,
        align: 'center',
      });
      slide.addText(st.title, {
        x: x + 0.15,
        y: 2.6,
        w: 1.9,
        h: 0.6,
        fontSize: 13,
        bold: true,
        color: TEXT_WHITE,
        align: 'center',
      });
      slide.addText(st.desc, {
        x: x + 0.15,
        y: 3.3,
        w: 1.9,
        h: 3.0,
        fontSize: 11,
        color: TEXT_MUTED,
        align: 'center',
      });
    });
  }

  // ==========================================
  // SLIDE 7: Technologies Used
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Technology Stack & Architectural Components');

    const techStack = [
      {
        category: 'Frontend Tier',
        items: ['React 18 (TypeScript)', 'Vite Fast Bundler', 'Tailwind CSS Modern Theme', 'Lucide React Icons', 'Axios HTTP Interceptors'],
        color: ACCENT_BLUE,
      },
      {
        category: 'Backend Tier',
        items: ['Node.js & Express.js', 'TypeScript Strict Mode', 'JWT Access/Refresh Auth', 'Zod Schema Validation', 'PDFKit Binary Generator'],
        color: ACCENT_GREEN,
      },
      {
        category: 'Data & Shared Layer',
        items: ['Prisma ORM Multi-Tenant', 'SQLite (Dev) / PostgreSQL (Prod)', '@forge-erp/shared Monorepo', 'Jest & Supertest Test Engine', 'RESTful OpenAPI 3.0 Standard'],
        color: ACCENT_AMBER,
      },
    ];

    techStack.forEach((tech, idx) => {
      const x = 0.8 + idx * 4.0;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y: 1.8,
        w: 3.7,
        h: 4.8,
        rectRadius: 0.1,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
      });
      slide.addText(tech.category, {
        x: x + 0.3,
        y: 2.1,
        w: 3.1,
        h: 0.5,
        fontSize: 16,
        bold: true,
        color: tech.color,
      });

      const bullets = tech.items.map(item => ({ text: `• ${item}\n\n`, options: { color: TEXT_WHITE } }));
      slide.addText(bullets, {
        x: x + 0.3,
        y: 2.8,
        w: 3.1,
        h: 3.5,
        fontSize: 12,
      });
    });
  }

  // ==========================================
  // SLIDE 8: System Implementation - Core Modules
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'System Implementation — Key Subsystems');

    const modules = [
      { name: '1. Manufacturing & OEE Control', details: 'Work orders routing, BOM recursive allocation, real-time Availability/Performance/Quality ISO 22400 calculations.' },
      { name: '2. Quality & NCR Defect Engine', details: 'ISO 2859-1 AQL sampling plans, in-process routing quality gates, dynamic Certificate of Analysis (CoA) generation.' },
      { name: '3. WMS & Bi-Directional Genealogy', details: 'Granular Bin/Rack storage, chronological inventory movements ledger, forward/backward lot recall ancestry trees.' },
      { name: '4. Financial Consolidation & CTA', details: 'Multi-subsidiary intercompany elimination entries, FX Cumulative Translation Adjustments (CTA), 100% balanced COA.' },
      { name: '5. SCM & 3-Way Matching Engine', details: 'Tolerance validation across PO line items, GRN physical receipts, and vendor invoices with anti-fraud safeguards.' },
      { name: '6. HR & Gross-to-Net Payroll Engine', details: 'Employee master registries, daily biometric attendance checks, and automated progressive tax/deduction payroll cycle.' },
    ];

    modules.forEach((mod, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.8 + col * 5.95;
      const y = 1.6 + row * 1.7;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y,
        w: 5.75,
        h: 1.5,
        rectRadius: 0.1,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
      });

      slide.addText(mod.name, {
        x: x + 0.3,
        y: y + 0.15,
        w: 5.15,
        h: 0.35,
        fontSize: 13,
        bold: true,
        color: ACCENT_BLUE,
      });
      slide.addText(mod.details, {
        x: x + 0.3,
        y: y + 0.55,
        w: 5.15,
        h: 0.85,
        fontSize: 11,
        color: TEXT_MUTED,
      });
    });
  }

  // ==========================================
  // SLIDE 9: Results & Performance Verification
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Verification, Test Results & Performance Metrics');

    const metrics = [
      { label: 'Total Unit & Integration Tests', val: '60 / 60 PASSED', color: ACCENT_GREEN },
      { label: 'Automated Test Suites', val: '10 / 10 (100%)', color: ACCENT_BLUE },
      { label: 'Double-Entry Balance Status', val: '100% Balanced', color: ACCENT_GREEN },
      { label: 'Genealogy Recall Query Speed', val: '< 15 ms', color: ACCENT_AMBER },
    ];

    metrics.forEach((m, idx) => {
      const x = 0.8 + idx * 2.95;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y: 1.8,
        w: 2.8,
        h: 1.8,
        rectRadius: 0.1,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
      });

      slide.addText(m.label, {
        x: x + 0.2,
        y: 2.0,
        w: 2.4,
        h: 0.5,
        fontSize: 11,
        bold: true,
        color: TEXT_MUTED,
        align: 'center',
      });
      slide.addText(m.val, {
        x: x + 0.2,
        y: 2.6,
        w: 2.4,
        h: 0.7,
        fontSize: 16,
        bold: true,
        color: m.color,
        align: 'center',
      });
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 3.9,
      w: 11.7,
      h: 2.7,
      rectRadius: 0.1,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
    });

    slide.addText('Test Suites Execution Highlights:', {
      x: 1.1,
      y: 4.1,
      w: 11.0,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: TEXT_WHITE,
    });

    slide.addText([
      { text: '✔ Advanced Enterprise Hardening: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'Depreciation MACRS, ASC 606 Amortization, GTS CIF tariffs, Event Bus.\n', options: { color: TEXT_MUTED } },
      { text: '✔ Domain Math Engines: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'BOM compounding scrap, Time-phased MRP II netting, ISO 22400 OEE, Multi-currency FIFO.\n', options: { color: TEXT_MUTED } },
      { text: '✔ Execution & Document Layer: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'Work Order issuance, Quality NCR gates, WMS bin putaway, Dynamic PDF generation (Invoices, CoA, Payslips).', options: { color: TEXT_MUTED } },
    ], {
      x: 1.1,
      y: 4.6,
      w: 11.0,
      h: 1.8,
      fontSize: 11,
    });
  }

  // ==========================================
  // SLIDE 10: Key Advantages
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Key Business & Technical Advantages');

    const advs = [
      { title: 'Sub-Second Defect Recall', desc: 'Instant forward and backward lot tracking prevents widespread product recalls and ensures full regulatory audit defense.' },
      { title: 'Anti-Fraud 3-Way Match', desc: 'Eliminates over-invoicing and rogue purchasing by strictly validating PO quantities and prices against warehouse receipts.' },
      { title: 'Automated Accounting & CTA', desc: 'Replaces weeks of manual month-end consolidation with real-time intercompany revenue/COGS eliminations and FX revaluations.' },
      { title: 'True Multi-Tenant Architecture', desc: 'Enforces complete row-level data isolation per organization with unified shared domain engines in a clean monorepo.' },
    ];

    advs.forEach((adv, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.8 + col * 5.95;
      const y = 1.8 + row * 2.4;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y,
        w: 5.75,
        h: 2.1,
        rectRadius: 0.1,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
      });

      slide.addText(`✔ ${adv.title}`, {
        x: x + 0.3,
        y: y + 0.2,
        w: 5.15,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: ACCENT_GREEN,
      });
      slide.addText(adv.desc, {
        x: x + 0.3,
        y: y + 0.7,
        w: 5.15,
        h: 1.2,
        fontSize: 12,
        color: TEXT_MUTED,
      });
    });
  }

  // ==========================================
  // SLIDE 11: Limitations & Future Scope
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Current Scope Boundaries & Future Roadmap');

    // Current Scope Limitations
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.6,
      w: 5.6,
      h: 5.0,
      rectRadius: 0.1,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
    });
    slide.addText('Current Project Boundaries', {
      x: 1.1,
      y: 1.8,
      w: 5.0,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: ACCENT_AMBER,
    });
    slide.addText([
      { text: '• Simulated Machine Telemetry: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'OEE runs on mathematical domain calculations rather than direct physical PLC hardware hooks.\n\n', options: { color: TEXT_MUTED } },
      { text: '• Web-First Interface: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Current deployment is optimized for desktop/tablet web dashboards without a native mobile app.\n\n', options: { color: TEXT_MUTED } },
      { text: '• Static Multi-Currency Rates: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'FX translation uses preset daily tables rather than a real-time live Bloomberg FX ticker API.', options: { color: TEXT_MUTED } },
    ], {
      x: 1.1,
      y: 2.3,
      w: 5.0,
      h: 4.0,
      fontSize: 11,
    });

    // Future Scope
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.8,
      y: 1.6,
      w: 5.7,
      h: 5.0,
      rectRadius: 0.1,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
    });
    slide.addText('Future Enhancement Scope', {
      x: 7.1,
      y: 1.8,
      w: 5.1,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: ACCENT_BLUE,
    });
    slide.addText([
      { text: '• IoT Sensor Integration: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Connect MQTT & OPC-UA machine telemetry for autonomous real-time downtime capture.\n\n', options: { color: TEXT_MUTED } },
      { text: '• AI Predictive Maintenance & Demand: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Machine Learning models for spindle failure prediction and seasonal sales forecasting.\n\n', options: { color: TEXT_MUTED } },
      { text: '• Native Mobile Barcode Scanning App: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Flutter/React Native app for warehouse bin putaway and camera QR lot tracking.', options: { color: TEXT_MUTED } },
    ], {
      x: 7.1,
      y: 2.3,
      w: 5.1,
      h: 4.0,
      fontSize: 11,
    });
  }

  // ==========================================
  // SLIDE 12: Conclusion & Key Takeaways
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Conclusion & Summary Takeaways');

    const conclusions = [
      { title: 'Architectural Completeness', desc: 'Successfully designed and implemented a production-grade Tier-1 ERP monorepo spanning 10 core enterprise modules with clean separation of concerns.' },
      { title: 'Engineering & Mathematical Rigor', desc: 'Incorporated critical industrial algorithms including MRP II time-phased netting, compounded scrap BOM, ISO 22400 OEE, and ASC 606 revenue amortization.' },
      { title: '100% Test Coverage & Audit Readiness', desc: 'Validated with 60 comprehensive automated tests passing with 0 errors, ensuring double-entry balance, 3-way match precision, and SOX 404 compliance.' },
    ];

    conclusions.forEach((c, idx) => {
      const y = 1.7 + idx * 1.6;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.8,
        y,
        w: 11.7,
        h: 1.4,
        rectRadius: 0.1,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
      });

      slide.addText(`0${idx + 1}. ${c.title}`, {
        x: 1.1,
        y: y + 0.15,
        w: 11.0,
        h: 0.35,
        fontSize: 14,
        bold: true,
        color: ACCENT_BLUE,
      });
      slide.addText(c.desc, {
        x: 1.1,
        y: y + 0.55,
        w: 11.0,
        h: 0.75,
        fontSize: 11,
        color: TEXT_MUTED,
      });
    });
  }

  // ==========================================
  // SLIDE 13: References
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'References & Industry Standards');

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.6,
      w: 11.7,
      h: 5.0,
      rectRadius: 0.1,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
    });

    slide.addText([
      { text: '1. ISO 22400-2:2014 Standard: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'Automation systems and integration — Key performance indicators (KPIs) for manufacturing operations management.\n\n', options: { color: TEXT_MUTED } },
      { text: '2. ISO 2859-1:1999 Standard: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'Sampling procedures for inspection by attributes — Part 1: Sampling schemes indexed by acceptance quality limit (AQL).\n\n', options: { color: TEXT_MUTED } },
      { text: '3. FASB ASC 606 & IFRS 15: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'Revenue from Contracts with Customers — 5-Step Model and Relative Standalone Selling Price Allocation.\n\n', options: { color: TEXT_MUTED } },
      { text: '4. Vollmann, T. E., et al.: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'Manufacturing Planning and Control for Supply Chain Management (APICS/CPIM Core Reference Series).\n\n', options: { color: TEXT_MUTED } },
      { text: '5. Modern Web Technologies: ', options: { bold: true, color: ACCENT_BLUE } },
      { text: 'React.js (ReactJS.org), Express.js (ExpressJS.com), Prisma ORM Documentation (Prisma.io), TypeScript (TypeScriptLang.org).', options: { color: TEXT_MUTED } },
    ], {
      x: 1.1,
      y: 1.9,
      w: 11.0,
      h: 4.4,
      fontSize: 11,
    });
  }

  // ==========================================
  // SLIDE 14: Thank You / Q&A Slide
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_COLOR };

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 2.0,
      y: 1.2,
      w: 9.3,
      h: 4.8,
      rectRadius: 0.2,
      fill: { color: CARD_BG },
      line: { color: '0284C7', width: 2 },
    });

    slide.addText('Thank You!', {
      x: 2.0,
      y: 2.0,
      w: 9.3,
      h: 1.0,
      fontSize: 44,
      fontFace: 'Arial',
      bold: true,
      color: TEXT_WHITE,
      align: 'center',
    });

    slide.addText('Questions & Answers (Q&A)', {
      x: 2.0,
      y: 3.1,
      w: 9.3,
      h: 0.6,
      fontSize: 20,
      fontFace: 'Arial',
      bold: true,
      color: ACCENT_BLUE,
      align: 'center',
    });

    slide.addText('ForgeERP — Next-Generation Tier-1 Manufacturing Platform\nLive Demo Available at http://localhost:3000', {
      x: 2.0,
      y: 3.9,
      w: 9.3,
      h: 0.8,
      fontSize: 13,
      fontFace: 'Arial',
      color: TEXT_MUTED,
      align: 'center',
    });
  }

  const outputPath = path.resolve(__dirname, '../ForgeERP_Project_Presentation.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`🎉 Presentation generated successfully at: ${outputPath}`);
}

createPresentation().catch(err => {
  console.error('Error generating presentation:', err);
  process.exit(1);
});
