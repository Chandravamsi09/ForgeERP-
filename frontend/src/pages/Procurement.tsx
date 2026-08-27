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
  ChevronRight
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
  vendor: Vendor;
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

export const Procurement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'vendors'>('orders');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showPOModal, setShowPOModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showGRNModal, setShowGRNModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  // Vendor form
  const [vendorForm, setVendorForm] = useState({
    code: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    paymentTerms: 'NET30',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [poRes, vendorRes] = await Promise.all([
        api.get('/procurement/purchase-orders'),
        api.get('/procurement/vendors'),
      ]);
      if (poRes.data?.success) setPurchaseOrders(poRes.data.data);
      if (vendorRes.data?.success) setVendors(vendorRes.data.data);
    } catch (err) {
      console.error('Failed to load procurement data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/procurement/vendors', vendorForm);
      setShowVendorModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create vendor');
    }
  };

  const handleSubmitPO = async (id: string) => {
    try {
      await api.post(`/procurement/purchase-orders/${id}/submit`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Submission failed');
    }
  };

  const handleApprovePO = async (id: string) => {
    try {
      await api.post(`/procurement/purchase-orders/${id}/approve`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Approval failed');
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-sky-400" />
            Procurement & Vendor Supply Chain
          </h1>
          <p className="text-sm text-slate-400">Manage vendor catalogs, purchase orders, and goods receipts</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVendorModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            Add Vendor
          </button>
          <button
            onClick={() => setShowPOModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/20 transition"
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
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'orders'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'vendors'
              ? 'border-sky-500 text-sky-400'
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
              {purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    No purchase orders recorded yet.
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-sky-400">{po.poNumber}</td>
                    <td className="px-6 py-4 font-medium text-white">{po.vendor?.companyName}</td>
                    <td className="px-6 py-4 text-center text-slate-400">{po.items?.length || 0}</td>
                    <td className="px-6 py-4 text-right font-mono">${po.subtotal.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400">
                      ${po.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(po.status)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {po.status === PurchaseOrderStatus.DRAFT && (
                        <button
                          onClick={() => handleSubmitPO(po.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-sky-600 hover:bg-sky-500 text-white"
                        >
                          Submit
                        </button>
                      )}
                      {po.status === PurchaseOrderStatus.SUBMITTED && (
                        <button
                          onClick={() => handleApprovePO(po.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Vendors Table */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vendors.map((v) => (
            <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
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
                <p className="text-xs font-mono text-sky-400">{v.code}</p>
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
    </div>
  );
};
