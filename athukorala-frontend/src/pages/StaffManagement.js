import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, Trash2, Edit3, X, Briefcase, Phone, Zap } from 'lucide-react';
import axios from 'axios';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'WAREHOUSE_OPERATOR', phone: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const fetchStaff = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/staff');
      setStaff(res.data);
      setLoading(false);
    } catch (err) { console.error("Staff synchronization failed"); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleDelete = async (id) => {
  // Simple confirmation to prevent accidental deletion
  if (window.confirm("ARE YOU SURE YOU WANT TO DECOMMISSION THIS PERSONNEL?")) {
    try {
      await axios.delete(`http://localhost:8080/api/staff/${id}`);
      // Refresh the list after successful deletion
      fetchStaff(); 
    } catch (err) {
      alert("DECOMMISSIONING FAILED: Authorization Error");
    }
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- NEW VALIDATION LOGIC START ---
    
    // 1. Name Check
    if (formData.name.trim().length < 3) {
      alert("SECURITY ALERT: Personnel name must be at least 3 characters.");
      return; // Stops the function here
    }

    // 2. Email Check (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("INVALID CREDENTIALS: Please enter a valid email address.");
      return;
    }

    // 3. Sri Lankan Phone Check
    const phoneRegex = /^(?:\+94|0)[1-9][0-9]{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      alert("COMMUNICATION ERROR: Please use a valid Sri Lankan format (+94 or 07...).");
      return;
    }

    // --- NEW VALIDATION LOGIC END ---

    try {
        if (editMode) {
            await axios.put(`http://localhost:8080/api/staff/${selectedId}`, formData);
            setSuccessMessage("PERSONNEL CREDENTIALS UPDATED 🔄");
        } else {
            await axios.post('http://localhost:8080/api/staff', formData);
            setSuccessMessage("AUTHORIZATION INITIALIZED SUCCESSFULLY 📦");
        }
        
        setShowModal(false);
        fetchStaff();

        // Clear the message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
        alert("DEPLOYMENT FAILED: Check Backend Connection");
        }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-[#0a0a0a]">
      <div className="h-12 w-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
      <p className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px]">Verifying Personnel Credentials...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-12 animate-spring-pop">
        <div>
          <div className="flex items-center gap-2 text-yellow-500/60 mb-1 text-[9px] font-bold uppercase tracking-[0.3em] animate-blink-industrial">
            <Shield size={12} /> Personnel Authorization Sector
          </div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
            Staff <span className="text-yellow-500">Directory</span>
          </h1>
          <p className="text-gray-400 text-base mt-2 font-medium italic">Manage terminal access and operative roles.</p>
        </div>

        <button 
          onClick={() => { setEditMode(false); setFormData({ name: '', email: '', role: 'WAREHOUSE_OPERATOR', phone: '' }); setShowModal(true); }}
          className="bg-yellow-600 hover:bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all active:scale-95"
        >
          <UserPlus size={18} strokeWidth={4} /> Add Personnel
        </button>
      </div>

      {/* STAFF GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {staff.map((member, idx) => (
          <div 
            key={member.id}
            style={{ animationDelay: `${idx * 0.1}s` }}
            className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 group hover:border-yellow-500/30 transition-all duration-500 animate-spring-pop relative overflow-hidden"
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="h-16 w-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 border border-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
                <Users size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tight">{member.name}</h3>
                <span className="text-[9px] font-black text-yellow-500/60 uppercase tracking-widest">{member.role}</span>
              </div>
            </div>

            <div className="space-y-4 bg-black/40 border border-white/5 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                <Mail size={16} className="text-yellow-500/40" /> {member.email}
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                <Phone size={16} className="text-yellow-500/40" /> 
                {/* The 'tel:' link enables Click to Call */}
                <a 
                href={`tel:${member.phone}`} 
                className="hover:text-yellow-500 transition-colors cursor-pointer"
                title="Click to call this personnel"
            >
                {member.phone || 'N/A'}
            </a>
            </div>
              <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                <Briefcase size={16} className="text-yellow-500/40" /> ID: ATH-00{member.id}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setEditMode(true); setSelectedId(member.id); setFormData(member); setShowModal(true); }}
                className="p-4 bg-white/5 hover:bg-yellow-600 text-gray-400 hover:text-black rounded-xl transition-all"
              >
                <Edit3 size={20} />
              </button>
              {/* Look for the red trash button in your code */}
                <button 
                onClick={() => handleDelete(member.id)} // ADD THIS LINE
                className="p-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                >
                <Trash2 size={20} />
                </button>
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <Zap size={18} className="text-yellow-500" /> Activity
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ELITE MODAL ENGINE - FIXED CENTERING */}
      {showModal && (
        <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[12px]" onClick={() => setShowModal(false)}></div>
          <div className="relative z-[100000] w-full max-w-md animate-spring-pop">
            <div className="bg-[#121318]/95 border-t-2 border-x border-yellow-500/40 rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,1)] backdrop-blur-3xl overflow-hidden relative">
              <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-yellow-500 transition-all active:scale-75">
                <X size={28} strokeWidth={3} />
              </button>
              
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                  {editMode ? 'UPDATE' : 'DEPLOY'} <span className="text-yellow-500">PERSONNEL</span>
                </h2>
                <p className="text-gray-600 text-[8px] font-black tracking-[0.4em] uppercase mt-3 italic">
                   MAIN BRANCH AUTHORIZATION
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-[9px] font-black text-yellow-500/50 uppercase tracking-[0.3em] ml-1">Full Name</label>
                  <input type="text" required value={formData.name} className="w-full bg-black/60 border border-white/5 focus:border-yellow-500/50 rounded-2xl px-6 py-4 outline-none text-white font-bold text-sm uppercase transition-all" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[9px] font-black text-yellow-500/50 uppercase tracking-[0.3em] ml-1">Email Address</label>
                  <input type="email" required value={formData.email} className="w-full bg-black/60 border border-white/5 focus:border-yellow-500/50 rounded-2xl px-6 py-4 outline-none text-white font-bold text-sm" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>

                <div className="space-y-2 group">
                <label className="text-[9px] font-black text-yellow-500/50 uppercase tracking-[0.3em] ml-1">
                    Contact Number
                </label>
                <input 
                    type="text" 
                    placeholder="+94 XXX XXX XXX"
                    value={formData.phone} 
                    className="w-full bg-black/60 border border-white/5 focus:border-yellow-500/50 rounded-2xl px-6 py-4 outline-none text-white font-bold text-sm" 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[9px] font-black text-yellow-500/50 uppercase tracking-[0.3em] ml-1">Designated Role</label>
                  <select value={formData.role} className="w-full bg-black/60 border border-white/5 focus:border-yellow-500/50 rounded-2xl px-6 py-4 outline-none text-white font-bold text-sm uppercase appearance-none cursor-pointer" onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    <option value="WAREHOUSE_OPERATOR">WAREHOUSE OPERATOR</option>
                    <option value="ADMIN">SYSTEM ADMIN</option>
                    <option value="LOGISTICS_MANAGER">LOGISTICS MANAGER</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 py-5 rounded-2xl font-black text-black text-[11px] uppercase tracking-[0.4em] shadow-xl transition-all active:scale-95 mt-4">
                   {editMode ? 'SYNC CREDENTIALS 🔄' : 'INITIALIZE AUTHORIZATION 📦'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;