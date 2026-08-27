import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ShoppingCart,
  Plus,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  FileCheck,
  ChevronRight,
  Truck
} from 'lucide-react';
import { PurchaseOrderStatus } from '@forge-erp/shared';

interface Vendor {
  id: string;
  code: string;
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  paymentTerms: string;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: { companyName: string };
  status: PurchaseOrderStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
  items: {
    id: string;
    product: { name: string; sku: string };
    quantityOrdered: number;
    quantityReceived: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

const DEFAULT_VENDORS: Vendor[] = [
  { id: 'v_1', code: 'VEND-ALLOY-CORP', companyName: 'Global Special Steel & Alloy Foundries Ltd', contactName: 'Robert Vance, Chief Procurement Director', email: 'sales@alloyspecialsteel.com', paymentTerms: 'NET30' },
  { id: 'v_2', code: 'VEND-HYDRAULIC-IND', companyName: 'Precision Hydraulic Castings & Valves GmbH', contactName: 'Hans Gruber, Regional Sales Lead', email: 'h.gruber@hydraulicvalves.de', paymentTerms: 'NET45' },
];

const DEFAULT_POS: PurchaseOrder[] = [
  {
    id: 'po_1',
    poNumber: 'PO-2026-001',
    vendor: { companyName: 'Global Special Steel & Alloy Foundries Ltd' },
    status: PurchaseOrderStatus.APPROVED,
    subtotal: 25000.00,
    taxAmount: 2500.00,
    totalAmount: 27500.00,
    createdAt: new Date().toISOString(),
    items: [{ id: 'poi_1', product: { name: '4140 Chrome-Moly Alloy Steel Bar 65mm', sku: 'RAW-4140-BAR' }, quantityOrdered: 2000, quantityReceived: 2000, unitPrice: 12.50, totalPrice: 25000.00 }],
  },
  {
    id: 'po_2',
    poNumber: 'PO-2026-002',
    vendor: { companyName: 'Precision Hydraulic Castings & Valves GmbH' },
    status: PurchaseOrderStatus.SUBMITTED,
    subtotal: 8500.00,
    taxAmount: 850.00,
    totalAmount: 9350.00,
    createdAt: new Date().toISOString(),
    items: [{ id: 'poi_2', product: { name: 'High-Pressure Hydraulic Valve Body Casting', sku: 'RAW-VALVE-CAST' }, quantityOrdered: 100, quantityReceived: 0, unitPrice: 85.00, totalPrice: 8500.00 }],
  },
];

export const Procurement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'vendors'>('orders');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(DEFAULT_POS);
  const [vendors, setVendors] = useState<Vendor[]>(DEFAULT_VENDORS);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showPOModal, setShowPOModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);

  // Vendor form
  const [vendorForm, setVendorForm] = useState({
    code: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    paymentTerms: 'NET30',
  });

  // PO form
  const [poForm, setPOForm] = useState({
    vendorName: 'Global Special Steel & Alloy Foundries Ltd',
    productName: '4140 Chrome-Moly Alloy Steel Bar 65mm',
    quantity: 500,
    unitPrice: 12.50,
  });

  const fetchData = async () => {
    try {
      const [poRes, vendorRes] = await Promise.all([
        api.get('/procurement/purchase-orders'),
        api.get('/procurement/vendors'),
      ]);
      if (poRes.data?.success && poRes.data.data?.length > 0) setPurchaseOrders(poRes.data.data);
      if (vendorRes.data?.success && vendorRes.data.data?.length > 0) setVendors(vendorRes.data.data);
    } catch (err) {
      console.warn('Using default procurement records');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Vendor = {
      id: `v_local_${Date.now()}`,
      code: vendorForm.code.toUpperCase(),
      companyName: vendorForm.companyName,
      contactName: vendorForm.contactName,
      email: vendorForm.email,
      phone: vendorForm.phone,
      paymentTerms: vendorForm.paymentTerms,
    };
    setVendors([created, ...vendors]);
    setShowVendorModal(false);
    setVendorForm({ code: '', companyName: '', contactName: '', email: '', phone: '', paymentTerms: 'NET30' });
    alert(`Vendor '${created.companyName}' added successfully!`);
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(poForm.quantity);
    const price = Number(poForm.unitPrice);
    const sub = qty * price;
    const tax = sub * 0.1;
    const total = sub + tax;

    const created: PurchaseOrder = {
      id: `po_local_${Date.now()}`,
      poNumber: `PO-2026-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      vendor: { companyName: poForm.vendorName },
      status: PurchaseOrderStatus.DRAFT,
      subtotal: sub,
      taxAmount: tax,
      totalAmount: total,
      createdAt: new Date().toISOString(),
      items: [
        {
          id: `poi_local_${Date.now()}`,
          product: { name: poForm.productName, sku: 'RAW-ALLOY-STOCK' },
          quantityOrdered: qty,
          quantityReceived: 0,
          unitPrice: price,
          totalPrice: sub,
        },
      ],
    };

    setPurchaseOrders([created, ...purchaseOrders]);
    setShowPOModal(false);
    alert(`Purchase Order ${created.poNumber} created successfully!`);
  };

  const handleSubmitPO = (id: string) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: PurchaseOrderStatus.SUBMITTED } : p))
    );
    alert('Purchase Order submitted for managerial approval!');
  };

  const handleApprovePO = (id: string) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: PurchaseOrderStatus.APPROVED } : p))
    );
    alert('Purchase Order approved for warehouse delivery & 3-way matching!');
  };

  const getStatusBadge = (status: PurchaseOrderStatus) => {
    switch (status) {
      case PurchaseOrderStatus.DRAFT:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">DRAFT</span>;
      case PurchaseOrderStatus.SUBMITTED:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">PENDING APPROVAL</span>;
      case PurchaseOrderStatus.APPROVED:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">APPROVED</span>;
      case PurchaseOrderStatus.FULFILLED:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">FULFILLED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck className="w-7 h-7 text-sky-400" />
            Procurement & Vendor Supply Chain
          </h1>
          <p className="text-sm text-slate-400">Manage vendor catalogs, purchase orders, and goods receipts</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVendorModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            Add Vendor
          </button>
          <button
            onClick={() => setShowPOModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Purchase Order
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'vendors'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Vendor Directory ({vendors.length})
        </button>
      </div>

      {/* Purchase Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">PO Number</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4 text-center">Items</th>
                <th className="px-6 py-4 text-right">Subtotal</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-sky-400">{po.poNumber}</td>
                  <td className="px-6 py-4 font-medium text-white">{po.vendor?.companyName}</td>
                  <td className="px-6 py-4 text-center text-slate-400">{po.items?.length || 1}</td>
                  <td className="px-6 py-4 text-right font-mono">${po.subtotal.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400">
                    ${po.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">{getStatusBadge(po.status)}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {po.status === PurchaseOrderStatus.DRAFT && (
                      <button
                        onClick={() => handleSubmitPO(po.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-sky-600 hover:bg-sky-500 text-white cursor-pointer"
                      >
                        Submit
                      </button>
                    )}
                    {po.status === PurchaseOrderStatus.SUBMITTED && (
                      <button
                        onClick={() => handleApprovePO(po.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Vendors Table */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendors.map((v) => (
            <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 font-mono">
                  {v.paymentTerms}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{v.companyName}</h3>
                <p className="text-xs font-mono text-sky-400 font-bold">{v.code}</p>
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <p>Contact: {v.contactName || 'Primary Representative'}</p>
                <p>Email: {v.email}</p>
                {v.phone && <p>Phone: {v.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create PO */}
      {showPOModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-sky-400" />
              Create Purchase Order
            </h3>
            <form onSubmit={handleCreatePO} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Vendor</label>
                <select
                  value={poForm.vendorName}
                  onChange={(e) => setPOForm({ ...poForm, vendorName: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.companyName}>
                      {v.companyName} ({v.paymentTerms})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Raw Material / Product</label>
                <input
                  type="text"
                  required
                  value={poForm.productName}
                  onChange={(e) => setPOForm({ ...poForm, productName: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={poForm.quantity}
                    onChange={(e) => setPOForm({ ...poForm, quantity: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={poForm.unitPrice}
                    onChange={(e) => setPOForm({ ...poForm, unitPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPOModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Vendor */}
      {showVendorModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-400" />
              Register Supplier / Vendor
            </h3>
            <form onSubmit={handleCreateVendor} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Vendor Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VEND-TITAN-FOUNDRY"
                  value={vendorForm.code}
                  onChange={(e) => setVendorForm({ ...vendorForm, code: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 uppercase font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Company Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Titan Industrial Alloy Foundries Ltd"
                  value={vendorForm.companyName}
                  onChange={(e) => setVendorForm({ ...vendorForm, companyName: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={vendorForm.contactName}
                    onChange={(e) => setVendorForm({ ...vendorForm, contactName: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="sales@supplier.com"
                    value={vendorForm.email}
                    onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowVendorModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
