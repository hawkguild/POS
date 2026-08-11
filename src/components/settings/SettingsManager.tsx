import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { useTheme, THEMES, ThemeId } from '../../context/ThemeContext';
import { PromptPayQRCard } from '../pos/PromptPayQRCard';
import {
  Settings,
  Save,
  ShieldCheck,
  FileText,
  Store,
  QrCode,
  Check,
  Eye,
  AlertCircle,
  Percent,
  CheckSquare,
  Square,
  Printer,
  Sparkles,
  Palette,
  RefreshCw,
} from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { shopSettings, setShopSettings, addAuditLog } = usePOS();
  const { themeId, setThemeId, activeTheme, rollRandomTheme } = useTheme();

  const [shopName, setShopName] = useState(shopSettings.shopName || '');
  const [address, setAddress] = useState(shopSettings.address || '');
  const [phone, setPhone] = useState(shopSettings.phone || '');
  const [taxId, setTaxId] = useState(shopSettings.taxId || '');
  const [promptPayId, setPromptPayId] = useState(
    shopSettings.promptPayId || shopSettings.taxId || '0105568192083'
  );
  const [promptPayName, setPromptPayName] = useState(
    shopSettings.promptPayName || shopSettings.shopName || 'บจก. ไทย มัลติ บิสซิเนส'
  );
  const [receiptHeader, setReceiptHeader] = useState(
    shopSettings.receiptHeader ||
      'ยินดีต้อนรับสู่ THAI MULTI BUSINESS POS\nศูนย์จำหน่ายสินค้าสมุนไพรควบคุมเเละอาหารมาตรฐาน'
  );
  const [receiptFooter, setReceiptFooter] = useState(
    shopSettings.receiptFooter ||
      'ขอบคุณที่อุดหนุนสินค้ามาตรฐาน B.E. 2569\nกรุณาเก็บบิลไว้เพื่อรับประกันคุณภาพสินค้า'
  );

  const [cannabisLicenseNo, setCannabisLicenseNo] = useState(
    shopSettings.cannabisLicenseNo || ''
  );
  const [kratomFdaNo, setKratomFdaNo] = useState(shopSettings.kratomFdaNo || '');
  const [foodLicenseNo, setFoodLicenseNo] = useState(shopSettings.foodLicenseNo || '');
  const [vatPercent, setVatPercent] = useState(shopSettings.vatPercent || 7);

  const [autoPrintReceipt, setAutoPrintReceipt] = useState(
    shopSettings.autoPrintReceipt ?? true
  );
  const [ageVerificationRequired, setAgeVerificationRequired] = useState(
    shopSettings.ageVerificationRequired ?? true
  );
  const [requireMedicalRefForCannabis, setRequireMedicalRefForCannabis] = useState(
    shopSettings.requireMedicalRefForCannabis ?? true
  );

  const [testRefNo, setTestRefNo] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...shopSettings,
      shopName,
      address,
      phone,
      taxId,
      promptPayId,
      promptPayName,
      receiptHeader,
      receiptFooter,
      cannabisLicenseNo,
      kratomFdaNo,
      foodLicenseNo,
      vatPercent,
      autoPrintReceipt,
      ageVerificationRequired,
      requireMedicalRefForCannabis,
    };
    setShopSettings(updated);
    addAuditLog(
      'UPDATE_SETTINGS',
      'settings',
      `อัปเดตการตั้งค่าร้านค้า: ${shopName}, PromptPay: ${promptPayId}`
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Header Banner */}
      <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 text-indigo-200 backdrop-blur-xs">
            <Settings className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                Admin Control
              </span>
              <h2 className="text-xl font-extrabold text-white">
                ตั้งค่าร้านค้า, หัวบิล เเละ QR รับเงิน (Store & Receipt Settings)
              </h2>
            </div>
            <p className="text-xs text-indigo-200 mt-1">
              แก้ไขชื่อร้านค้า, โลโก้/หัวบิล, เลขประจำตัวผู้เสียภาษี, บัญชี PromptPay QR
              เเละใบอนุญาตตามกฎหมาย (ซิงค์ข้อมูลเรียลไทม์ไปยังทุกอุปกรณ์พร้อมกันผ่าน Firebase Cloud)
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-2xl flex items-center space-x-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>บันทึกข้อมูลเรียบร้อยแล้ว!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Column (7 Cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* Section 0: Theme Palette Switcher */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <Palette className="w-4 h-4 text-emerald-600" />
                <span>ธีมสีประจำร้าน (5 โทนสีหลัก):</span>
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                ปัจจุบัน: {activeTheme.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(THEMES) as ThemeId[]).map((id) => {
                const theme = THEMES[id];
                const isSelected = themeId === id;

                return (
                  <div
                    key={id}
                    onClick={() => setThemeId(id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-6 h-6 rounded-lg border border-white shadow-2xs overflow-hidden shrink-0 flex items-center justify-center"
                        style={{
                          background:
                            id === 'random'
                              ? activeTheme.swatch[1]
                              : `linear-gradient(135deg, ${theme.swatch[0]} 50%, ${theme.swatch[1]} 50%)`,
                        }}
                      >
                        {id === 'random' && <Sparkles className="w-3 h-3 text-white" />}
                      </div>

                      <div className="truncate">
                        <div className="font-bold text-xs truncate">{theme.name}</div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {theme.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {id === 'random' && isSelected && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            rollRandomTheme();
                          }}
                          className="p-1 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition"
                          title="สุ่มสีใหม่"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 1: Shop Identity & Receipt Header */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>1. ข้อมูลร้านค้า เเละ ข้อความหัวบิล (Shop & Bill Header):</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  ชื่อร้านค้า / สถานประกอบการ (Shop Name) *:
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="เช่น THAI MULTI BUSINESS CENTER"
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-indigo-500 font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  ข้อความสโลแกน / ต้อนรับส่วนหัวบิล (Receipt Header Text):
                </label>
                <textarea
                  rows={2}
                  value={receiptHeader}
                  onChange={(e) => setReceiptHeader(e.target.value)}
                  placeholder="ข้อความที่พิมพ์แสดงด้านบนสุดของใบเสร็จ"
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">
                    เลขประจำตัวผู้เสียภาษี 13 หลัก (Tax ID) *:
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="0105568192083"
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:bg-white focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">
                    เบอร์โทรศัพท์ร้านค้า *:
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="02-719-8888"
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:bg-white focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  ที่อยู่สถานประกอบการ (Address) *:
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ที่อยู่ร้านค้าตามภ.พ.20 หรือ ใบอนุญาต"
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-indigo-500 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: PromptPay QR Receiving Payment */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-100">
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>2. ตั้งค่าระบบ QR รับเงิน พร้อมเพย์ (PromptPay Payment Settings):</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  หมายเลขพร้อมเพย์ (PromptPay ID) *:
                </label>
                <input
                  type="text"
                  value={promptPayId}
                  onChange={(e) => setPromptPayId(e.target.value)}
                  placeholder="เบอร์โทร 10 หลัก หรือ Tax ID 13 หลัก"
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:bg-white focus:border-indigo-500 text-blue-700"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  รองรับทั้งเบอร์โทรศัพท์ (เช่น 0819998888) หรือ เลขผู้เสียภาษี 13 หลัก
                </span>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  ชื่อบัญชีรับเงิน / ชื่อร้านค้าพร้อมเพย์ *:
                </label>
                <input
                  type="text"
                  value={promptPayName}
                  onChange={(e) => setPromptPayName(e.target.value)}
                  placeholder="เช่น บจก. ไทย มัลติ บิสซิเนส"
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 font-bold focus:bg-white focus:border-indigo-500"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  จะแสดงบนหน้าจอ QR Code และส่วนท้ายบิลสแกนชำระ
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Receipt Footer & Licenses */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>3. ส่วนท้ายใบเสร็จ เเละ ใบอนุญาตตามกฎหมาย (Footer & Licenses):</span>
            </h3>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                ข้อความส่วนท้ายใบเสร็จ (Receipt Footer Note):
              </label>
              <textarea
                rows={2}
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                placeholder="คำขอบคุณ เงื่อนไขการรับประกัน หรือการคืนสินค้า"
                className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  🌿 ใบอนุญาตสมุนไพร (กัญชา):
                </label>
                <input
                  type="text"
                  value={cannabisLicenseNo}
                  onChange={(e) => setCannabisLicenseNo(e.target.value)}
                  placeholder="นภ.102/2569"
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 font-mono text-emerald-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  🥤 เลขสารบบ อย. (กระท่อม):
                </label>
                <input
                  type="text"
                  value={kratomFdaNo}
                  onChange={(e) => setKratomFdaNo(e.target.value)}
                  placeholder="อย. 10-1-08869-5-0012"
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 font-mono text-blue-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  🍜 ใบอนุญาตขายอาหาร:
                </label>
                <input
                  type="text"
                  value={foodLicenseNo}
                  onChange={(e) => setFoodLicenseNo(e.target.value)}
                  placeholder="กทม.010556819"
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 font-mono text-amber-800 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  อัตราภาษีมูลค่าเพิ่ม VAT (%):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={vatPercent}
                    onChange={(e) => setVatPercent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-300 font-mono font-bold pr-8"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Operational Switches */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>4. ตัวเลือกการทำงานระบบ POS เเละความปลอดภัย:</span>
            </h3>

            <div className="space-y-2">
              <label
                onClick={() => setAutoPrintReceipt(!autoPrintReceipt)}
                className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition"
              >
                {autoPrintReceipt ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-800 block">
                    พิมพ์ใบเสร็จรับเงินให้อัตโนมัติหลังปิดการขาย (Auto-print Receipt)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    เปิดหน้าจอพิมพ์ใบเสร็จให้อัตโนมัติทันทีที่ชำระเงินเสร็จสิ้น
                  </span>
                </div>
              </label>

              <label
                onClick={() => setAgeVerificationRequired(!ageVerificationRequired)}
                className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition"
              >
                {ageVerificationRequired ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-800 block">
                    บังคับตรวจสอบอายุลูกค้าอายุไม่ต่ำกว่า 20 ปี (Age 20+ Compliance)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ต้องกดยืนยันตรวจบัตรประชาชนก่อนชำระเงินเมื่อมีสินค้ากลุ่มสมุนไพรควบคุม
                  </span>
                </div>
              </label>

              <label
                onClick={() =>
                  setRequireMedicalRefForCannabis(!requireMedicalRefForCannabis)
                }
                className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition"
              >
                {requireMedicalRefForCannabis ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-800 block">
                    บังคับออกใบสั่งจ่ายสมุนไพร / เลขอ้างอิงแพทย์ (Medical Prescription Ref)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    บันทึกรหัสอ้างอิงทางการแพทย์กำกับในออเดอร์กัญชาเพื่อรายงาน อย.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-2xl shadow-lg flex items-center space-x-2 text-sm transition transform active:scale-98"
            >
              <Save className="w-5 h-5" />
              <span>บันทึกการตั้งค่าร้านค้าเเละ QR รับเงิน</span>
            </button>
          </div>
        </form>

        {/* Right Preview Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live PromptPay QR Preview Card */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-sky-400" />
                <h4 className="font-extrabold text-sm text-white">
                  ตัวอย่าง QR Code รับเงิน (Live PromptPay QR)
                </h4>
              </div>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-mono font-bold border border-sky-500/30">
                REALTIME PREVIEW
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              เมื่อทำการชำระเงินที่หน้า POS จอนี้จะแสดง PromptPay QR Code ตามข้อมูลที่คุณตั้งค่าไว้:
            </p>

            <PromptPayQRCard
              amount={1250}
              promptPayId={promptPayId || '0105568192083'}
              merchantName={promptPayName || shopName || 'THAI MULTI BUSINESS'}
              refNo={testRefNo}
              onRefNoChange={setTestRefNo}
            />
          </div>

          {/* Live Receipt Paper Preview Card */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-lg space-y-3 text-slate-800">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Printer className="w-5 h-5 text-emerald-600" />
                <h4 className="font-extrabold text-sm text-slate-900">
                  ตัวอย่างหัวบิลเเละใบเสร็จ (Receipt Paper Preview)
                </h4>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-300">
                PAPER VOUCHER
              </span>
            </div>

            {/* Simulated Receipt Thermal Paper */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 font-sans text-xs space-y-3 shadow-inner">
              {/* Header section */}
              <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-300">
                <h2 className="font-black text-sm uppercase text-slate-900 tracking-tight">
                  {shopName || 'ชื่อร้านค้าของคุณ'}
                </h2>
                {receiptHeader && (
                  <p className="text-[10px] text-emerald-800 font-bold whitespace-pre-line bg-emerald-50/80 p-1.5 rounded border border-emerald-200 my-1">
                    {receiptHeader}
                  </p>
                )}
                <p className="text-[10px] text-slate-600">{address || 'ที่อยู่ร้านค้า'}</p>
                <p className="text-[10px] text-slate-600 font-mono">
                  เลขผู้เสียภาษี: {taxId || '0105568192083'} | โทร: {phone || '02-719-8888'}
                </p>

                {(cannabisLicenseNo || kratomFdaNo || foodLicenseNo) && (
                  <div className="text-[9px] text-slate-700 bg-white p-1.5 rounded border border-slate-200 space-y-0.5 mt-1 font-mono">
                    {cannabisLicenseNo && <div>🌿 ใบอนุญาตสมุนไพร: {cannabisLicenseNo}</div>}
                    {kratomFdaNo && <div>🥤 เลข อย. กระท่อม: {kratomFdaNo}</div>}
                    {foodLicenseNo && <div>🍜 ใบอนุญาตอาหาร: {foodLicenseNo}</div>}
                  </div>
                )}
              </div>

              {/* Sample item lines */}
              <div className="text-[10px] space-y-1 border-b border-dashed border-slate-300 pb-2">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>รายการสินค้าทดสอบ</span>
                  <span>จำนวน</span>
                  <span>รวม</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>1. ช่อดอกกัญชา OG Kush (2g)</span>
                  <span>1x</span>
                  <span className="font-mono">฿900.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>2. น้ำกระท่อมสูตรเข้มข้น (500ml)</span>
                  <span>2x</span>
                  <span className="font-mono">฿200.00</span>
                </div>
              </div>

              {/* Totals */}
              <div className="text-[11px] space-y-0.5 text-slate-800">
                <div className="flex justify-between">
                  <span>ราคารวม:</span>
                  <span className="font-mono">฿1,100.00</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>ภาษีมูลค่าเพิ่ม VAT {vatPercent}%:</span>
                  <span className="font-mono">฿{(1100 * (vatPercent / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t border-slate-300 pt-1">
                  <span>ยอดสุทธิ:</span>
                  <span className="font-mono text-emerald-800">
                    ฿{(1100 * (1 + vatPercent / 100)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Footer text */}
              <div className="text-center pt-2 border-t border-dashed border-slate-300 text-[9px] text-slate-500 whitespace-pre-line font-medium">
                {receiptFooter || 'ขอบคุณที่อุดหนุน'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
