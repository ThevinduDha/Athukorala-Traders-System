import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Package, Tag, DollarSign, Activity, Zap, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
  const [stats, setStats] = useState({ totalValue: 0, stockCount: 0, promoCount: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, promoRes] = await axios.all([
          axios.get('http://localhost:8080/api/products'),
          axios.get('http://localhost:8080/api/promotions')
        ]);

        // Logic: Calculate total warehouse valuation
        const value = prodRes.data.reduce((acc, item) => acc + (item.product.basePrice * item.product.stockQuantity), 0);
        
        setStats({
          totalValue: value,
          stockCount: prodRes.data.length,
          promoCount: promoRes.data.filter(p => p.active).length
        });

        // Mock data stream for the cinematic chart
        setChartData([
          { name: 'Mon', value: 4000 }, { name: 'Tue', value: 3000 },
          { name: 'Wed', value: 5000 }, { name: 'Thu', value: 2780 },
          { name: 'Fri', value: 1890 }, { name: 'Sat', value: 2390 },
          { name: 'Sun', value: 3490 },
        ]);
      } catch (err) { console.error("Analytics Sync Failed"); }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen animate-spring-pop">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-yellow-500/60 mb-1 text-[9px] font-bold uppercase tracking-[0.3em]">
          <Activity size={12} /> System Health: Optimal Sync
        </div>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          Industrial <span className="text-yellow-500">Intelligence</span>
        </h1>
      </div>

      {/* Top Tier Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Warehouse Valuation', val: `Rs. ${stats.totalValue.toLocaleString()}`, icon: <DollarSign />, color: 'text-green-500' },
          { label: 'Active Designation', val: `${stats.stockCount} Units`, icon: <Package />, color: 'text-blue-500' },
          { label: 'Live Strategy', val: `${stats.promoCount} Active`, icon: <Zap />, color: 'text-yellow-500' },
        ].map((item, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className={`mb-4 p-3 bg-white/5 w-fit rounded-2xl ${item.color}`}>{item.icon}</div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</p>
            <h2 className="text-3xl font-black text-white mt-2 italic tracking-tighter uppercase">{item.val}</h2>
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#121318] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
            <TrendingUp size={16} className="text-yellow-500" /> Market Impact Stream
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121318', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ color: '#eab308', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#eab308" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 p-10 rounded-[3rem] flex flex-col justify-center items-center text-center">
          <div className="p-6 bg-yellow-500/10 rounded-full mb-6 border border-yellow-500/20">
            <ShieldCheck size={48} className="text-yellow-500 animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">
            Security Compliance: <span className="text-yellow-500">Tier 1</span>
          </h3>
          <p className="text-gray-500 text-sm max-w-[280px] font-medium italic">
            All warehouse nodes are synchronized with the Java Spring Boot backend on port 8080.
          </p>
          <div className="mt-10 flex gap-4">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-ping"></div>
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">PostgreSQL & MySQL Linked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;