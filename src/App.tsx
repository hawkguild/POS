import React, { useState } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Navbar } from './components/Navbar';
import { NavigationTabs } from './components/NavigationTabs';
import { POSTerminal } from './components/pos/POSTerminal';
import { CannabisManager } from './components/cannabis/CannabisManager';
import { KratomManager } from './components/kratom/KratomManager';
import { KitchenDisplay } from './components/kitchen/KitchenDisplay';
import { InventoryManager } from './components/inventory/InventoryManager';
import { SupplierManager } from './components/suppliers/SupplierManager';
import { CustomerManager } from './components/customers/CustomerManager';
import { UserManager } from './components/users/UserManager';
import { AuditLogViewer } from './components/audit/AuditLogViewer';
import { ReportsDashboard } from './components/reports/ReportsDashboard';
import { SettingsManager } from './components/settings/SettingsManager';
import { LoginScreen } from './components/auth/LoginScreen';

function MainApp() {
  const { isAuthenticated } = usePOS();
  const [activeTab, setActiveTab] = useState('pos');

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Module Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Dynamic View Body */}
      <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto">
        {activeTab === 'pos' && <POSTerminal />}
        {activeTab === 'cannabis' && <CannabisManager />}
        {activeTab === 'kratom' && <KratomManager />}
        {activeTab === 'kitchen' && <KitchenDisplay />}
        {activeTab === 'inventory' && <InventoryManager />}
        {activeTab === 'suppliers' && <SupplierManager />}
        {activeTab === 'customers' && <CustomerManager />}
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'audit' && <AuditLogViewer />}
        {activeTab === 'dashboard' && <ReportsDashboard />}
        {activeTab === 'reports' && <ReportsDashboard />}
        {activeTab === 'settings' && <SettingsManager />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <POSProvider>
      <MainApp />
    </POSProvider>
  );
}
