import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import {
  Store,
  UserCheck,
  ShieldAlert,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  Info,
  Clock,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, setCurrentUser, users, shopSettings, resetToDemoData, auditLogs, logout } = usePOS();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cashier':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'warehouse':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'kitchen':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin (เจ้าของ)';
      case 'manager':
        return 'Manager (ผู้จัดการ)';
      case 'cashier':
        return 'Cashier (แคชเชียร์)';
      case 'warehouse':
        return 'Warehouse (คลัง)';
      case 'kitchen':
        return 'Kitchen (พ่อครัว)';
      default:
        return role;
    }
  };

  return (
    <header className="bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Store Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 p-2.5 rounded-xl shadow-md flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-base sm:text-lg text-slate-900 tracking-wide">
                  THAI MULTI BUSINESS POS
                </h1>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                  B.E. 2569 Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <span>🌿 กัญชาสมุนไพรควบคุม</span>
                <span>•</span>
                <span>🥤 กระท่อม</span>
                <span>•</span>
                <span>🍜 ครัวอาหาร</span>
              </p>
            </div>
          </div>

          {/* Quick Info & Compliance Status */}
          <div className="hidden lg:flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 bg-amber-50/80 px-3 py-1.5 rounded-lg border border-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span className="text-slate-700">ใบอนุญาตสมุนไพร:</span>
              <span className="text-amber-800 font-mono font-semibold">
                {shopSettings.cannabisLicenseNo}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 bg-blue-50/80 px-3 py-1.5 rounded-lg border border-blue-200">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-slate-700">อย. กระท่อม:</span>
              <span className="text-blue-800 font-mono font-semibold">
                {shopSettings.kratomFdaNo}
              </span>
            </div>
          </div>

          {/* User Role Switcher & Utilities */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Info Trigger */}
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="ข้อมูลการรองรับกฎหมาย 2569"
            >
              <Info className="w-5 h-5 text-amber-500" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title={soundEnabled ? 'ปิดเสียงการแจ้งเตือน' : 'เปิดเสียงการแจ้งเตือน'}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => {
                if (confirm('คุณต้องการรีเซ็ตข้อมูลตัวอย่างย้อนกลับเป็นค่าเริ่มต้นหรือไม่?')) {
                  resetToDemoData();
                }
              }}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg border border-slate-300 transition font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>รีเซ็ตสาธิต</span>
            </button>

            {/* User Profile / Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 transition text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <span
                    className={`inline-block text-[10px] px-1.5 py-0.2 rounded border font-medium ${getRoleBadge(
                      currentUser.role
                    )}`}
                  >
                    {getRoleLabel(currentUser.role)}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {/* Role Dropdown */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-slate-800">
                  <div className="text-xs font-semibold text-slate-500 px-3 py-1.5 border-b border-slate-100">
                    สลับบทบาทผู้ใช้งาน (Permission Switcher)
                  </div>
                  <div className="space-y-1 mt-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition ${
                          currentUser.id === u.id
                            ? 'bg-emerald-50 text-emerald-800 font-medium border border-emerald-200'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{u.name}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${getRoleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center space-x-1.5 p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition border border-rose-200"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ออกจากระบบ (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Header Direct Logout Button */}
            <button
              onClick={logout}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition border border-rose-200"
              title="ออกจากระบบ"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-6 h-6 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-900">ข้อกำหนดกฎหมายกัญชาและกระท่อม ปี 2569</h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-emerald-950">
                <p className="font-semibold text-emerald-800 mb-1">🌿 1. กัญชา (สมุนไพรควบคุม):</p>
                <p>
                  ตามประกาศกฎหมายปี 2569 ช่อดอกกัญชาจัดเป็น “สมุนไพรควบคุม”
                  การจำหน่ายต้องเก็บข้อมูล Lot, COA, ใบอนุญาตผู้จำหน่าย, ประวัติการรับจ่าย (Stock Audit Trail)
                  และไม่อนุญาตให้จัดส่งออนไลน์หรือจำหน่ายแก่ผู้มีอายุต่ำกว่า 20 ปี/สตรีมีครรภ์
                </p>
              </div>

              <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200 text-blue-950">
                <p className="font-semibold text-blue-800 mb-1">🥤 2. น้ำกระท่อม (ข้อกำหนด อย.):</p>
                <p>
                  การจำหน่ายน้ำกระท่อมต้องมีการบันทึกสูตรผสม (Recipe) และเลข Batch
                  ในการผลิตแต่ละครั้ง พร้อมพิมพ์ข้อความเตือนบนฉลากตามที่ อย. กำหนดอย่างเคร่งครัด
                </p>
              </div>

              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-amber-950">
                <p className="font-semibold text-amber-800 mb-1">🍜 3. ระบบตัดสต็อกวัตถุดิบอาหาร:</p>
                <p>
                  ระบบจะทำการตัดสต็อกวัตถุดิบรายรายการตาม Recipe ของเมนูอาหารโดยอัตโนมัติ
                  พร้อมเชื่อมต่อกับระบบ Kitchen Display System (KDS) สำหรับห้องครัว
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-md"
              >
                รับทราบและเข้าใจ
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
