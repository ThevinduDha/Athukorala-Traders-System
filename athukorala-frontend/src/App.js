import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PromotionDashboard from './pages/PromotionDashboard';
import InventoryGrid from './pages/InventoryGrid';
import Analytics from './pages/Analytics';
import StaffManagement from './pages/StaffManagement';

const App = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="flex bg-[#0b0c10] min-h-screen selection:bg-yellow-500/30 overflow-hidden">
      
      {/* 1. FIXED NAVIGATION TERMINAL */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. DYNAMIC OPERATIONAL AREA */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-600/10 blur-[120px] rounded-full animate-pulse"></div>
        </div>

        {/* Dynamic Sector Rendering */}
        <div className="relative z-10">
          {activeTab === 'promotion' ? (
            <div className="animate-spring-pop">
              <PromotionDashboard />
            </div>
          ) : activeTab === 'inventory' ? (
            <div className="animate-spring-pop">
              <InventoryGrid />
            </div>
          ) : activeTab === 'analytics' || activeTab === 'dashboard' ? (
            <div className="animate-spring-pop">
              <Analytics />
            </div>
          ) : activeTab === 'users' ? ( // REMOVED THE EXTRA { HERE
            <div className="animate-spring-pop">
              <StaffManagement />
            </div>
          ) : (
            /* Fallback for other sectors */
            <div className="flex items-center justify-center h-screen">
              <p className="text-gray-700 font-black uppercase tracking-[0.5em] animate-pulse">
                Sector {activeTab} Offline
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;