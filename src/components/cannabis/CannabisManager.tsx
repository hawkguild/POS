import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { CannabisLot } from '../../types';
import {
  Leaf,
  ShieldAlert,
  FileCheck2,
  Plus,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building,
  Calendar,
  FileText,
} from 'lucide-react';

export const CannabisManager: React.FC = () => {
  const {
    cannabisLots,
    products,
    suppliers,
    addCannabisLot,
    stockMovements,
    shopSettings,
    auditLogs,
  } = usePOS();

  const [activeTab, setActiveTab] = useState<'lots' | 'ledger' | 'gov_report'>('lots');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddLotModal, setShowAddLotModal] = useState(false);

  // New Lot Form State
  const [selectedProductId, setSelectedProductId] = useState(
    products.find((p) => p.category === 'cannabis')?.id || ''
  );
  const [lotNumber, setLotNumber] = useState(`LOT-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [strain, setStrain] = useState('KD Koh Tao');
  const [thc, setThc] = useState(22.5);
  const [cbd, setCbd] = useState(0.8);
  const [coaNo, setCoaNo] = useState(`COA-TH-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [weightGrams, setWeightGrams] = useState(100);

  const cannabisProducts = products.filter((p) => p.category === 'cannabis');
  const cannabisMovements = stockMovements.filter((m) => m.category === 'cannabis');

  const filteredLots = cannabisLots.filter(
    (l) =>
      l.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.strain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.coaNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProduct = products.find((p) => p.id === selectedProductId);
    const targetSupplier = suppliers.find((s) => s.id === supplierId);

    if (!targetProduct || !targetSupplier) {
      alert('กรุณาเลือกสินค้าเเละซัพพลายเออร์');
      return;
    }

    addCannabisLot({
      lotNumber,
      productId: selectedProductId,
      strain: strain || targetProduct.cannabisDetails?.strain || targetProduct.name,
      type: 'flower',
      thcPercent: thc,
      cbdPercent: cbd,
      coaNumber: coaNo,
      supplierId: targetSupplier.id,
      supplierName: targetSupplier.companyName,
      originLocation: targetSupplier.address,
      initialWeightGrams: weightGrams,
      receivedDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-12-31',
    });

    setShowAddLotModal(false);
    alert(`บันทึกการรับเข้ากัญชาช่อดอก Lot: ${lotNumber} เรียบร้อยแล้ว`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-emerald-50/80 p-6 rounded-2xl border border-emerald-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-emerald-100 p-3 rounded-2xl border border-emerald-200 text-emerald-700">
            <Leaf className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">
                ระบบกำกับดูแลเเละตรวจสอบย้อนหลังกัญชา (Compliance 2026)
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                สมุนไพรควบคุม
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              จัดเก็บข้อมูล Lot, COA, แหล่งกำเนิดฟาร์ม เเละบันทึก Audit Trail
              รับ-จ่ายสมุนไพรควบคุมตามข้อกำหนดกรมการแพทย์แผนไทยฯ
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddLotModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xs transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>บันทึกรับเข้า Lot กัญชาใหม่</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs w-full max-w-md shadow-xs">
        <button
          onClick={() => setActiveTab('lots')}
          className={`flex-1 py-2 rounded-lg font-bold transition ${
            activeTab === 'lots'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🌿 บัญชี Lot & COA ({cannabisLots.length})
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex-1 py-2 rounded-lg font-bold transition ${
            activeTab === 'ledger'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📜 ประวัติเคลื่อนไหว (Audit Trail)
        </button>
        <button
          onClick={() => setActiveTab('gov_report')}
          className={`flex-1 py-2 rounded-lg font-bold transition ${
            activeTab === 'gov_report'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📋 รายงานส่งกรมฯ
        </button>
      </div>

      {/* TAB 1: LOTS LIST */}
      {activeTab === 'lots' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาเลข Lot, สายพันธุ์, เลข COA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-800 text-sm font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {lot.lotNumber}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      lot.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : lot.status === 'low'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {lot.status === 'available'
                      ? 'พร้อมจำหน่าย'
                      : lot.status === 'low'
                      ? 'ใกล้หมด'
                      : 'หมดแล้ว'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{lot.strain}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                    <span>THC: {lot.thcPercent}%</span>
                    <span>•</span>
                    <span>CBD: {lot.cbdPercent}%</span>
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ใบรับรอง COA:</span>
                    <span className="font-mono text-emerald-700 font-semibold">
                      {lot.coaNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">แหล่งปลูก/ซัพพลายเออร์:</span>
                    <span className="text-slate-700 font-medium truncate max-w-[150px]">
                      {lot.supplierName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">วันที่รับเข้า:</span>
                    <span className="text-slate-700 font-medium">{lot.receivedDate}</span>
                  </div>
                </div>

                {/* Weight Balance */}
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500">คงเหลือในคลัง:</span>
                    <p className="font-mono font-extrabold text-base text-emerald-700">
                      {lot.remainingWeightGrams}{' '}
                      <span className="text-xs text-slate-500">/ {lot.initialWeightGrams} g</span>
                    </p>
                  </div>

                  <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-200 text-[10px] text-center font-mono font-bold">
                    COA Verified ✓
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT MOVEMENT LEDGER */}
      {activeTab === 'ledger' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>ประวัติการเคลื่อนไหวสมุนไพรควบคุม (Cannabis Stock Movement Audit)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono">
                <tr>
                  <th className="p-3">วัน-เวลา</th>
                  <th className="p-3">สินค้า / สายพันธุ์</th>
                  <th className="p-3">Lot Number</th>
                  <th className="p-3">ประเภท</th>
                  <th className="p-3 text-right">จำนวน (กรัม)</th>
                  <th className="p-3 text-right">คงเหลือ</th>
                  <th className="p-3">เหตุผล / เลขที่อ้างอิง</th>
                  <th className="p-3">ผู้บันทึก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cannabisMovements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400">
                      ยังไม่มีรายการเคลื่อนไหวสต็อกกัญชา
                    </td>
                  </tr>
                ) : (
                  cannabisMovements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-500">
                        {new Date(m.timestamp).toLocaleString('th-TH')}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{m.productName}</td>
                      <td className="p-3 font-mono text-emerald-700 font-semibold">{m.lotNumber || '-'}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.type === 'in'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.type === 'sale'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {m.type === 'in' ? 'รับเข้า (+)' : m.type === 'sale' ? 'ขายออก (-)' : 'ปรับปรุง'}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold">
                        {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange} g
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-700 font-bold">
                        {m.balanceAfter} g
                      </td>
                      <td className="p-3 text-slate-600">{m.reason}</td>
                      <td className="p-3 text-slate-600">{m.userName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: OFFICIAL GOVT REPORT */}
      {activeTab === 'gov_report' && (
        <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 printable-receipt">
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                แบบรายงานการรับ-จำหน่ายช่อดอกสมุนไพรควบคุม (กัญชา)
              </h3>
              <p className="text-xs text-slate-600">
                ตามประกาศกระทรวงสาธารณสุข เรื่อง สมุนไพรควบคุม (กัญชา) พ.ศ. 2569
              </p>
              <p className="text-xs font-semibold text-emerald-800 mt-1">
                สถานที่จำหน่าย: {shopSettings.shopName} | เลขที่ใบอนุญาต: {shopSettings.cannabisLicenseNo}
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shadow-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>พิมพ์รายงานส่งกรมฯ</span>
            </button>
          </div>

          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                <th className="p-2 border">ลำดับ</th>
                <th className="p-2 border">วัน/เดือน/ปี</th>
                <th className="p-2 border">ชื่อสายพันธุ์/ช่อดอก</th>
                <th className="p-2 border">Lot No. / เลข COA</th>
                <th className="p-2 border text-right">ยอดยกมา (g)</th>
                <th className="p-2 border text-right">รับเข้า (g)</th>
                <th className="p-2 border text-right">จ่าย/ขายออก (g)</th>
                <th className="p-2 border text-right">คงเหลือ (g)</th>
                <th className="p-2 border">ผู้จำหน่าย / เลขใบสั่งจ่าย</th>
              </tr>
            </thead>
            <tbody>
              {cannabisLots.map((lot, idx) => (
                <tr key={lot.id} className="border-b border-slate-200">
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border font-mono">{lot.receivedDate}</td>
                  <td className="p-2 border font-bold">{lot.strain}</td>
                  <td className="p-2 border font-mono">
                    {lot.lotNumber} ({lot.coaNumber})
                  </td>
                  <td className="p-2 border text-right font-mono">{lot.initialWeightGrams}</td>
                  <td className="p-2 border text-right font-mono">0</td>
                  <td className="p-2 border text-right font-mono">
                    {lot.initialWeightGrams - lot.remainingWeightGrams}
                  </td>
                  <td className="p-2 border text-right font-mono font-bold text-emerald-800">
                    {lot.remainingWeightGrams}
                  </td>
                  <td className="p-2 border">{lot.supplierName}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-8 grid grid-cols-2 text-xs text-center text-slate-700">
            <div>
              <p>ลงชื่อ.......................................................... ผู้รับผิดชอบ</p>
              <p className="mt-1">( {shopSettings.shopName} )</p>
            </div>
            <div>
              <p>วันที่............/............/2026</p>
            </div>
          </div>
        </div>
      )}

      {/* Add New Lot Modal */}
      {showAddLotModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                บันทึกรับเข้ากัญชาช่อดอก Lot ใหม่ (Compliance Entry)
              </h3>
              <button
                onClick={() => setShowAddLotModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLot} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">เลือกรายการสินค้ากัญชา:</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300"
                >
                  {cannabisProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">เลข Lot Number:</label>
                  <input
                    type="text"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">เลขใบรับรอง COA:</label>
                  <input
                    type="text"
                    value={coaNo}
                    onChange={(e) => setCoaNo(e.target.value)}
                    className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">สายพันธุ์ (Strain):</label>
                  <input
                    type="text"
                    value={strain}
                    onChange={(e) => setStrain(e.target.value)}
                    className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">น้ำหนักรับเข้า (กรัม):</label>
                  <input
                    type="number"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">THC %:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={thc}
                    onChange={(e) => setThc(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">CBD %:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={cbd}
                    onChange={(e) => setCbd(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  เลือกฟาร์ม / ซัพพลายเออร์ที่ได้รับอนุญาต:
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-white text-slate-800 p-2 rounded-xl border border-slate-300"
                >
                  {suppliers
                    .filter((s) => s.productTypes.includes('cannabis'))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.companyName} ({s.licenseNumber || 'ใบอนุญาตสมบูรณ์'})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLotModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium border border-slate-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  บันทึกรับเข้า Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
