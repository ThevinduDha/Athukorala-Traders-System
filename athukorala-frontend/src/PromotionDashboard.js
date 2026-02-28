import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Power, X, Calendar, Percent, Sparkles, TrendingUp, CheckCircle, PowerOff, AlertTriangle, Briefcase, Box } from 'lucide-react';
import axios from 'axios';

const PromotionDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'error' });
  const [formData, setFormData] = useState({
    name: '', discountValue: '', discountType: 'PERCENTAGE', startDate: '', endDate: '', targetType: 'PRODUCT'
  });

  const triggerToast = (msg, type = 'error') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  const fetchPromotions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/promotions');
      setPromotions(res.data);
    } catch (err) { console.error("Sync error"); }
  };

  useEffect(() => { fetchPromotions(); }, []);

  const toggleStatus = async (promo) => {
    try {
      const updatedPromo = { ...promo, isActive: !promo.isActive };
      await axios.post('http://localhost:8080/api/promotions', updatedPromo);
      fetchPromotions();
      triggerToast(`System: ${updatedPromo.isActive ? 'Online' : 'Offline'}`, "success");
    } catch (err) { triggerToast("Status Update Failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const val = Number(formData.discountValue);

    if (val <= 0) return triggerToast("Value must be a positive integer!");
    if (formData.discountType === 'PERCENTAGE' && val > 100) {
      return triggerToast("Percentage cannot exceed 100%!");
    }
    if (formData.startDate < today) return triggerToast("Launch date cannot be in the past!");
    if (formData.endDate < formData.startDate) return triggerToast("Expiry must be after Launch!");

    try {
      await axios.post('http://localhost:8080/api/promotions', formData);
      setShowModal(false);
      fetchPromotions();
      triggerToast("System Engine Synchronized", "success");
    } catch (err) { triggerToast("Database Save Failed"); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen font-sans selection:bg-yellow-500/30">
      
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[3000] px-6 py-3 rounded-xl border bg-black/80 backdrop-blur-xl animate-spring-pop flex items-center gap-3 border-yellow-500/30 text-yellow-500 shadow-2xl">
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span className="text-xs font-black uppercase tracking-widest">{toast.msg}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="flex justify-between items-end mb-14 animate-spring-pop">
        <div>
          <div className="flex items-center gap-2 text-yellow-500/60 mb-1 text-[9px] font-bold uppercase tracking-[0.3em] animate-blink-industrial">
            <Sparkles size={12} /> Athukorala Industrial Engine
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic leading-none">
            Athukorala <span className="text-yellow-500">Traders</span>
          </h1>
          <p className="text-gray-400 text-base mt-2 font-medium">Elite Promotion & Strategy Management.</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)} 
          className="magnetic-reactive flex items-center gap-2 bg-yellow-600 px-8 py-4 rounded-2xl font-black text-white text-[10px] uppercase tracking-widest shadow-xl"
        >
          <Plus size={20} strokeWidth={4} /> Create Promotion
        </button>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {[
          { label: 'Live Campaigns', val: promotions.length, icon: <TrendingUp size={22}/> },
          { label: 'System Engine', val: 'ACTIVE', icon: <Calendar size={22}/> },
          { label: 'Market Impact', val: 'OPTIMAL', icon: <Percent size={22}/> },
        ].map((stat, i) => (
          <div key={i} style={{ animationDelay: `${i * 0.1}s` }} className="bg-white/[0.02] border border-white/5 p-7 rounded-[2.2rem] hover:bg-white/[0.05] magnetic-reactive animate-spring-pop">
            <div className="flex justify-between items-start mb-5 text-yellow-500/50">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 shadow-inner">{stat.icon}</div>
              <span className="text-[9px] text-gray-700 font-black uppercase tracking-widest">Sector 0{i+1}</span>
            </div>
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
            <h2 className="text-3xl font-black mt-1 text-white italic tracking-tighter uppercase">{stat.val}</h2>
          </div>
        ))}
      </div>

      {/* CAMPAIGN LIST */}
      <div className="space-y-4">
        <h3 className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] mb-8 ml-1 flex items-center gap-3">
          <Tag size={14} /> Data Stream Synchronization Active
        </h3>
        {promotions.map((promo, idx) => (
          <div 
            key={promo.id} 
            style={{ animationDelay: `${0.3 + (idx * 0.05)}s` }}
            className={`bg-white/[0.02] border p-7 rounded-[1.8rem] flex items-center justify-between group transition-all duration-700 border-white/5 hover:border-yellow-500/30 animate-spring-pop ${!promo.isActive ? 'opacity-30 grayscale blur-[0.5px]' : 'opacity-100'}`}
          >
            <div className="flex items-center gap-8">
              <div className="h-16 w-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-[1.2rem] flex items-center justify-center text-black font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                {promo.discountValue}{promo.discountType === 'PERCENTAGE' ? '%' : 'R'}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors leading-none">
                    {promo.name} {!promo.isActive && '(DEACTIVATED)'}
                </h3>
                <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-widest flex items-center gap-2">
                   <Calendar size={13}/> {promo.startDate} <span className="text-yellow-500/20">|</span> Target: {promo.targetType}
                </p>
              </div>
            </div>
            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all text-gray-400">
              <button onClick={() => toggleStatus(promo)} className={`p-4 rounded-xl transition-all magnetic-reactive ${promo.isActive ? 'bg-white/5 text-gray-500 hover:text-yellow-500' : 'bg-yellow-500 text-black shadow-lg'}`}>
                {promo.isActive ? <Power size={20}/> : <PowerOff size={20}/>}
              </button>
              <button onClick={() => { if(window.confirm("Confirm Decommission?")) axios.delete(`http://localhost:8080/api/promotions/${promo.id}`).then(fetchPromotions); }} className="p-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all magnetic-reactive shadow-lg">
                <Trash2 size={20}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- UPGRADED PREMIUM MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl flex items-center justify-center z-[2000] p-6">
          <div className="bg-[#121318] border border-white/10 w-full max-w-lg rounded-[2.8rem] p-10 relative animate-spring-pop shadow-[0_0_80px_rgba(0,0,0,1)]">
            
            {/* Close Button */}
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-yellow-400 hover:rotate-90 transition-all duration-500">
              <X size={28} />
            </button>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Configure Campaign Engine</h2>
              <p className="text-gray-600 text-[9px] font-black tracking-[0.4em] uppercase mt-3">Promotion Management • Kaduwela, Western Province</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] ml-1">Campaign Title</label>
                <input 
                  type="text" required 
                  className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 focus:border-yellow-500 outline-none text-white font-bold tracking-tight transition-all placeholder:text-gray-800 uppercase text-sm"
                  placeholder="E.G., NEW YEAR BLAST"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Toggle Logic for Type */}
              <div className="grid grid-cols-2 gap-0 border border-white/5 rounded-2xl overflow-hidden">
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, discountType: 'PERCENTAGE'})}
                  className={`py-3.5 text-[10px] font-black uppercase tracking-widest ${formData.discountType === 'PERCENTAGE' ? 'toggle-active' : 'toggle-inactive'}`}
                >
                  % Percentage (%)
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, discountType: 'FIXED_AMOUNT'})}
                  className={`py-3.5 text-[10px] font-black uppercase tracking-widest ${formData.discountType === 'FIXED_AMOUNT' ? 'toggle-active' : 'toggle-inactive'}`}
                >
                  $ Fixed Amount (Rs)
                </button>
              </div>

              {/* Value & Target */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em]">Logic Value</label>
                    <span className="text-[8px] text-gray-600 font-bold uppercase">{formData.discountType === 'PERCENTAGE' ? "0-100%" : "No Limit"}</span>
                  </div>
                  <input 
                    type="number" required min="1" max={formData.discountType === 'PERCENTAGE' ? "100" : "1000000"}
                    className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 focus:border-yellow-500 outline-none text-white font-bold text-sm"
                    placeholder="50"
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] ml-1">Target Entity</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 focus:border-yellow-500 outline-none text-white font-bold text-sm appearance-none cursor-pointer"
                      onChange={(e) => setFormData({...formData, targetType: e.target.value})}
                    >
                      <option value="PRODUCT">PRODUCT</option>
                      <option value="SERVICE">SERVICE</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] ml-1">Launch Date</label>
                  <div className="relative group">
                    <input 
                      type="date" required 
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 focus:border-yellow-500 outline-none text-white font-bold text-sm scheme-dark"
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] ml-1">Expiry Date</label>
                  <input 
                    type="date" required 
                    className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 focus:border-yellow-500 outline-none text-white font-bold text-sm scheme-dark"
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Submit Button */}
              {/* REFINED INDUSTRIAL BUTTON */}
              <div className="flex justify-center mt-6">
                <button 
                  type="submit" 
                  className="magnetic-reactive w-3/4 bg-yellow-600 hover:bg-yellow-500 py-4 rounded-xl font-black text-black text-sm transition-all active:scale-95 uppercase tracking-[0.3em] shadow-[0_10px_25px_rgba(234,179,8,0.2)]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionDashboard;