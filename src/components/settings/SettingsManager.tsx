import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Settings, Save, ShieldCheck, FileText, Store } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { shopSettings, setShopSettings, addAuditLog } = usePOS();

  const [shopName, setShopName] = useState(shopSettings.shopName);
  const [address, setAddress] = useState(shopSettings.address);
  const [phone, setPhone] = useState(shopSettings.phone);
  const [taxId, setTaxId] = useState(shopSettings.taxId);
  const [cannabisLicenseNo, setCannabisLicenseNo] = useState(shopSettings.cannabisLicenseNo);
  const [kratomFdaNo, setKratomFdaNo] = useState(shopSettings.kratomFdaNo);
  const [foodLicenseNo, setFoodLicenseNo] = useState(shopSettings.foodLicenseNo);
  const [vatPercent, setVatPercent] = useState(shopSettings.vatPercent);
  const [receiptFooter, setReceiptFooter] = useState(shopSettings.receiptFooter);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...shopSettings,
      shopName,
      address,
      phone,
      taxId,
      cannabisLicenseNo,
      kratomFdaNo,
      foodLicenseNo,
      vatPercent,
      receiptFooter,
    };
    setShopSettings(updated);
    addAuditLog('UPDATE_SETTINGS', 'settings', 'อัปเดตการตั้งค่าข้อมูลร้านค้าเเละใบอนุญาต');
    alert('บันทึกการตั้งค่าข้อมูลร้านค้าเเละใบอนุญาตเรียบร้อยแล้ว');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-indigo-50/80 p-6 rounded-2xl border border-indigo-200 shadow-xs flex items-center space-x-4">
        <div className="bg-indigo-100 p-3 rounded-2xl border border-indigo-200 text-indigo-700">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">ตั้งค่าร้านค้าเเละใบอนุญาตประกอบกิจการ</h2>
          <p className="text-xs text-slate-600 mt-1">
            กำหนดข้อมูลผู้เสียภาษี, เลขที่ใบอนุญาตสมุนไพรควบคุม, เลข อย. กระท่อม เเละส่วนท้ายใบเสร็จ
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-emerald-800 flex items-center space-x-2">
            <Store className="w-4 h-4 text-emerald-700" />
            <span>ข้อมูลสถานประกอบการ:</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">ชื่อร้านค้า:</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">เลขประจำตัวผู้เสียภาษี (Tax ID):</label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">ที่อยู่สถานประกอบการ:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">เบอร์โทรศัพท์ติดต่อ:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300 font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* License Numbers */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <h3 className="font-bold text-sm text-emerald-800 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>เลขที่ใบอนุญาตตามกฎหมาย (Compliance Licenses):</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">
                🌿 ใบอนุญาตสมุนไพรควบคุม (กัญชา):
              </label>
              <input
                type="text"
                value={cannabisLicenseNo}
                onChange={(e) => setCannabisLicenseNo(e.target.value)}
                className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300 font-mono text-emerald-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">
                🥤 เลขสารบบ อย. (ต้มกระท่อม):
              </label>
              <input
                type="text"
                value={kratomFdaNo}
                onChange={(e) => setKratomFdaNo(e.target.value)}
                className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300 font-mono text-blue-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">
                🍜 ใบอนุญาตจำหน่ายอาหาร:
              </label>
              <input
                type="text"
                value={foodLicenseNo}
                onChange={(e) => setFoodLicenseNo(e.target.value)}
                className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300 font-mono text-orange-700 font-bold"
              />
            </div>
          </div>
        </div>

        {/* VAT & Receipt Footer */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">อัตราภาษีมูลค่าเพิ่ม VAT (%):</label>
              <input
                type="number"
                value={vatPercent}
                onChange={(e) => setVatPercent(parseFloat(e.target.value) || 0)}
                className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">ข้อความส่วนท้ายใบเสร็จ:</label>
              <input
                type="text"
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center space-x-2 text-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่า</span>
          </button>
        </div>
      </form>
    </div>
  );
};
