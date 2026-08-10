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
    { id: 'pos', label: 'หน้าหลัก POS', icon: ShoppingCart, badge: 'ขายสินค้า', highlight: true },
    { id: 'cannabis', label: 'กัญชา (Compliance)', icon: Leaf, badge: '2569' },
    { id: 'kratom', label: 'น้ำกระท่อม (Batch)', icon: Coffee, badge: 'สูตรต้ม' },
    { id: 'kitchen', label: 'จอสั่งอาหาร (KDS)', icon: ChefHat, badge: 'ครัว' },
    { id: 'inventory', label: 'คลังสินค้า (Stock)', icon: Package },
    { id: 'suppliers', label: 'ซัพพลายเออร์', icon: Truck },
    { id: 'customers', label: 'สมาชิก & ผู้ป่วย', icon: Users },
    { id: 'users', label: 'ผู้ใช้งานระบบ', icon: UserCog, badge: 'Admin' },
    { id: 'audit', label: 'Audit Trail', icon: ShieldCheck },
    { id: 'dashboard', label: 'แดชบอร์ด', icon: BarChart3 },
    { id: 'reports', label: 'รายงาน & บัญชี', icon: FileSpreadsheet },
    { id: 'settings', label: 'ตั้งค่าร้าน', icon: Settings, badge: 'แอดมิน' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 sticky top-16 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center space-x-1.5 py-2.5 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 ring-1 ring-slate-900 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 active:scale-95'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive
                    ? 'text-emerald-400'
                    : 'text-slate-500 group-hover:text-emerald-600'
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold tracking-tight transition-colors ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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

