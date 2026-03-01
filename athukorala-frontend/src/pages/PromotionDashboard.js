import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Power, X, Calendar, Percent, Sparkles, TrendingUp, CheckCircle, PowerOff, AlertTriangle, Edit3 } from 'lucide-react';
import axios from 'axios';

const PromotionDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'error' });
  const [formData, setFormData] = useState({
    name: '', discountValue: '', discountType: 'PERCENTAGE', startDate: '', endDate: '', targetType: 'PRODUCT', targetId: ''
  });

  const triggerToast = (msg, type = 'error') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'error' }), 4000);
  };

  const fetchPromotions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/promotions');
      setPromotions(res.data);
    } catch (err) { console.error("Sync error"); }
  };

  useEffect(() => { fetchPromotions(); }, []);

  const openEditModal = (promo) => {
    setEditMode(true);
    setSelectedId(promo.id);
    setFormData({
      name: promo.name,
      discountValue: promo.discountValue,
      discountType: promo.discountType,
      startDate: promo.startDate,
      endDate: promo.endDate,
      targetType: promo.targetType,
      targetId: promo.targetId || '',
      active: promo.active 
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditMode(false);
    setSelectedId(null);
    setFormData({ name: '', discountValue: '', discountType: 'PERCENTAGE', startDate: '', endDate: '', targetType: 'PRODUCT', targetId: '' });
    setShowModal(true);
  };

  const toggleStatus = async (promo) => {
    try {
      const updatedPromo = { ...promo, active: !promo.active }; 
      await axios.put(`http://localhost:8080/api/promotions/${promo.id}`, updatedPromo);
      fetchPromotions();
      triggerToast(`System: ${updatedPromo.active ? 'Online' : 'Offline'}`, "success");
    } catch (err) { triggerToast("Status Update Failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const val = Number(formData.discountValue);

    if (val <= 0) return triggerToast("Value must be a positive integer!");
    if (formData.discountType === 'PERCENTAGE' && val > 100) return triggerToast("Percentage cannot exceed 100%!");
    if (!editMode && formData.startDate < today) return triggerToast("Launch date cannot be in the past!");
    if (formData.endDate < formData.startDate) return triggerToast("Expiry must be after Launch!");
    
    if (formData.targetType !== 'GLOBAL' && !formData.targetId) {
      return triggerToast("Target ID is required for non-global offers!");
    }

    try {
      if (editMode) {
        await axios.put(`http://localhost:8080/api/promotions/${selectedId}`, formData);
        triggerToast("Campaign Updated Successfully", "success");
      } else {
        await axios.post('http://localhost:8080/api/promotions', formData);
        triggerToast("System Engine Synchronized", "success");
      }
      setShowModal(false);
      fetchPromotions();
    } catch (err) { triggerToast("Database Save Failed"); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen font-sans selection:bg-yellow-500/30">
      
      {/* Cinematic Toast Notification */}
      {toast.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[11000] px-6 py-3 rounded-xl border bg-black/80 backdrop-blur-xl animate-spring-pop flex items-center gap-3 border-yellow-500/30 text-yellow-500 shadow-2xl">
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span className="text-xs font-black uppercase tracking-widest italic">{toast.msg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
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
          onClick={openCreateModal} 
          className="magnetic-reactive flex items-center gap-2 bg-yellow-600 px-8 py-4 rounded-2xl font-black text-white text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={4} /> Create Promotion
        </button>
      </header>

      {/* DASHBOARD STATS */}
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

      {/* DATA STREAM SECTION */}
      <div className="space-y-4">
        <h3 className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] mb-8 ml-1 flex items-center gap-3">
          <Tag size={14} /> Data Stream Synchronization Active
        </h3>
        {promotions.map((promo, idx) => (
          <div 
            key={promo.id} 
            style={{ animationDelay: `${0.3 + (idx * 0.05)}s` }}
            className={`bg-white/[0.02] border p-7 rounded-[1.8rem] flex items-center justify-between group transition-all duration-700 border-white/5 hover:border-yellow-500/30 animate-spring-pop ${!promo.active ? 'opacity-30 grayscale blur-[0.5px]' : 'opacity-100'}`}
          >
            <div className="flex items-center gap-8">
              <div className="h-16 w-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-[1.2rem] flex items-center justify-center text-black font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                {promo.discountValue}{promo.discountType === 'PERCENTAGE' ? '%' : 'R'}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors leading-none">
                    {promo.name} {!promo.active && '(DEACTIVATED)'}
                </h3>
                <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-widest flex items-center gap-2">
                   <Calendar size={13}/> {promo.startDate} <span className="text-yellow-500/20">|</span> Target: {promo.targetType} {promo.targetType === 'PRODUCT' && `[ID: ${promo.targetId}]`}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all text-gray-400">
              <button onClick={() => openEditModal(promo)} className="p-4 bg-white/5 text-gray-400 hover:text-yellow-500 rounded-xl transition-all magnetic-reactive"><Edit3 size={20}/></button>
              <button onClick={() => toggleStatus(promo)} className={`p-4 rounded-xl transition-all magnetic-reactive ${promo.active ? 'bg-white/5 text-gray-500 hover:text-yellow-500' : 'bg-yellow-500 text-black shadow-lg'}`}>
                {promo.active ? <Power size={20}/> : <PowerOff size={20}/>}
              </button>
              <button onClick={() => { if(window.confirm("Confirm Decommission?")) axios.delete(`http://localhost:8080/api/promotions/${promo.id}`).then(fetchPromotions); }} className="p-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all magnetic-reactive shadow-lg">
                <Trash2 size={20}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REFINED COMPACT CINEMATIC MODAL */}
      {showModal && (
        <div className="fixed inset-0 w-screen h-screen z-[10000] flex items-center justify-center">
          
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-[15px] transition-all duration-700"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative z-[10001] w-full max-w-md mx-auto px-4 animate-spring-pop">
            <div className="bg-[#121318]/95 border border-white/10 rounded-[2.5rem] p-8 shadow-[0_40px_120px_rgba(0,0,0,1)] backdrop-blur-3xl relative overflow-hidden group">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent animate-pulse"></div>

              <button 
                onClick={() => setShowModal(false)} 
                className="absolute top-6 right-8 text-gray-600 hover:text-yellow-400 hover:rotate-90 transition-all duration-500 active:scale-75"
              >
                <X size={24} strokeWidth={3} />
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                  {editMode ? 'MODIFY' : 'INITIALIZE'} <span className="text-yellow-500 font-black italic">CAMPAIGN</span>
                </h2>
                <p className="text-gray-600 text-[7px] font-bold tracking-[0.4em] uppercase mt-2 italic">
                   PROMOTION MANAGEMENT • KADUWELA SECTOR
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Compact Field: Title */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.3em] ml-1">Campaign Title</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    className="w-full bg-black/40 border border-white/5 focus:border-yellow-500/50 rounded-xl px-5 py-3 outline-none text-white font-bold text-sm uppercase transition-all shadow-inner" 
                    placeholder="E.G., NEW YEAR BLAST" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>

                {/* Compact Toggle Selector */}
                <div className="grid grid-cols-2 gap-0 border border-white/5 rounded-xl overflow-hidden shadow-inner">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, discountType: 'PERCENTAGE'})} 
                    className={`py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${formData.discountType === 'PERCENTAGE' ? 'bg-yellow-600 text-black shadow-inner' : 'bg-black/40 text-gray-500 hover:text-gray-300'}`}
                  >
                    % Percentage (%)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, discountType: 'FIXED_AMOUNT'})} 
                    className={`py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${formData.discountType === 'FIXED_AMOUNT' ? 'bg-yellow-600 text-black shadow-inner' : 'bg-black/40 text-gray-500 hover:text-gray-300'}`}
                  >
                    $ Fixed (Rs)
                  </button>
                </div>

                {/* Value & Target Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.3em] ml-1">Value</label>
                    <input 
                      type="number" 
                      required 
                      min="1" 
                      max={formData.discountType === 'PERCENTAGE' ? "100" : "1000000"} 
                      value={formData.discountValue} 
                      className="w-full bg-black/40 border border-white/5 focus:border-yellow-500/50 rounded-xl px-5 py-3 outline-none text-white font-bold text-sm transition-all" 
                      placeholder="50" 
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.3em] ml-1">Target</label>
                    <select 
                      value={formData.targetType} 
                      className="w-full bg-black/40 border border-white/5 focus:border-yellow-500/50 rounded-xl px-5 py-3 outline-none text-white font-bold text-sm appearance-none cursor-pointer" 
                      onChange={(e) => setFormData({...formData, targetType: e.target.value})}
                    >
                      <option value="GLOBAL">GLOBAL</option>
                      <option value="PRODUCT">PRODUCT</option>
                      <option value="SERVICE">SERVICE</option>
                    </select>
                  </div>
                </div>

                {/* Compact Target ID */}
                {formData.targetType !== 'GLOBAL' && (
                  <div className="space-y-1.5 animate-spring-pop">
                    <label className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.3em] ml-1">Target ID (SQL ID)</label>
                    <input 
                      type="number" 
                      required 
                      value={formData.targetId || ''} 
                      className="w-full bg-black/40 border border-white/5 focus:border-yellow-500/50 rounded-xl px-5 py-3 outline-none text-white font-bold text-sm transition-all" 
                      placeholder="E.G., 1" 
                      onChange={(e) => setFormData({...formData, targetId: e.target.value})} 
                    />
                  </div>
                )}

                {/* Compact Timeline Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.3em] ml-1">Launch</label>
                    <input 
                      type="date" 
                      required 
                      min={!editMode ? new Date().toISOString().split('T')[0] : ""} 
                      value={formData.startDate} 
                      className="w-full bg-black/40 border border-white/5 focus:border-yellow-500/50 rounded-xl px-5 py-3 outline-none text-white font-bold text-sm scheme-dark transition-all" 
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.3em] ml-1">Expiry</label>
                    <input 
                      type="date" 
                      required 
                      value={formData.endDate} 
                      className="w-full bg-black/40 border border-white/5 focus:border-yellow-500/50 rounded-xl px-5 py-3 outline-none text-white font-bold text-sm scheme-dark transition-all" 
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                    />
                  </div>
                </div>

                {/* Optimized Action Button */}
                <button 
                  type="submit" 
                  className="w-full bg-yellow-600 hover:bg-yellow-500 py-4 rounded-xl font-black text-black text-[10px] uppercase tracking-[0.4em] shadow-xl transition-all active:scale-95 mt-4"
                >
                  {editMode ? 'SYNC ENGINE' : 'INITIALIZE ENGINE'} ✨
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionDashboard;