import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Receipt,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  CreditCard
} from 'lucide-react';
import { SalesOrderStatus, InvoiceStatus } from '@forge-erp/shared';

interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone?: string;
  creditLimit: number;
}

interface SalesOrder {
  id: string;
  soNumber: string;
  customer: Customer;
  warehouse: { name: string };
  status: SalesOrderStatus;
  totalAmount: number;
  createdAt: string;
  items: {
    product: { name: string; sku: string };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: Customer;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  dueDate: string;
  payments: { amount: number }[];
}

export const Sales: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'invoices' | 'customers'>('orders');
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    code: '',
    name: '',
    email: '',
    phone: '',
    creditLimit: 25000,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orderRes, invRes, custRes] = await Promise.all([
        api.get('/sales/orders'),
        api.get('/sales/invoices'),
        api.get('/sales/customers'),
      ]);
      if (orderRes.data?.success) setOrders(orderRes.data.data);
      if (invRes.data?.success) setInvoices(invRes.data.data);
      if (custRes.data?.success) setCustomers(custRes.data.data);
    } catch (err) {
      console.error('Failed to load sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/sales/customers', customerForm);
      setShowCustomerModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create customer');
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await api.post(`/sales/orders/${orderId}/confirm`);
      fetchData();
      alert('Order confirmed and inventory reserved successfully');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Order confirmation failed');
    }
  };

  const handleCreateInvoice = async (salesOrderId: string) => {
    try {
      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await api.post('/sales/invoices', { salesOrderId, dueDate, taxRate: 10 });
      fetchData();
      alert('Invoice generated successfully');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Invoice generation failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-7 h-7 text-sky-400" />
            Sales Order & Invoicing Platform
          </h1>
          <p className="text-sm text-slate-400">Order-to-Cash lifecycle, customer accounts, and revenue billing</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCustomerModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
          >
            <Users className="w-4 h-4 text-sky-400" />
            New Customer
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
          Sales Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'invoices'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Invoices & Billing ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'customers'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Customer Directory ({customers.length})
        </button>
      </div>

      {/* Sales Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">SO Number</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Warehouse</th>
                <th className="px-6 py-4 text-center">Items</th>
                <th className="px-6 py-4 text-right">Total Value</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    No sales orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-sky-400">{o.soNumber}</td>
                    <td className="px-6 py-4 font-medium text-white">{o.customer?.name}</td>
                    <td className="px-6 py-4 text-slate-400">{o.warehouse?.name}</td>
                    <td className="px-6 py-4 text-center text-slate-400">{o.items?.length || 0}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400">
                      ${o.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {o.status === SalesOrderStatus.PENDING && (
                        <button
                          onClick={() => handleConfirmOrder(o.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-sky-600 hover:bg-sky-500 text-white"
                        >
                          Confirm & Reserve
                        </button>
                      )}
                      {o.status === SalesOrderStatus.CONFIRMED && (
                        <button
                          onClick={() => handleCreateInvoice(o.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          Generate Invoice
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

      {/* Invoices Table */}
      {activeTab === 'invoices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-right">Subtotal</th>
                <th className="px-6 py-4 text-right">Tax (10%)</th>
                <th className="px-6 py-4 text-right">Total Due</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No invoices generated yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-sky-400">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 font-medium text-white">{inv.customer?.name}</td>
                    <td className="px-6 py-4 text-right font-mono">${inv.subtotal.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-mono text-slate-400">${inv.taxAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400">
                      ${inv.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Directory */}
      {activeTab === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customers.map((c) => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Users className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 font-semibold">
                  Limit: ${c.creditLimit.toLocaleString()}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{c.name}</h3>
                <p className="text-xs font-mono text-sky-400">{c.code}</p>
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <p>Email: {c.email}</p>
                {c.phone && <p>Phone: {c.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
