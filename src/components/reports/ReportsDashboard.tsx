import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart2,
  FileSpreadsheet,
  Plus,
  ArrowUpRight,
  Receipt,
  Leaf,
  Coffee,
  Utensils,
  Package,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

export const ReportsDashboard: React.FC = () => {
  const { orders, expenses, addExpense, shopSettings, products } = usePOS();
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Filter low stock products
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity <= p.minStockAlert || p.status === 'out_of_stock'
  );

  // New Expense Form State
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<'ingredient' | 'utility' | 'wage' | 'rent' | 'other'>('ingredient');
  const [expAmount, setExpAmount] = useState<number>(0);

  // Calculated Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.netTotal, 0);
  const totalTax = orders.reduce((acc, o) => acc + o.taxAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const revenueByCategory = {
    cannabis: 0,
    kratom: 0,
    food: 0,
    general: 0,
  };

  orders.forEach((o) => {
    o.items.forEach((item) => {
      revenueByCategory[item.category] += item.subtotal;
    });
  });

  const grossProfit = totalRevenue - totalExpenses;

  // Chart Data Preparation
  const chartData = [
    { name: '08:00', sales: 1200 },
    { name: '10:00', sales: 3400 },
    { name: '12:00', sales: 8900 },
    { name: '14:00', sales: 6500 },
    { name: '16:00', sales: 11200 },
    { name: '18:00', sales: 15400 },
    { name: '20:00', sales: 9800 },
  ];

  const categoryBarData = [
    { name: '🌿 กัญชา', value: revenueByCategory.cannabis, color: '#10b981' },
    { name: '🥤 กระท่อม', value: revenueByCategory.kratom, color: '#3b82f6' },
    { name: '🍜 อาหาร', value: revenueByCategory.food, color: '#f97316' },
    { name: '📦 สินค้าทั่วไป', value: revenueByCategory.general, color: '#a855f7' },
  ];

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || expAmount <= 0) return;

    addExpense({
      title: expTitle,
      category: expCategory,
      amount: expAmount,
      date: new Date().toISOString().split('T')[0],
      recordedBy: 'ผู้จัดการร้าน',
    });

    setShowAddExpenseModal(false);
    setExpTitle('');
    setExpAmount(0);
    alert('บันทึกค่าใช้จ่ายเรียบร้อย');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-indigo-50/80 p-6 rounded-2xl border border-indigo-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-2xl border border-indigo-200 text-indigo-700">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              แดชบอร์ดบริหารเเละรายงานบัญชีการเงิน (Executive BI & Accounting)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              วิเคราะห์รายได้แยกตามประเภทธุรกิจ (กัญชา / กระท่อม / อาหาร), รายงานภาษีขาย 7% เเละคำนวณกำไรสุทธิ
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddExpenseModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>บันทึกรายจ่ายร้าน</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2 shadow-xs">
          <span className="text-slate-500 text-xs font-semibold">ยอดขายรวมสุทธิ (Total Revenue)</span>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-extrabold text-emerald-700 font-mono">
              ฿{totalRevenue.toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +18.4%
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2 shadow-xs">
          <span className="text-slate-500 text-xs font-semibold">รายจ่ายร้านค้า (Expenses)</span>
          <p className="text-2xl font-extrabold text-rose-700 font-mono">
            ฿{totalExpenses.toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2 shadow-xs">
          <span className="text-slate-500 text-xs font-semibold">กำไรขั้นต้น (Gross Profit)</span>
          <p className="text-2xl font-extrabold text-amber-700 font-mono">
            ฿{grossProfit.toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2 shadow-xs">
          <span className="text-slate-500 text-xs font-semibold">ภาษีขาย VAT 7% สรุปส่งกรมฯ</span>
          <p className="text-2xl font-extrabold text-blue-700 font-mono">
            ฿{totalTax.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Visual Notification Component: Inventory Low Stock Alert */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300/80 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  การแจ้งเตือนสินค้าคงคลังต่ำกว่าเกณฑ์ (Inventory Low Stock Alerts)
                </h3>
                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  {lowStockProducts.length} รายการ
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                รายการสินค้าที่มีจำนวนสต็อกคงเหลือเท่ากับหรือต่ำกว่าเกณฑ์ขั้นต่ำ (Minimum Threshold Alert)
              </p>
            </div>
          </div>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3 text-emerald-800 text-xs font-semibold">
            <ShieldAlert className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>สินค้าทั้งหมดในคลังมีปริมาณเพียงพอและอยู่สูงกว่าเกณฑ์ขั้นต่ำทุกรายการ</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map((prod) => {
              const isOut = prod.stockQuantity <= 0 || prod.status === 'out_of_stock';
              const percent = Math.min(
                100,
                Math.round((prod.stockQuantity / (prod.minStockAlert * 2 || 1)) * 100)
              );

              return (
                <div
                  key={prod.id}
                  className={`bg-white border rounded-xl p-3.5 space-y-2.5 shadow-xs transition hover:shadow-md ${
                    isOut ? 'border-rose-300 bg-rose-50/20' : 'border-amber-300 bg-amber-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
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
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                          {prod.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          SKU: {prod.code}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center space-x-1 ${
                        isOut
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      <AlertCircle className="w-3 h-3" />
                      <span>{isOut ? 'สินค้าหมด' : 'ใกล้หมด'}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-slate-600">คงเหลือในคลัง:</span>
                      <span
                        className={`font-mono font-bold ${
                          isOut ? 'text-rose-600' : 'text-amber-700'
                        }`}
                      >
                        {prod.stockQuantity} {prod.stockUnit} / เกณฑ์ขั้นต่ำ: {prod.minStockAlert}{' '}
                        {prod.stockUnit}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isOut ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.max(5, percent)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Trend Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
          <h4 className="font-bold text-slate-900 text-sm">แนวโน้มยอดขายประจำวัน (Hourly Sales Trend)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Business Type Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
          <h4 className="font-bold text-slate-900 text-sm">สัดส่วนรายได้แยกตามประเภทธุรกิจ (Revenue by Business)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {categoryBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
        <h4 className="font-bold text-slate-900 text-sm">รายการค่าใช้จ่ายร้านค้า (Recorded Expenses)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">วันที่</th>
                <th className="p-3">รายการ</th>
                <th className="p-3">หมวดหมู่</th>
                <th className="p-3 text-right">จำนวนเงิน</th>
                <th className="p-3">ผู้บันทึก</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono text-slate-500">{exp.date}</td>
                  <td className="p-3 font-bold text-slate-900">{exp.title}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-rose-700">
                    ฿{exp.amount.toLocaleString()}
                  </td>
                  <td className="p-3 text-slate-500">{exp.recordedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">บันทึกรายการค่าใช้จ่ายร้าน</h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">ชื่อรายการ / คำอธิบาย:</label>
                <input
                  type="text"
                  placeholder="เช่น ค่าไฟฟ้าประจำเดือน, ค่าซื้อน้ำมันพืช"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">หมวดหมู่ค่าใช้จ่าย:</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="ingredient">วัตถุดิบทำอาหาร/เครื่องดื่ม</option>
                  <option value="utility">ค่าน้ำ/ค่าไฟ/อินเทอร์เน็ต</option>
                  <option value="wage">ค่าจ้างพนักงาน</option>
                  <option value="rent">ค่าเช่าสถานที่</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">จำนวนเงิน (บาท):</label>
                <input
                  type="number"
                  value={expAmount}
                  onChange={(e) => setExpAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-lg"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl border border-slate-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  บันทึกรายการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
