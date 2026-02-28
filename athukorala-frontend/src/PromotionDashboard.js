import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Power, X, Calendar, Percent, Sparkles, TrendingUp } from 'lucide-react';
import axios from 'axios';

const PromotionDashboard = () => {
  // 1. STATE MANAGEMENT
  const [showModal, setShowModal] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    discountValue: '',
    discountType: 'PERCENTAGE',
    startDate: '',
    endDate: '',
    targetType: 'PRODUCT'
  });

  // 2. BACKEND CONNECTION (FETCH)
  const fetchPromotions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/promotions');
      setPromotions(res.data);
    } catch (err) { 
      console.error("Backend Connection Failed. Is IntelliJ running?"); 
    }
  };

  useEffect(() => { 
    fetchPromotions(); 
  }, []);

  // 3. FORM SUBMISSION (CREATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety Check: Date Validation
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert("Error: End date cannot be before the start date!");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/promotions', formData);
      setShowModal(false); // Close Modal
      fetchPromotions();   // Refresh List
      alert("Campaign Activated Successfully!");
    } catch (err) { 
      alert("Failed to save. Check your Backend logs."); 
    }
  };

  // 4. DELETE LOGIC
  const deletePromo = async (id) => {
    if(window.confirm("Are you sure you want to delete this industrial campaign?")) {
      try {
        await axios.delete(`http://localhost:8080/api/promotions/${id}`);
        fetchPromotions();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen font-sans selection:bg-yellow-500/30">
      
      {/* --- ELITE HEADER --- */}
      <div className="flex justify-between items-end mb-16">
        <div>
          <div className="flex items-center gap-2 text-yellow-500 font-medium mb-2">
            <Sparkles size={18} />
            <span className="uppercase tracking-[0.3em] text-xs font-bold">Industrial Marketing Engine</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
            Athukorala <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200">Traders</span>
          </h1>
          <p className="text-gray-400 mt-3 text-lg">Manage elite hardware discounts and industrial strategy.</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="group relative flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 px-8 py-4 rounded-2xl font-black text-black transition-all shadow-lg hover:shadow-yellow-500/40 active:scale-95 neon-amber"
        >
          <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
          CREATE PROMOTION
        </button>
      </div>

      {/* --- LIVE STATS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="glass-morphism p-8 rounded-[2.5rem] border-t-2 border-yellow-500/30 hover:translate-y-[-5px] transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-2xl"><TrendingUp className="text-yellow-500" /></div>
            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Active</span>
          </div>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Live Campaigns</p>
          <h2 className="text-5xl font-black mt-1 text-white tracking-tighter">{promotions.length}</h2>
        </div>

        <div className="glass-morphism p-8 rounded-[2.5rem] border-t-2 border-white/5 hover:translate-y-[-5px] transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-2xl"><Calendar className="text-gray-400" /></div>
            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Status</span>
          </div>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">System Engine</p>
          <h2 className="text-3xl font-black mt-1 text-white uppercase italic">Ready</h2>
        </div>

        <div className="glass-morphism p-8 rounded-[2.5rem] border-t-2 border-white/5 hover:translate-y-[-5px] transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-2xl"><Percent className="text-gray-400" /></div>
            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Impact</span>
          </div>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Target Reach</p>
          <h2 className="text-3xl font-black mt-1 text-white uppercase italic">Optimal</h2>
        </div>
      </div>

      {/* --- PROMOTION LIST --- */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold mb-6 text-yellow-500 flex items-center gap-3 uppercase tracking-widest">
          <Tag size={20} /> Current Active Campaigns
        </h3>
        
        {promotions.length === 0 ? (
          <div className="glass-morphism p-20 rounded-[3rem] text-center border-dashed border-2 border-white/10">
            <p className="text-gray-500 text-lg font-medium tracking-wide italic">No active promotions found in MySQL database.</p>
          </div>
        ) : (
          promotions.map((promo) => (
            <div key={promo.id} className="glass-morphism p-8 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.07] transition-all border border-white/5 hover:border-yellow-500/30">
              <div className="flex items-center gap-8">
                <div className="h-16 w-16 bg-gradient-to-br from-yellow-500 to-amber-300 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 text-black font-black text-xl">
                  {promo.discountValue}{promo.discountType === 'PERCENTAGE' ? '%' : 'R'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tight">
                    {promo.name}
                  </h3>
                  <div className="flex gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1 font-mono tracking-tighter"><Calendar size={14}/> {promo.startDate}</span>
                    <span className="text-yellow-600 font-black">/</span>
                    <span className="uppercase font-bold text-[10px] tracking-widest text-gray-400">Target: {promo.targetType}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 hover:text-white transition-all">
                  <Power size={20} />
                </button>
                <button 
                  onClick={() => deletePromo(promo.id)}
                  className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- INDUSTRIAL MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="glass-morphism w-full max-w-xl rounded-[3rem] p-10 relative border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-yellow-500 transition-colors">
              <X size={28} />
            </button>
            
            <div className="mb-10">
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">New Campaign</h2>
              <p className="text-gray-400">Configure parameters for industrial tool discounts.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Campaign Title</label>
                <input 
                  type="text" required
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-yellow-500 transition-all text-white placeholder:text-gray-700 font-bold"
                  placeholder="e.g. DRILL BLAST SALE"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Logic Type</label>
                  <select 
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-yellow-500 text-white font-bold appearance-none cursor-pointer"
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                  >
                    <option value="PERCENTAGE">PERCENTAGE (%)</option>
                    <option value="FIXED_AMOUNT">FIXED (Rs)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Discount Value</label>
                  <input 
                    type="number" required
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-yellow-500 text-white font-bold"
                    placeholder="0.00"
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Launch Date</label>
                  <input 
                    type="date" required
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-yellow-500 text-white font-bold"
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Expiry Date</label>
                  <input 
                    type="date" required
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-yellow-500 text-white font-bold"
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-400 py-5 rounded-2xl font-black text-black text-lg shadow-xl shadow-yellow-500/20 mt-4 transition-all active:scale-[0.98] uppercase tracking-[0.1em]"
              >
                ACTIVATE CAMPAIGN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionDashboard;