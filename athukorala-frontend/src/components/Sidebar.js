import React from 'react';
import { LayoutDashboard, Tag, Box, Users, BarChart3, Settings, LogOut, ShieldCheck } from 'lucide-react';

// Added setActiveTab prop to handle sector switching
const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: <LayoutDashboard size={20} /> },
    { id: 'promotion', label: 'PROMOTIONS', icon: <Tag size={20} /> },
    { id: 'inventory', label: 'INVENTORY', icon: <Box size={20} /> },
    { id: 'users', label: 'STAFF', icon: <Users size={20} /> },
    { id: 'analytics', label: 'ANALYTICS', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#0b0c10] border-r border-white/5 flex flex-col min-h-screen sticky top-0 animate-spring-pop z-50">
      {/* BRANDING SECTION */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3 text-yellow-500 mb-2 animate-blink-industrial">
          <ShieldCheck size={18} strokeWidth={3} />
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">Core System</span>
        </div>
        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase leading-tight">
          Athukorala <span className="text-yellow-500 text-sm block not-italic tracking-[0.2em] font-bold mt-1">Traders </span>
        </h2>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] mb-4">Main Terminal</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            // Triggers state change in App.js
            onClick={() => setActiveTab(item.id)} 
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 magnetic-reactive group outline-none ${
              activeTab === item.id ? 'nav-link-active' : 'nav-link-idle'
            }`}
          >
            <div className={`${activeTab === item.id ? 'text-yellow-500' : 'group-hover:text-yellow-400'}`}>
              {item.icon}
            </div>
            <span className="text-[11px] font-black tracking-[0.2em] uppercase italic">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* FOOTER SECTION */}
      <div className="p-6 border-t border-white/5 space-y-2">
        <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-white transition-colors text-[10px] font-black tracking-widest uppercase outline-none">
          <Settings size={18} /> Settings
        </button>
        <button className="w-full flex items-center gap-4 px-4 py-3 text-red-500/60 hover:text-red-500 transition-colors text-[10px] font-black tracking-widest uppercase outline-none">
          <LogOut size={18} /> Terminal Exit
        </button>
        
        {/* System Health Indicator - Matches "Market Impact: Optimal" branding */}
        <div className="mt-6 px-4 py-3 bg-white/[0.02] rounded-xl border border-white/5">
          <p className="text-[8px] text-gray-700 font-black uppercase tracking-tighter">System Health</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-widest">Optimal Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;