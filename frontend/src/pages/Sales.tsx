import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ShoppingCart,
  Plus,
  FileText,
  Users,
  Receipt,
  CheckCircle,
  Clock,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { ICustomer, ISalesOrder, SalesOrderStatus } from '@forge-erp/shared';

const DEFAULT_CUSTOMERS: ICustomer[] = [
  { id: 'c_1', code: 'CUST-AEROTECH', name: 'AeroTech Commercial Aircraft Systems Corp', email: 'customer1@example.com', phone: '+1-555-0103', creditLimit: 500000.0 },
  { id: 'c_2', code: 'CUST-TITAN-HEAVY', name: 'Titan Heavy Mining & Earthmoving Equipment Ltd', email: 'customer2@example.com', phone: '+1-555-0104', creditLimit: 750000.0 },
];

const DEFAULT_ORDERS: ISalesOrder[] = [
  {
    id: 'so_1',
    orderNumber: 'SO-2026-001',
    customer: { name: 'AeroTech Commercial Aircraft Systems Corp' },
    status: SalesOrderStatus.CONFIRMED,
    subtotal: 48000.00,
    taxAmount: 4800.00,
    totalAmount: 52800.00,
    createdAt: new Date().toISOString(),
    items: [{ id: 'soi_1', product: { name: 'Precision Helical Pinion Gear 40-Tooth' }, quantity: 150, unitPrice: 320.00, totalPrice: 48000.00 }],
  },
  {
    id: 'so_2',
    orderNumber: 'SO-2026-002',
    customer: { name: 'Titan Heavy Mining & Earthmoving Equipment Ltd' },
    status: SalesOrderStatus.DELIVERED,
    subtotal: 85500.00,
    taxAmount: 8550.00,
    totalAmount: 94050.00,
    createdAt: new Date().toISOString(),
    items: [{ id: 'soi_2', product: { name: 'Turbine Rotor Transmission Shaft 1200mm' }, quantity: 90, unitPrice: 950.00, totalPrice: 85500.00 }],
  },
];

export const Sales: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'customers'>('orders');
  const [orders, setOrders] = useState<ISalesOrder[]>(DEFAULT_ORDERS);
  const [customers, setCustomers] = useState<ICustomer[]>(DEFAULT_CUSTOMERS);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    code: '',
    name: '',
    email: '',
    creditLimit: 250000,
  });

  const [orderForm, setOrderForm] = useState({
    customerName: 'AeroTech Commercial Aircraft Systems Corp',
    productName: 'Precision Helical Pinion Gear 40-Tooth',
    quantity: 100,
    unitPrice: 320.00,
  });

  const fetchData = async () => {
    try {
      const [orderRes, custRes] = await Promise.all([
        api.get('/sales/orders'),
        api.get('/sales/customers'),
      ]);
      if (orderRes.data?.success && orderRes.data.data?.length > 0) setOrders(orderRes.data.data);
      if (custRes.data?.success && custRes.data.data?.length > 0) setCustomers(custRes.data.data);
    } catch (err) {
      console.warn('Using default sales records');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ICustomer = {
      id: `c_local_${Date.now()}`,
      code: customerForm.code.toUpperCase(),
      name: customerForm.name,
      email: customerForm.email,
      creditLimit: Number(customerForm.creditLimit),
    };
    setCustomers([created, ...customers]);
    setShowCustomerModal(false);
    setCustomerForm({ code: '', name: '', email: '', creditLimit: 250000 });
    alert(`Customer '${created.name}' registered successfully!`);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(orderForm.quantity);
    const price = Number(orderForm.unitPrice);
    const sub = qty * price;
    const tax = sub * 0.1;
    const total = sub + tax;

    const created: ISalesOrder = {
      id: `so_local_${Date.now()}`,
      orderNumber: `SO-2026-${String(orders.length + 1).padStart(3, '0')}`,
      customer: { name: orderForm.customerName },
      status: SalesOrderStatus.CONFIRMED,
      subtotal: sub,
      taxAmount: tax,
      totalAmount: total,
      createdAt: new Date().toISOString(),
      items: [{ id: `soi_local_${Date.now()}`, product: { name: orderForm.productName }, quantity: qty, unitPrice: price, totalPrice: sub }],
    };

    setOrders([created, ...orders]);
    setShowOrderModal(false);
    alert(`Sales Order ${created.orderNumber} placed and confirmed!`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-sky-400" />
            Order-to-Cash & Sales Operations
          </h1>
          <p className="text-sm text-slate-400">Quotations, customer orders, tax invoices, and revenue accounting</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCustomerModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition cursor-pointer"
          >
            <Users className="w-4 h-4 text-sky-400" />
            Add Customer
          </button>
          <button
            onClick={() => setShowOrderModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Sales Order
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
          Sales Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'customers'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Customer Directory ({customers.length})
        </button>
      </div>

      {/* Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-right">Subtotal</th>
                <th className="px-6 py-4 text-right">Tax (10%)</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-sky-400">{o.orderNumber}</td>
                  <td className="px-6 py-4 font-medium text-white">{o.customer?.name}</td>
                  <td className="px-6 py-4 text-right font-mono">${o.subtotal.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-400">${o.taxAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400">
                    ${o.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customers Table */}
      {activeTab === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customers.map((c) => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Users className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  Credit Limit: ${c.creditLimit.toLocaleString()}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{c.name}</h3>
                <p className="text-xs font-mono text-sky-400 font-bold">{c.code}</p>
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <p>Email: {c.email}</p>
                {c.phone && <p>Phone: {c.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Order */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-sky-400" />
              Create Sales Order
            </h3>
            <form onSubmit={handleCreateOrder} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Customer</label>
                <select
                  value={orderForm.customerName}
                  onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Product Description</label>
                <input
                  type="text"
                  required
                  value={orderForm.productName}
                  onChange={(e) => setOrderForm({ ...orderForm, productName: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Order Qty</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({ ...orderForm, quantity: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={orderForm.unitPrice}
                    onChange={(e) => setOrderForm({ ...orderForm, unitPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Confirm Sales Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Customer */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" />
              Register Corporate Customer
            </h3>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Customer Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CUST-BOEING-DEF"
                  value={customerForm.code}
                  onChange={(e) => setCustomerForm({ ...customerForm, code: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 uppercase font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Boeing Aerospace & Defense Systems"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="customer@example.com"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Credit Limit ($)</label>
                  <input
                    type="number"
                    required
                    value={customerForm.creditLimit}
                    onChange={(e) => setCustomerForm({ ...customerForm, creditLimit: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
