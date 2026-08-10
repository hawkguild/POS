import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product, BusinessCategory, Customer } from '../../types';
import {
  Leaf,
  Coffee,
  Utensils,
  Package,
  Search,
  Plus,
  Minus,
  Trash2,
  UserCheck,
  ShieldCheck,
  CreditCard,
  QrCode,
  DollarSign,
  ArrowRight,
  Barcode,
  Sparkles,
  FileText,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';

export const POSTerminal: React.FC = () => {
  const {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    updateCartDiscount,
    updateCartNotes,
    clearCart,
    customers,
    shopSettings,
    cannabisLots,
    kratomBatches,
  } = usePOS();

  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  
  // Cart-level selections
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [ageVerified, setAgeVerified] = useState(true);
  const [patientNote, setPatientNote] = useState('');
  const [prescriptionRef, setPrescriptionRef] = useState('');
  
  // Cannabis weight modal selector
  const [selectedCannabisProduct, setSelectedCannabisProduct] = useState<Product | null>(null);
  const [customGramWeight, setCustomGramWeight] = useState<number>(1);
  const [selectedLotId, setSelectedLotId] = useState<string>('');

  // Payment & Receipt Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cannabisDetails?.strain?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Cart Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce((acc, item) => acc + item.discount, 0);
  const netTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const taxAmount = (netTotal * shopSettings.vatPercent) / (100 + shopSettings.vatPercent);

  // Cannabis Items in Cart check
  const hasCannabisInCart = cart.some((item) => item.category === 'cannabis');
  const totalCannabisWeightGrams = cart
    .filter((item) => item.category === 'cannabis')
    .reduce((acc, item) => acc + item.quantity, 0);

  // Barcode Handler
  const handleBarcodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const foundProduct = products.find(
      (p) => p.code.toLowerCase() === barcodeInput.trim().toLowerCase()
    );
    if (foundProduct) {
      if (foundProduct.category === 'cannabis') {
        setSelectedCannabisProduct(foundProduct);
        setSelectedLotId(foundProduct.cannabisDetails?.activeLotId || '');
      } else {
        addToCart(foundProduct, 1);
      }
      setBarcodeInput('');
    } else {
      alert(`ไม่พบสินค้ารหัส Barcode / SKU: ${barcodeInput}`);
    }
  };

  const handleAddCannabisWithWeight = () => {
    if (!selectedCannabisProduct || customGramWeight <= 0) return;
    addToCart(selectedCannabisProduct, customGramWeight, selectedLotId);
    setSelectedCannabisProduct(null);
    setCustomGramWeight(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[calc(100vh-8rem)]">
      {/* LEFT & CENTER: Product Catalog & Category Nav (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col space-y-3.5">
        {/* Top Search & Barcode Scanner Bar */}
        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสินค้า, สายพันธุ์, รหัสสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-emerald-500 placeholder-slate-400 transition"
            />
          </div>

          {/* Barcode Form */}
          <form onSubmit={handleBarcodeSearch} className="flex items-center space-x-2">
            <div className="relative">
              <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="สแกน Barcode / SKU"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-emerald-500 placeholder-slate-400 w-36 sm:w-44 font-mono transition"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition shadow-xs"
            >
              สแกน
            </button>
          </form>
        </div>

        {/* 3 Verticals + All Category Filter Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
              selectedCategory === 'all'
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>ทั้งหมด ({products.length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('cannabis')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
              selectedCategory === 'cannabis'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs ring-1 ring-emerald-300'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>🌿 กัญชา</span>
          </button>

          <button
            onClick={() => setSelectedCategory('kratom')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
              selectedCategory === 'kratom'
                ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs ring-1 ring-blue-300'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Coffee className="w-4 h-4 text-blue-600" />
            <span>🥤 กระท่อม</span>
          </button>

          <button
            onClick={() => setSelectedCategory('food')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
              selectedCategory === 'food'
                ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs ring-1 ring-amber-300'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Utensils className="w-4 h-4 text-amber-600" />
            <span>🍜 อาหาร</span>
          </button>

          <button
            onClick={() => setSelectedCategory('general')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
              selectedCategory === 'general'
                ? 'bg-purple-50 border-purple-300 text-purple-800 shadow-xs ring-1 ring-purple-300'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4 text-purple-600" />
            <span>📦 สินค้าทั่วไป</span>
          </button>
        </div>

        {/* Product Catalog Grid */}
        <div className="flex-1 overflow-y-auto pr-1 max-h-[calc(100vh-18rem)]">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-medium">ไม่พบรายการสินค้าตรงกับคำค้นหา</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stockQuantity <= 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      if (isOutOfStock) return;
                      if (product.category === 'cannabis') {
                        setSelectedCannabisProduct(product);
                        setSelectedLotId(product.cannabisDetails?.activeLotId || '');
                      } else {
                        addToCart(product, 1);
                      }
                    }}
                    className={`group bg-white border rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer relative overflow-hidden shadow-xs ${
                      isOutOfStock
                        ? 'border-slate-200 opacity-50 cursor-not-allowed bg-slate-50'
                        : 'border-slate-200 hover:border-emerald-500/60 hover:shadow-md'
                    }`}
                  >
                    {/* Badge Tags */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                        {product.code}
                      </span>
                      {product.category === 'cannabis' && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-1.5 py-0.5 rounded font-semibold">
                          THC {product.cannabisDetails?.thcPercent}%
                        </span>
                      )}
                      {product.category === 'kratom' && (
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-1.5 py-0.5 rounded font-semibold">
                          Batch อย.
                        </span>
                      )}
                      {product.category === 'food' && (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-1.5 py-0.5 rounded font-semibold">
                          ครัวร้อน
                        </span>
                      )}
                    </div>

                    {/* Product Image & Info */}
                    <div className="flex space-x-2.5 items-center my-1">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 flex-shrink-0">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700 transition">
                          {product.name}
                        </h4>
                        {product.cannabisDetails?.strain && (
                          <p className="text-[10px] text-emerald-700 truncate font-medium">
                            {product.cannabisDetails.strain}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          คงเหลือ:{' '}
                          <span
                            className={`font-semibold ${
                              product.stockQuantity < product.minStockAlert
                                ? 'text-amber-600'
                                : 'text-slate-700'
                            }`}
                          >
                            {product.stockQuantity} {product.stockUnit}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-extrabold text-emerald-700">
                          ฿{product.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400"> /{product.stockUnit}</span>
                      </div>

                      <button
                        disabled={isOutOfStock}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition shadow-xs ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Cart & Checkout Panel (5 Cols) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
        {/* Cart Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">รายการขาย (Cart)</h3>
              <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full border border-emerald-200 font-mono font-semibold">
                {cart.length} รายการ
              </span>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ล้างตะกร้า</span>
              </button>
            )}
          </div>

          {/* Customer Selection */}
          <div className="my-3 flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <select
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const found = customers.find((c) => c.id === e.target.value);
                setSelectedCustomer(found || null);
              }}
              className="bg-transparent text-slate-800 text-xs w-full focus:outline-none font-medium"
            >
              <option value="" className="bg-white">
                -- เลือกลูกค้า / สมาชิก (สะสมแต้ม) --
              </option>
              {customers.map((c) => (
                <option key={c.id} value={c.id} className="bg-white">
                  {c.name} ({c.phone}) - {c.points} แต้ม
                </option>
              ))}
            </select>
          </div>

          {/* Cannabis Compliance Banner & Controls if Cannabis in Cart */}
          {hasCannabisInCart && (
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3 mb-3 text-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-900 font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  การควบคุมกัญชา 2569 (รวม {totalCannabisWeightGrams} g)
                </span>
                {totalCannabisWeightGrams > shopSettings.ageLimitCannabisGrams && (
                  <span className="text-amber-700 text-[10px] flex items-center gap-1 font-bold">
                    <AlertCircle className="w-3 h-3" /> เกิน {shopSettings.ageLimitCannabisGrams}g
                  </span>
                )}
              </div>

              {/* Age 20+ Checkbox */}
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer pt-1 border-t border-emerald-200/80">
                <input
                  type="checkbox"
                  checked={ageVerified}
                  onChange={(e) => setAgeVerified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-[11px] font-medium">
                  ยืนยันตรวจสอบบัตรประชาชน (อายุ 20 ปีขึ้นไป เเละไม่จำหน่ายแก่สตรีมีครรภ์)
                </span>
              </label>

              {/* Patient Note / Prescription Input */}
              <div className="pt-1 space-y-1">
                <input
                  type="text"
                  placeholder="เลขที่ใบสั่งจ่ายสมุนไพร / ใบรับรอง (ถ้ามี)"
                  value={prescriptionRef}
                  onChange={(e) => setPrescriptionRef(e.target.value)}
                  className="w-full bg-white text-slate-800 text-[11px] px-2.5 py-1.5 rounded border border-emerald-300 focus:outline-none placeholder-slate-400 font-mono"
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="overflow-y-auto max-h-[220px] space-y-2 pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                ยังไม่มีสินค้าในตะกร้า <br /> คลิกเลือกสินค้าจากฝั่งซ้ายเพื่อคิดเงิน
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs flex flex-col space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-semibold text-slate-800">{item.productName}</h5>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                        <span>฿{item.price.toLocaleString()} /{item.unit}</span>
                        {item.lotNumber && (
                          <span className="text-emerald-700 font-mono bg-emerald-100 px-1 rounded border border-emerald-200 font-medium">
                            Lot: {item.lotNumber}
                          </span>
                        )}
                        {item.batchNo && (
                          <span className="text-blue-700 font-mono bg-blue-100 px-1 rounded border border-blue-200 font-medium">
                            Batch: {item.batchNo}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quantity & Discount Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold text-slate-800">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-emerald-700 text-sm">
                        ฿{item.subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cart Totals & Checkout Trigger */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>ราคารวม (Subtotal):</span>
              <span className="font-mono text-slate-800 font-semibold">฿{subtotal.toLocaleString()}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-rose-600 font-medium">
                <span>ส่วนลด (Discount):</span>
                <span className="font-mono">-฿{totalDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>ภาษีมูลค่าเพิ่ม VAT ({shopSettings.vatPercent}%):</span>
              <span className="font-mono">฿{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>ยอดรวมสุทธิ (NET TOTAL):</span>
              <span className="text-emerald-700 font-mono text-lg">
                ฿{netTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick Payment Action Buttons */}
          <div className="pt-2">
            <button
              disabled={cart.length === 0 || (hasCannabisInCart && !ageVerified)}
              onClick={() => setShowPaymentModal(true)}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-sm transition ${
                cart.length === 0 || (hasCannabisInCart && !ageVerified)
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>ชำระเงิน (Checkout)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Cannabis Weight Picker Modal */}
      {selectedCannabisProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  ระบุน้ำหนักกัญชาช่อดอก (Grams)
                </h3>
              </div>
              <button
                onClick={() => setSelectedCannabisProduct(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-emerald-800 text-sm">
                  {selectedCannabisProduct.name}
                </h4>
                <p className="text-slate-500">
                  สายพันธุ์: {selectedCannabisProduct.cannabisDetails?.strain} (THC{' '}
                  {selectedCannabisProduct.cannabisDetails?.thcPercent}%)
                </p>
                <p className="text-slate-500">
                  ราคา: ฿{selectedCannabisProduct.price}/กรัม | สต็อกคงเหลือ:{' '}
                  {selectedCannabisProduct.stockQuantity}g
                </p>
              </div>

              {/* Lot Selection */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  เลือก Lot การรับเข้า (Compliance Lot):
                </label>
                <select
                  value={selectedLotId}
                  onChange={(e) => setSelectedLotId(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 p-2 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  {cannabisLots
                    .filter((l) => l.productId === selectedCannabisProduct.id)
                    .map((lot) => (
                      <option key={lot.id} value={lot.lotNumber}>
                        Lot: {lot.lotNumber} | COA: {lot.coaNumber} (เหลือ {lot.remainingWeightGrams}g)
                      </option>
                    ))}
                </select>
              </div>

              {/* Quick Weight Presets */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  เลือกน้ำหนักด่วน (Quick Presets):
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3.5, 5, 10].map((gram) => (
                    <button
                      key={gram}
                      onClick={() => setCustomGramWeight(gram)}
                      className={`py-2 rounded-xl border text-xs font-bold transition ${
                        customGramWeight === gram
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {gram} g
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ระบุน้ำหนักตามชั่งจริง (กรัม):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={selectedCannabisProduct.stockQuantity}
                  value={customGramWeight}
                  onChange={(e) => setCustomGramWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 text-slate-900 text-base font-mono p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-emerald-500 font-bold"
                />
              </div>

              {/* Calculated Price */}
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">รวมราคากัญชาช่อดอก:</span>
                <span className="font-extrabold text-emerald-800 text-base font-mono">
                  ฿{(selectedCannabisProduct.price * customGramWeight).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedCannabisProduct(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddCannabisWithWeight}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                เพิ่มลงตะกร้า ({customGramWeight} g)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Processing Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={(order) => {
            setShowPaymentModal(false);
            setCompletedOrder(order);
          }}
          customer={selectedCustomer}
          patientMedicalNote={patientNote}
          prescriptionRef={prescriptionRef}
        />
      )}

      {/* Receipt Modal */}
      {completedOrder && (
        <ReceiptModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}
    </div>
  );
};
