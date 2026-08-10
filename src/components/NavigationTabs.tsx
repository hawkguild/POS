import React from 'react';
import {
  ShoppingCart,
  Leaf,
  Coffee,
  ChefHat,
  Package,
  Truck,
  Users,
  UserCog,
  ShieldCheck,
  BarChart3,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'pos', label: 'หน้าหลัก POS', icon: ShoppingCart, badge: 'ขาย' },
    { id: 'cannabis', label: 'กัญชา (Compliance)', icon: Leaf, badge: '2569' },
    { id: 'kratom', label: 'น้ำกระท่อม (Batch)', icon: Coffee, badge: 'สูตร' },
    { id: 'kitchen', label: 'จอสั่งอาหาร (KDS)', icon: ChefHat, badge: 'ครัว' },
    { id: 'inventory', label: 'คลังสินค้า (Stock)', icon: Package },
    { id: 'suppliers', label: 'ซัพพลายเออร์', icon: Truck },
    { id: 'customers', label: 'สมาชิก & ผู้ป่วย', icon: Users },
    { id: 'users', label: 'ผู้ใช้งานระบบ', icon: UserCog, badge: 'Admin' },
    { id: 'audit', label: 'Audit Trail', icon: ShieldCheck },
    { id: 'dashboard', label: 'แดชบอร์ด', icon: BarChart3 },
    { id: 'reports', label: 'รายงาน & บัญชี', icon: FileSpreadsheet },
    { id: 'settings', label: 'ตั้งค่าร้าน', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-4 overflow-x-auto scrollbar-none shadow-xs">
      <div className="max-w-7xl mx-auto flex space-x-1 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-slate-100 text-emerald-700 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
