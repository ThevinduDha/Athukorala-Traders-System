import React, { useState, useEffect } from 'react';
import { Box, ShoppingCart, Info, Zap, Sparkles, Calendar, Clock, Plus, X, Package, Image as ImageIcon, Edit3, Trash2 } from 'lucide-react';
import axios from 'axios';

const InventoryGrid = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: '', basePrice: '', stockQuantity: '', imageUrl: '', reorderLevel: 5
  });

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/products');
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Inventory Sync Failed");
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  // Open modal for a new product
  const openCreateModal = () => {
    setEditMode(false);
    setSelectedId(null);
    setFormData({ name: '', category: '', basePrice: '', stockQuantity: '', imageUrl: '', reorderLevel: 5 });
    setShowModal(true);
  };

  // Open modal with existing data to edit
  const openEditModal = (item) => {
    setEditMode(true);
    setSelectedId(item.product.id);
    setFormData({
      name: item.product.name,
      category: item.product.category,
      basePrice: item.product.basePrice,
      stockQuantity: item.product.stockQuantity,
      imageUrl: item.product.imageUrl,
      reorderLevel: item.product.reorderLevel || 5
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to decommission this stock?")) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${id}`);
        fetchInventory();
      } catch (err) { alert("Delete Failed"); }
    }
  };

  // Update handleSubmit to handle both Add and Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:8080/api/products/${selectedId}`, formData);
      } else {
        await axios.post('http://localhost:8080/api/products', formData);
      }
      setShowModal(false);
      fetchInventory();
      setFormData({ name: '', category: '', basePrice: '', stockQuantity: '', imageUrl: '', reorderLevel: 5 });
    } catch (err) { alert("Action Failed - Check Backend Connection"); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-[#0a0a0a]">
      <div className="h-12 w-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
      <p className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px]">Synchronizing Warehouse...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* SECTION HEADER */}
      <div className="flex justify-between items-end mb-12 animate-spring-pop">
        <div>
          <div className="flex items-center gap-2 text-yellow-500/60 mb-1 text-[9px] font-bold uppercase tracking-[0.3em] animate-blink-industrial">
            <Sparkles size={12} /> Athukorala Inventory Stream
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic leading-none">
            Industrial <span className="text-yellow-500">Warehouse</span>
          </h1>
          <p className="text-gray-400 text-base mt-2 font-medium">Real-time stock & engine-optimized pricing.</p>
        </div>

        <button 
          onClick={openCreateModal}
          className="bg-yellow-600 hover:bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={4} /> Add New Stock
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div 
            key={item.product.id}
            style={{ animationDelay: `${idx * 0.1}s` }}
            className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 group hover:border-yellow-500/30 transition-all duration-500 animate-spring-pop relative overflow-hidden"
          >
            {/* PRODUCT IMAGE DISPLAY - CRASH-PROOF ENGINE */}
            <div className="h-48 w-full bg-black/40 rounded-3xl mb-6 overflow-hidden flex items-center justify-center border border-white/5 relative">
              {(() => {
                try {
                  if (item.product.imageUrl) {
                    const imagePath = require(`../assets/products/${item.product.imageUrl}`);
                    return (
                      <img 
                        src={imagePath} 
                        alt={item.product.name} 
                        className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                      />
                    );
                  }
                } catch (err) {
                  console.warn(`Asset Missing: ${item.product.imageUrl}`);
                }
                return (
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <ImageIcon size={40} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-center px-4">
                      Visual Link Broken
                    </span>
                  </div>
                );
              })()}
            </div>

            {item.isDiscounted && (
              <div className="absolute top-6 right-6 bg-yellow-600 text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-pulse z-10">
                Discount🔥
              </div>
            )}

            <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 block">
              Category: {item.product.category}
            </span>

            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors leading-none mb-6">
              {item.product.name}
            </h3>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-4">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Market Valuation</p>
              <div className="flex flex-col">
                {item.isDiscounted && (
                  <span className="text-xs text-gray-600 line-through font-bold mb-1">
                    Rs. {item.product.basePrice.toLocaleString()}
                  </span>
                )}
                <span className={`text-3xl font-black italic tracking-tighter ${item.isDiscounted ? 'text-yellow-500' : 'text-white'}`}>
                  {item.formattedPrice}
                </span>
              </div>
            </div>

            {item.isDiscounted && (
              <div className="flex items-center gap-2 mb-8 px-2 animate-pulse">
                <Clock size={12} className="text-amber-500/60" />
                <span className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest">
                  Offer Ends: {item.endDate || 'TBA'}
                </span>
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => openEditModal(item)}
                className="p-4 bg-white/5 hover:bg-yellow-600 text-gray-400 hover:text-black rounded-xl transition-all"
              >
                <Edit3 size={20} />
              </button>

              <button 
                onClick={() => handleDelete(item.product.id)}
                className="p-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>

              <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <ShoppingCart size={20} /> Buy
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[8px] text-gray-700 font-black uppercase">Stock Level</span>
                <span className="text-[10px] text-gray-400 font-bold">{item.product.stockQuantity} Units</span>
            </div>
          </div>
        ))}
      </div>

      {/* ELITE CYBER-INDUSTRIAL MODAL - FIXED VIEWPORT CENTERING */}
      {showModal && (
        <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center p-4">
          
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-[12px] transition-all duration-500"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative z-[100000] w-full max-w-lg animate-spring-pop">
            <div className="bg-[#121318]/95 border-t-2 border-x border-yellow-500/40 rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,1)] backdrop-blur-3xl overflow-hidden relative">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-pulse"></div>

              <button 
                onClick={() => setShowModal(false)} 
                className="absolute top-8 right-8 text-gray-600 hover:text-yellow-400 transition-all active:scale-75"
              >
                <X size={28} strokeWidth={3} />
              </button>
              
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                  {editMode ? 'MODIFY' : 'REGISTER'} <span className="text-yellow-500 font-black italic">STOCK</span>
                </h2>
                <p className="text-gray-600 text-[8px] font-black tracking-[0.4em] uppercase mt-3 italic">
                   ATHUKORALA INDUSTRIAL TERMINAL • V2.0
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-[9px] font-black text-yellow-500/50 group-focus-within:text-yellow-500 uppercase tracking-[0.3em] ml-1 transition-all">Unit Designation</label>
                  <input 
                    type="text" required minLength="3" value={formData.name} 
                    className="w-full bg-black/60 border border-white/5 focus:border-yellow-500/50 rounded-2xl px-6 py-4 outline-none text-white font-bold text-sm uppercase transition-all shadow-inner" 
                    placeholder="INDUSTRIAL DRILL" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2 group">
                    <label className="text-[9px] font-black text-yellow-500/50 group-focus-within:text-yellow-500 uppercase tracking-[0.3em] ml-1">Sector</label>
                    <input type="text" required value={formData.category} className="w-full bg-black/60 border border-white/5 focus:border-yellow-500/50 rounded-2xl px-6 py-4 outline-none text-white font-bold text-sm uppercase transition-all" placeholder="TOOLS" onChange={(e) => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[9px] font-black text-yellow-500/50 group-focus-within:text-yellow-500 uppercase tracking-[0.3em] ml-1">Valuation (LKR)</label>
                    <input type="number" required min="1" value={formData.basePrice} className="w-full bg-black/60 border border-white/5 focus:border-yellow-500/50 rounded-2xl px-6 py-4 outline-none text-white font-bold text-sm transition-all" placeholder="25000" onChange={(e) => setFormData({...formData, basePrice: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2 group">
                    <label className="text-[9px] font-black text-yellow-500/50 group-focus-within:text-yellow-500 uppercase tracking-[0.3em] ml-1">Quantity</label>
                    <input type="number" required min="1" value={formData.stockQuantity} className="w-full bg-black/60 border border-white/5 focus:border-yellow-500/50 rounded-2xl px-6 py-4 outline-none text-white font-bold text-sm transition-all" placeholder="50" onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})} />
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-black text-yellow-500/50 group-focus-within:text-yellow-500 uppercase tracking-[0.3em] ml-1">Image Key</label>
                     <input type="text" required value={formData.imageUrl} className="w-full bg-black/60 border border-white/5 focus:border-yellow-500/50 rounded-2xl px-6 py-4 outline-none text-white font-bold text-sm italic transition-all" placeholder="drill.png" onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className="w-full relative overflow-hidden bg-yellow-600 hover:bg-yellow-500 py-5 rounded-2xl font-black text-black text-[11px] uppercase tracking-[0.4em] shadow-[0_15px_40px_rgba(234,179,8,0.3)] transition-all active:scale-95 mt-4 group/btn">
                   <span className="relative z-10 flex items-center justify-center gap-3">
                     {editMode ? 'SYNC ENGINE' : 'COMMIT TO WAREHOUSE'} 🔄
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryGrid;