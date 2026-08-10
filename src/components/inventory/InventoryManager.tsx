import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product, BusinessCategory } from '../../types';
import {
  Package,
  Leaf,
  Coffee,
  Utensils,
  Search,
  Plus,
  AlertTriangle,
  History,
  Edit2,
  Check,
  X,
  FileSpreadsheet,
  Trash2,
  ImageIcon,
} from 'lucide-react';
import { AddEditProductModal } from './AddEditProductModal';

export const InventoryManager: React.FC = () => {
  const { products, deleteProduct, adjustStock, stockMovements, currentUser } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Product Modal State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [productToEditModal, setProductToEditModal] = useState<Product | null>(null);

  // Stock Adjustment Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newQty, setNewQty] = useState<number>(0);
  const [reason, setReason] = useState('สินค้าเสียหาย/ชื้น');

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setProductToEditModal(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setProductToEditModal(prod);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteProduct = (prod: Product) => {
    if (window.confirm(`คุณต้องการลบรายการเมนู/สินค้า "${prod.name}" ใช่หรือไม่?`)) {
      deleteProduct(prod.id);
    }
  };

  const handleSaveStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!reason.trim()) {
      alert('กรุณาระบุเหตุผลการปรับปรุงสต็อก (Mandatory Reason)');
      return;
    }

    adjustStock(
      editingProduct.id,
      newQty,
      reason,
      editingProduct.cannabisDetails?.activeLotId
    );

    setEditingProduct(null);
    alert('ปรับปรุงสต็อกเเละบันทึก Audit Log เรียบร้อยแล้ว');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-indigo-50/80 p-6 rounded-2xl border border-indigo-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-2xl border border-indigo-200 text-indigo-700">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              ระบบคลังสินค้าเเละจัดการเมนู (Multi-Business Warehouse & Menu Management)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              จัดกลุ่มคลังสินค้าตามธุรกิจ (🌿 กัญชา | 🥤 กระท่อม | 🍜 อาหาร | 📦 สินค้าทั่วไป) พร้อมระบบเพิ่มเมนูและแนบรูปภาพ
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มเมนู / สินค้าใหม่ (Add Menu)</span>
        </button>
      </div>

      {/* Category Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setSelectedCategory('cannabis')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              selectedCategory === 'cannabis'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            🌿 กัญชา (Cannabis)
          </button>
          <button
            onClick={() => setSelectedCategory('kratom')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              selectedCategory === 'kratom'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            🥤 กระท่อม (Kratom)
          </button>
          <button
            onClick={() => setSelectedCategory('food')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              selectedCategory === 'food'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            🍜 อาหาร (Food)
          </button>
          <button
            onClick={() => setSelectedCategory('general')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              selectedCategory === 'general'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            📦 สินค้าทั่วไป
          </button>
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">SKU / รหัส</th>
                <th className="p-3">ชื่อสินค้า</th>
                <th className="p-3">หมวดหมู่</th>
                <th className="p-3 text-right">ราคาขาย</th>
                <th className="p-3 text-right">ต้นทุน</th>
                <th className="p-3 text-right">จำนวนคงเหลือ</th>
                <th className="p-3 text-center">สถานะสต็อก</th>
                <th className="p-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => {
                const isLow = prod.stockQuantity < prod.minStockAlert;
                const isOut = prod.stockQuantity <= 0;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono text-slate-500">{prod.code}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        {prod.image ? (
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 flex-shrink-0 text-xs">
                            {prod.category === 'cannabis'
                              ? '🌿'
                              : prod.category === 'kratom'
                              ? '🥤'
                              : prod.category === 'food'
                              ? '🍜'
                              : '📦'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{prod.name}</div>
                          {prod.subcategory && (
                            <div className="text-[10px] text-slate-400 font-medium">
                              {prod.subcategory}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                        {prod.category}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-700 font-bold">
                      ฿{prod.price.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-500">
                      ฿{prod.cost.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono font-extrabold text-sm text-slate-900">
                      {prod.stockQuantity} {prod.stockUnit}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isOut
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : isLow
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {isOut ? 'หมด' : isLow ? 'สต็อกต่ำ' : 'ปกติ'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          title="แก้ไขรายละเอียดและรูปภาพเมนู"
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-semibold border border-indigo-200 inline-flex items-center space-x-1 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>แก้ไขเมนู</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setNewQty(prod.stockQuantity);
                          }}
                          title="ปรับจำนวนสต็อก"
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 inline-flex items-center space-x-1 transition"
                        >
                          <Package className="w-3.5 h-3.5 text-slate-600" />
                          <span>ปรับสต็อก</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(prod)}
                          title="ลบรายการสินค้า"
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-1 rounded-lg text-xs font-semibold border border-rose-200 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AddEditProductModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        productToEdit={productToEditModal}
      />

      {/* Adjust Stock Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">ปรับปรุงสต็อกสินค้า</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStockAdjustment} className="mt-4 space-y-3 text-xs">
              <div>
                <p className="font-bold text-indigo-800 text-sm">{editingProduct.name}</p>
                <p className="text-slate-500">
                  จำนวนปัจจุบัน: {editingProduct.stockQuantity} {editingProduct.stockUnit}
                </p>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  ระบุจำนวนคงเหลือใหม่ ({editingProduct.stockUnit}):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newQty}
                  onChange={(e) => setNewQty(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white text-slate-800 text-lg font-mono font-bold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  เหตุผลในการปรับปรุง (Mandatory Audit Reason):
                </label>
                <input
                  type="text"
                  placeholder="เช่น สินค้าชื้นเสียหาย, ตรวจนับสต็อกประจำเดือน"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl border border-slate-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  บันทึกการปรับปรุง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
