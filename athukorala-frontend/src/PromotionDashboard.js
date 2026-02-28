import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Power, X, Calendar, Percent, Sparkles, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    
    // Strict Validations Kept Intact
    if (formData.startDate < today) return triggerToast("Start date cannot be in the past!");
    if (formData.endDate < formData.startDate) return triggerToast("End date must be after Start date!");
    if (Number(formData.discountValue) <= 0) return triggerToast("Discount must be positive!");

    try {
      await axios.post('http://localhost:8080/api/promotions', formData);
      setShowModal(false);
      fetchPromotions();
      triggerToast("System Updated Successfully", "success");
    } catch (err) { triggerToast("Database Error"); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans selection:bg-yellow-500/30">
      
      {/* Premium Toast */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-xl border bg-black/80 backdrop-blur-xl animate-popup flex items-center gap-3 ${toast.type === 'success' ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-bold tracking-wide uppercase">{toast.msg}</span>
        </div>
      )}

      {/* Header with Blinking Indicator */}
      <header className="flex justify-between items-center mb-16 animate-popup">
        <div>
          <div className="flex items-center gap-2 text-yellow-500 font-bold mb-1 text-[10px] uppercase tracking-[0.3em] animate-blink">
            <Sparkles size={12} /> Athukorala Industrial Engine
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Athukorala <span className="text-yellow-500">Traders</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Elite Promotion & Strategy Management.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-3 bg-yellow-600 hover:bg-yellow-500 px-8 py-4 rounded-2xl font-black text-white transition-all shadow-[0_0_20px_rgba(202,138,4,0.3)] active:scale-95 text-xs uppercase tracking-widest">
          <Plus size={20} strokeWidth={3} /> Create Promotion
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { label: 'Live Campaigns', val: promotions.length, icon: <TrendingUp size={22}/> },
          { label: 'System Engine', val: 'ACTIVE', icon: <Calendar size={22}/> },
          { label: 'Market Impact', val: 'OPTIMAL', icon: <Percent size={22}/> },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.06] transition-all hover:-translate-y-2 animate-popup" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/5 rounded-2xl text-yellow-500">{stat.icon}</div>
              <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Sector 0{i+1}</span>
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h2 className="text-4xl font-black mt-1 text-white italic tracking-tighter">{stat.val}</h2>
          </div>
        ))}
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mb-8 ml-2 flex items-center gap-3">
          <Tag size={14} /> Data Stream Synchronization
        </h3>
        
        {promotions.map((promo, idx) => (
          <div key={promo.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-yellow-500/30 transition-all animate-popup" style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className="flex items-center gap-8">
              <div className="h-16 w-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                {promo.discountValue}{promo.discountType === 'PERCENTAGE' ? '%' : 'R'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white uppercase italic tracking-tighter group-hover:text-yellow-500 transition-colors">{promo.name}</h3>
                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest flex items-center gap-2">
                   <Calendar size={12}/> {promo.startDate} <span className="text-yellow-500/20">|</span> Target: {promo.targetType}
                </p>
              </div>
            </div>
            <button onClick={() => { if(window.confirm("Decommission campaign?")) axios.delete(`http://localhost:8080/api/promotions/${promo.id}`).then(fetchPromotions); }} className="p-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20}/></button>
          </div>
        ))}
      </div>

      {/* Spring-Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[1000] p-6">
          <div className="bg-[#121318] border border-white/10 w-full max-w-lg rounded-[3rem] p-12 relative animate-popup shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white transition-all hover:rotate-90"><X size={32} /></button>
            <h2 className="text-3xl font-black text-white mb-10 uppercase italic tracking-tighter">Initialize System</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-1">Campaign Label</label>
                <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-yellow-500 outline-none text-white font-bold" placeholder="E.G. NEW YEAR BLAST" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-1">Logic Type</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-yellow-500 outline-none text-white font-bold" onChange={(e) => setFormData({...formData, discountType: e.target.value})}>
                    <option value="PERCENTAGE">PERCENTAGE (%)</option>
                    <option value="FIXED_AMOUNT">FIXED (RS)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-1">Value</label>
                  <input type="number" required className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-yellow-500 outline-none text-white font-bold" onChange={(e) => setFormData({...formData, discountValue: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-1">Launch</label>
                  <input type="date" required min={new Date().toISOString().split('T')[0]} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-yellow-500 outline-none text-white font-bold scheme-dark" onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-1">Expiry</label>
                  <input type="date" required className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:border-yellow-500 outline-none text-white font-bold scheme-dark" onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 py-6 rounded-2xl font-black text-white text-lg transition-all active:scale-95 uppercase tracking-widest shadow-xl mt-4">Activate Campaign</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionDashboard;