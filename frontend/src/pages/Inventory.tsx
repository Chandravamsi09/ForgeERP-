import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Boxes,
  Plus,
  AlertTriangle,
  ArrowRightLeft,
  Search,
  Warehouse as WarehouseIcon,
  PackageCheck
} from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  unitOfMeasure: string;
  costPrice: number;
  sellingPrice: number;
  minStockLevel: number;
  category: { id: string; name: string };
  stockLevels: {
    id: string;
    warehouseId: string;
    quantityOnHand: number;
    quantityReserved: number;
    quantityAvailable: number;
    warehouse: { id: string; name: string; code: string };
  }[];
}

interface Warehouse {
  id: string;
  code: string;
  name: string;
  location?: string;
  isPrimary: boolean;
}

interface LowStockAlert {
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

export const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'warehouses' | 'transfers' | 'alerts'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Form states
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    categoryId: '',
    costPrice: 0,
    sellingPrice: 0,
    minStockLevel: 10,
    unitOfMeasure: 'units',
  });

  const [transferForm, setTransferForm] = useState({
    sourceWarehouseId: '',
    targetWarehouseId: '',
    productId: '',
    quantity: 1,
    notes: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, whRes, alertRes] = await Promise.all([
        api.get('/inventory/products', { params: { search } }),
        api.get('/inventory/warehouses'),
        api.get('/inventory/alerts/low-stock'),
      ]);
      if (prodRes.data?.success) setProducts(prodRes.data.data);
      if (whRes.data?.success) setWarehouses(whRes.data.data);
      if (alertRes.data?.success) setAlerts(alertRes.data.data);
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory/products', newProduct);
      setShowProductModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create product');
    }
  };

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory/transfers', {
        sourceWarehouseId: transferForm.sourceWarehouseId,
        targetWarehouseId: transferForm.targetWarehouseId,
        items: [{ productId: transferForm.productId, quantity: Number(transferForm.quantity) }],
        notes: transferForm.notes,
      });
      setShowTransferModal(false);
      fetchData();
      alert('Stock transfer initiated successfully');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Stock transfer failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Boxes className="w-7 h-7 text-sky-400" />
            Inventory & Warehouse Management
          </h1>
          <p className="text-sm text-slate-400">Track finished goods, raw materials, SKUs, and warehouse transfers</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
          >
            <ArrowRightLeft className="w-4 h-4 text-sky-400" />
            Stock Transfer
          </button>
          <button
            onClick={() => setShowProductModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            Add SKU / Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'products'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          SKU Catalog & Stock ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'warehouses'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Warehouses ({warehouses.length})
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'alerts'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Low-Stock Alerts ({alerts.length})
        </button>
      </div>

      {/* Search Bar */}
      {activeTab === 'products' && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by SKU or Product Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === 'products' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">SKU / Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Cost</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">On Hand</th>
                <th className="px-6 py-4 text-center">Reserved</th>
                <th className="px-6 py-4 text-center">Available</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                    No products found. Click "Add SKU / Product" to create your first item.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const onHand = p.stockLevels?.reduce((sum, s) => sum + s.quantityOnHand, 0) || 0;
                  const reserved = p.stockLevels?.reduce((sum, s) => sum + s.quantityReserved, 0) || 0;
                  const available = p.stockLevels?.reduce((sum, s) => sum + s.quantityAvailable, 0) || 0;
                  const isLow = available <= p.minStockLevel;

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs font-mono text-sky-400">{p.sku}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{p.category?.name || 'Standard'}</td>
                      <td className="px-6 py-4 text-right font-mono">${p.costPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-mono text-emerald-400 font-semibold">
                        ${p.sellingPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center font-bold">{onHand}</td>
                      <td className="px-6 py-4 text-center text-slate-400">{reserved}</td>
                      <td className="px-6 py-4 text-center font-bold text-sky-400">{available}</td>
                      <td className="px-6 py-4 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <PackageCheck className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Warehouses Tab */}
      {activeTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <WarehouseIcon className="w-5 h-5" />
                </div>
                {wh.isPrimary && (
                  <span className="px-2 py-0.5 rounded text-xs bg-sky-500/20 text-sky-300 font-semibold">
                    Primary Facility
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{wh.name}</h3>
                <p className="text-xs font-mono text-sky-400">{wh.code}</p>
                <p className="text-xs text-slate-400 mt-1">{wh.location || 'Central Distribution Center'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Low-Stock Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              ✅ All product inventories are healthy above required minimum thresholds.
            </div>
          ) : (
            alerts.map((alertItem) => (
              <div
                key={alertItem.productId}
                className="bg-slate-900 border border-amber-500/20 rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{alertItem.name}</h4>
                    <p className="text-xs text-slate-400">
                      SKU: <span className="text-sky-400 font-mono">{alertItem.sku}</span> | Min Threshold:{' '}
                      <span className="font-semibold text-slate-200">{alertItem.minStockLevel}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold uppercase text-amber-400">
                    Deficit: {alertItem.deficit} units
                  </span>
                  <p className="text-sm font-bold text-slate-100 mt-0.5">
                    Available: {alertItem.totalAvailable} / On-Hand: {alertItem.totalOnHand}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
