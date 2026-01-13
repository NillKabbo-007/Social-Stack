
import React, { useState, useMemo } from 'react';

interface ServiceItem {
  id: number;
  name: string;
  cost: number;
  sell: number;
}

const AdminControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'services' | 'users' | 'updates'>('stats');
  const [services, setServices] = useState<ServiceItem[]>([
    { id: 1042, name: 'IG Real Followers', cost: 1.2, sell: 2.5 },
    { id: 2018, name: 'FB Page Likes', cost: 2.5, sell: 4.2 },
    { id: 3310, name: 'TikTok Shares', cost: 0.4, sell: 1.2 },
    { id: 4401, name: 'YouTube Views (HR)', cost: 3.1, sell: 8.5 },
    { id: 5592, name: 'WA API Credits', cost: 10.0, sell: 12.0 },
    { id: 6721, name: 'Google Ads Setup', cost: 45.0, sell: 150.0 }
  ]);
  
  const [sortKey, setSortKey] = useState<'profit' | 'margin' | 'name'>('profit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Updates state
  const [updateText, setUpdateText] = useState('');
  const [updates, setUpdates] = useState([
    { id: 1, text: 'System Maintenance: Payment gateway API updated to v2.3', date: 'Oct 14, 10:00 AM' },
    { id: 2, text: 'New Feature: YouTube Live Support added to Dashboard', date: 'Oct 15, 09:00 AM' }
  ]);

  const handlePriceChange = (id: number, newSell: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, sell: newSell } : s));
  };

  const handlePostUpdate = () => {
    if(!updateText) return;
    const newUpdate = {
        id: Date.now(),
        text: updateText,
        date: new Date().toLocaleString()
    };
    setUpdates([newUpdate, ...updates]);
    setUpdateText('');
    alert("System update broadcasted to all users.");
  };

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => {
      let valA: any, valB: any;
      
      const profitA = a.sell - a.cost;
      const profitB = b.sell - b.cost;
      const marginA = (profitA / a.cost) * 100;
      const marginB = (profitB / b.cost) * 100;

      if (sortKey === 'profit') {
        valA = profitA;
        valB = profitB;
      } else if (sortKey === 'margin') {
        valA = marginA;
        valB = marginB;
      } else {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [services, sortKey, sortOrder]);

  const getScoreColor = (margin: number) => {
    if (margin > 100) return 'text-emerald-400 bg-emerald-400/10';
    if (margin > 30) return 'text-indigo-400 bg-indigo-400/10';
    return 'text-amber-400 bg-amber-400/10';
  };

  const toggleSort = (key: 'profit' | 'margin' | 'name') => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400 uppercase tracking-tighter">Master Admin Control</h2>
          <p className="text-slate-400 text-sm">System management, profit tracking, and platform health.</p>
        </div>
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          {['stats', 'services', 'users', 'updates'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                activeTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Sales', val: '$14,240', trend: '+14%', color: 'text-emerald-400' },
              { label: 'Platform Profit', val: '$2,850', trend: '+8%', color: 'text-indigo-400' },
              { label: 'Active Users', val: '1,248', trend: '+22%', color: 'text-rose-400' },
              { label: 'Pending Orders', val: '42', trend: '-2', color: 'text-amber-400' }
            ].map((s, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                <div className="flex justify-between items-end">
                  <h4 className={`text-2xl font-black ${s.color}`}>{s.val}</h4>
                  <span className="text-[10px] font-black text-emerald-500">{s.trend}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel p-8 rounded-3xl border-indigo-500/20 bg-gradient-to-br from-indigo-900/10 to-transparent">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <i className="fa-solid fa-chart-line text-indigo-500"></i>
              Profitability Distribution
            </h3>
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-900/30">
              <i className="fa-solid fa-microchip text-4xl text-slate-700 mb-4 opacity-20"></i>
              <p className="text-slate-500 italic text-sm">Advanced Data Engine Analysis Active</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="glass-panel rounded-3xl overflow-hidden border-slate-700/50 shadow-2xl">
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/30 flex justify-between items-center">
             <div>
               <h3 className="font-bold text-white uppercase tracking-tighter">Profit & Margin Orchestrator</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pricing Strategy Master</p>
             </div>
             <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20">
              <i className="fa-solid fa-plus mr-2"></i> Add New Node
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Node ID</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('name')}>
                    Service Name {sortKey === 'name' && <i className={`fa-solid fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} ml-1`}></i>}
                  </th>
                  <th className="px-6 py-4">Cost ($)</th>
                  <th className="px-6 py-4">Sell ($)</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('profit')}>
                    Profit ($) {sortKey === 'profit' && <i className={`fa-solid fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} ml-1`}></i>}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('margin')}>
                    Margin (%) {sortKey === 'margin' && <i className={`fa-solid fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} ml-1`}></i>}
                  </th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sortedServices.map(s => {
                  const profit = s.sell - s.cost;
                  const margin = (profit / s.cost) * 100;
                  return (
                    <tr key={s.id} className="hover:bg-indigo-600/5 transition-all group">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">#{s.id}</td>
                      <td className="px-6 py-4 text-sm font-bold text-white">{s.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">${s.cost.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          step="0.01"
                          value={s.sell} 
                          onChange={(e) => handlePriceChange(s.id, parseFloat(e.target.value) || 0)}
                          className="bg-slate-800 border-none rounded-lg px-2 py-1 text-sm font-bold text-indigo-400 w-20 focus:ring-1 focus:ring-indigo-500" 
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-emerald-400">
                        ${profit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-slate-300">
                        {margin.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${getScoreColor(margin)}`}>
                          {margin > 100 ? 'ULTRA' : margin > 30 ? 'HIGH' : 'STABLE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button className="text-slate-500 hover:text-indigo-400 transition-colors"><i className="fa-solid fa-gear"></i></button>
                        <button className="text-slate-500 hover:text-rose-400 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-900/50 border-t border-slate-700/50 flex justify-between items-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
              * Profit values are calculated per single unit (1k items or per service instance).
            </p>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">High Yield</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Optimal</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Competitive</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-panel p-12 text-center rounded-3xl border-slate-700/50">
           <i className="fa-solid fa-users-gear text-4xl text-slate-700 mb-4 opacity-20"></i>
           <p className="text-slate-500 uppercase font-black tracking-widest text-sm">User Management Module Offline</p>
           <p className="text-xs text-slate-600 mt-2">Connecting to Secure Auth Node...</p>
        </div>
      )}

      {activeTab === 'updates' && (
        <div className="glass-panel p-8 rounded-3xl border-slate-700/50 space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-xl uppercase tracking-tighter">Daily System Broadcast</h3>
            </div>
            
            <div className="space-y-4">
                <textarea 
                    value={updateText}
                    onChange={e => setUpdateText(e.target.value)}
                    placeholder="Enter update notification here..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white text-sm focus:ring-1 focus:ring-indigo-500 h-24"
                />
                <button onClick={handlePostUpdate} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white text-xs uppercase tracking-widest transition-all">
                    Broadcast Update
                </button>
            </div>

            <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Broadcasts</h4>
                <div className="space-y-3">
                    {updates.map(update => (
                        <div key={update.id} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl flex justify-between items-center">
                            <p className="text-sm text-slate-300">{update.text}</p>
                            <span className="text-[10px] font-bold text-slate-500">{update.date}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminControl;
