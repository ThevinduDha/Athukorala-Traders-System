import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PromotionDashboard from './pages/PromotionDashboard';
import InventoryGrid from './pages/InventoryGrid';

const App = () => {
  // Navigation state to control the Main Terminal
  const [activeTab, setActiveTab] = useState('promotion');

  return (
    <div className="flex bg-[#0b0c10] min-h-screen selection:bg-yellow-500/30 overflow-hidden">
      
      {/* 1. FIXED NAVIGATION TERMINAL */}
      {/* Pass activeTab and setActiveTab to Sidebar to enable switching */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. DYNAMIC OPERATIONAL AREA */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative">
        
        {/* Subtle background glow - Industrial Atmosphere */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 transition-opacity duration-1000">
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
          ) : (
            /* Fallback for other sectors like Staff or Analytics */
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