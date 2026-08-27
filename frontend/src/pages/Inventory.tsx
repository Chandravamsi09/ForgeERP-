import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Boxes,
  Plus,
  AlertTriangle,
  ArrowRightLeft,
  Search,
  Warehouse as WarehouseIcon,
  PackageCheck,
  CheckCircle2,
  Layers
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

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    sku: 'RAW-4140-BAR',
    name: '4140 Chrome-Moly Alloy Steel Bar 65mm',
    unitOfMeasure: 'KG',
    costPrice: 12.50,
    sellingPrice: 19.50,
    minStockLevel: 250,
    category: { id: 'cat_1', name: 'Raw Alloy Stock' },
    stockLevels: [
      { id: 'sl_1', warehouseId: 'wh_1', quantityOnHand: 1850, quantityReserved: 200, quantityAvailable: 1650, warehouse: { id: 'wh_1', name: 'Main Plant Advanced Logistics Center', code: 'WH-MAIN-PLANT' } }
    ]
  },
  {
    id: 'prod_2',
    sku: 'FG-HEAVY-GEAR-40T',
    name: 'Precision Helical Pinion Gear 40-Tooth',
    unitOfMeasure: 'PCS',
    costPrice: 145.00,
    sellingPrice: 320.00,
    minStockLevel: 20,
    category: { id: 'cat_2', name: 'Precision Machined' },
    stockLevels: [
      { id: 'sl_2', warehouseId: 'wh_1', quantityOnHand: 85, quantityReserved: 15, quantityAvailable: 70, warehouse: { id: 'wh_1', name: 'Main Plant Advanced Logistics Center', code: 'WH-MAIN-PLANT' } }
    ]
  },
  {
    id: 'prod_3',
    sku: 'FG-ROTOR-SHAFT',
    name: 'Turbine Rotor Transmission Shaft 1200mm',
    unitOfMeasure: 'PCS',
    costPrice: 480.00,
    sellingPrice: 950.00,
    minStockLevel: 10,
    category: { id: 'cat_2', name: 'Precision Machined' },
    stockLevels: [
      { id: 'sl_3', warehouseId: 'wh_1', quantityOnHand: 34, quantityReserved: 8, quantityAvailable: 26, warehouse: { id: 'wh_1', name: 'Main Plant Advanced Logistics Center', code: 'WH-MAIN-PLANT' } }
    ]
  },
  {
    id: 'prod_4',
    sku: 'RAW-VALVE-CAST',
    name: 'High-Pressure Hydraulic Valve Body Casting',
    unitOfMeasure: 'PCS',
    costPrice: 85.00,
    sellingPrice: 140.00,
    minStockLevel: 50,
    category: { id: 'cat_1', name: 'Raw Alloy Stock' },
    stockLevels: [
      { id: 'sl_4', warehouseId: 'wh_1', quantityOnHand: 28, quantityReserved: 5, quantityAvailable: 23, warehouse: { id: 'wh_1', name: 'Main Plant Advanced Logistics Center', code: 'WH-MAIN-PLANT' } }
    ]
  }
];

const DEFAULT_WAREHOUSES: Warehouse[] = [
  { id: 'wh_1', code: 'WH-MAIN-PLANT', name: 'Main Plant Advanced Logistics Center', location: 'Building A, High-Tech Industrial Park', isPrimary: true },
  { id: 'wh_2', code: 'WH-ASSEMBLY-BAY', name: 'Final Assembly & QA Staging Hub', location: 'Bay 4, Cleanroom Facility', isPrimary: false }
];

const DEFAULT_ALERTS: LowStockAlert[] = [
  {
    productId: 'prod_4',
    sku: 'RAW-VALVE-CAST',
    name: 'High-Pressure Hydraulic Valve Body Casting',
    category: 'Raw Alloy Stock',
    minStockLevel: 50,
    totalOnHand: 28,
    totalAvailable: 23,
    isCritical: true,
    deficit: 27,
  }
];

export const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'warehouses' | 'alerts'>('products');
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(DEFAULT_WAREHOUSES);
  const [alerts, setAlerts] = useState<LowStockAlert[]>(DEFAULT_ALERTS);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Form states
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    categoryName: 'Precision Machined',
    costPrice: 50,
    sellingPrice: 120,
    minStockLevel: 15,
    unitOfMeasure: 'PCS',
    initialStock: 100,
  });

  const [transferForm, setTransferForm] = useState({
    sourceWarehouse: 'Main Plant Advanced Logistics Center',
    targetWarehouse: 'Final Assembly & QA Staging Hub',
    productSku: 'FG-HEAVY-GEAR-40T',
    quantity: 10,
    notes: 'Urgent staging for shop floor assembly',
  });

  const fetchData = async () => {
    try {
      const [prodRes, whRes] = await Promise.all([
        api.get('/inventory/products', { params: { search } }),
        api.get('/inventory/warehouses'),
      ]);
      if (prodRes.data?.success && prodRes.data.data?.length > 0) {
        setProducts(prodRes.data.data);
      }
      if (whRes.data?.success && whRes.data.data?.length > 0) {
        setWarehouses(whRes.data.data);
      }
    } catch (err) {
      console.warn('Using default inventory records');
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `prod_local_${Date.now()}`,
      sku: newProduct.sku.toUpperCase(),
      name: newProduct.name,
      unitOfMeasure: newProduct.unitOfMeasure,
      costPrice: Number(newProduct.costPrice),
      sellingPrice: Number(newProduct.sellingPrice),
      minStockLevel: Number(newProduct.minStockLevel),
      category: { id: 'cat_new', name: newProduct.categoryName },
      stockLevels: [
        {
          id: `sl_${Date.now()}`,
          warehouseId: 'wh_1',
          quantityOnHand: Number(newProduct.initialStock),
          quantityReserved: 0,
          quantityAvailable: Number(newProduct.initialStock),
          warehouse: { id: 'wh_1', name: 'Main Plant Advanced Logistics Center', code: 'WH-MAIN-PLANT' },
        },
      ],
    };

    setProducts([created, ...products]);
    setShowProductModal(false);
    setNewProduct({
      sku: '',
      name: '',
      categoryName: 'Precision Machined',
      costPrice: 50,
      sellingPrice: 120,
      minStockLevel: 15,
      unitOfMeasure: 'PCS',
      initialStock: 100,
    });
    alert(`SKU ${created.sku} added successfully!`);
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(transferForm.quantity);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.sku === transferForm.productSku) {
          const updatedLevels = p.stockLevels.map((sl) => ({
            ...sl,
            quantityOnHand: Math.max(0, sl.quantityOnHand - qty),
            quantityAvailable: Math.max(0, sl.quantityAvailable - qty),
          }));
          return { ...p, stockLevels: updatedLevels };
        }
        return p;
      })
    );
    setShowTransferModal(false);
    alert(`Stock Transfer of ${qty} units of ${transferForm.productSku} completed successfully!`);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
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
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4 text-sky-400" />
            Stock Transfer
          </button>
          <button
            onClick={() => setShowProductModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/20 transition cursor-pointer"
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
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'products'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          SKU Catalog & Stock ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'warehouses'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Warehouses ({warehouses.length})
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'alerts'
              ? 'border-amber-500 text-amber-400 font-bold'
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
              placeholder="Search by SKU, Name, or Category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      )}

      {/* Tab Contents: Products */}
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
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                    No products matched your search. Click "Add SKU / Product" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <WarehouseIcon className="w-5 h-5" />
                </div>
                {wh.isPrimary && (
                  <span className="px-2.5 py-1 rounded-full text-xs bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                    Primary Facility
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{wh.name}</h3>
                <p className="text-xs font-mono text-sky-400 font-bold">{wh.code}</p>
                <p className="text-xs text-slate-400 mt-1">{wh.location || 'Central Distribution Center'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Low-Stock Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map((alertItem) => (
            <div
              key={alertItem.productId}
              className="bg-slate-900 border border-amber-500/20 rounded-xl p-5 flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{alertItem.name}</h4>
                  <p className="text-xs text-slate-400">
                    SKU: <span className="text-sky-400 font-mono font-bold">{alertItem.sku}</span> | Min Threshold:{' '}
                    <span className="font-semibold text-slate-200">{alertItem.minStockLevel} Units</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold uppercase text-amber-400">
                  Deficit: {alertItem.deficit} units below buffer
                </span>
                <p className="text-sm font-bold text-slate-100 mt-0.5">
                  Available: <span className="text-amber-400">{alertItem.totalAvailable}</span> / On-Hand: {alertItem.totalOnHand}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add SKU / Product */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-400" />
              Add SKU / Product Item
            </h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">SKU Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FG-HYDRAULIC-PUMP"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 uppercase font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Hydraulic Pressure Pump"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Cost Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.costPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.sellingPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProduct.initialStock}
                    onChange={(e) => setNewProduct({ ...newProduct, initialStock: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Min Stock Buffer</label>
                  <input
                    type="number"
                    required
                    value={newProduct.minStockLevel}
                    onChange={(e) => setNewProduct({ ...newProduct, minStockLevel: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Stock Transfer */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-sky-400" />
              Transfer Stock Between Facilities
            </h3>
            <form onSubmit={handleCreateTransfer} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Source Facility</label>
                <input
                  type="text"
                  readOnly
                  value={transferForm.sourceWarehouse}
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Destination Facility</label>
                <select
                  value={transferForm.targetWarehouse}
                  onChange={(e) => setTransferForm({ ...transferForm, targetWarehouse: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                >
                  <option value="Final Assembly & QA Staging Hub">Final Assembly & QA Staging Hub</option>
                  <option value="Main Plant Advanced Logistics Center">Main Plant Advanced Logistics Center</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Product SKU</label>
                <select
                  value={transferForm.productSku}
                  onChange={(e) => setTransferForm({ ...transferForm, productSku: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 font-mono"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.sku}>
                      {p.sku} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Transfer Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transferForm.quantity}
                  onChange={(e) => setTransferForm({ ...transferForm, quantity: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Complete Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
