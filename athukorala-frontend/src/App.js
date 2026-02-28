import React from 'react';
import Sidebar from './Sidebar';
import PromotionDashboard from './PromotionDashboard';

const App = () => {
  return (
    <div className="flex bg-[#0b0c10] min-h-screen">
      {/* 1. THE PREMIUM NAVIGATION TERMINAL */}
      <Sidebar activeTab="promotion" />

      {/* 2. THE MAIN OPERATIONAL AREA */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Subtle background glow to connect the sidebar to the content */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 transition-opacity duration-1000">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10">
          <PromotionDashboard />
        </div>
      </main>
    </div>
  );
};

export default App;