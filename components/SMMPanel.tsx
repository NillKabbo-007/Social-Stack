
import React, { useState, useMemo } from 'react';
import { SMM_SERVICES, GLOBAL_CURRENCIES } from '../constants';

const SMMPanel: React.FC<{ onBuy: (item: any) => void; currency?: string }> = ({ onBuy, currency = 'USD' }) => {
  const [viewMode, setViewMode] = useState<'single' | 'mass' | 'history'>('single');
  const [activeCategory, setActiveCategory] = useState(SMM_SERVICES[0].category);
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1000);
  const [link, setLink] = useState('');

  const currData = GLOBAL_CURRENCIES[currency] || GLOBAL_CURRENCIES['USD'];
  
  const currentCategoryData = useMemo(() => {
    return SMM_SERVICES.find(c => c.category === activeCategory) || SMM_SERVICES[0];
  }, [activeCategory]);

  const subTypes = useMemo(() => {
    const types = new Set<string>(['All']);
    currentCategoryData.items.forEach(item => {
      if (item.type) types.add(item.type);
    });
    return Array.from(types);
  }, [currentCategoryData]);

  const filteredItems = useMemo(() => {
    return currentCategoryData.items.filter(item => {
      const matchesType = activeType === 'All' || item.type === activeType;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toString().includes(searchQuery);
      return matchesType && matchesSearch;
    });
  }, [currentCategoryData, activeType, searchQuery]);

  const handlePlaceOrder = () => {
    if (!selectedService || !link || quantity < selectedService.min) return;
    const total = (selectedService.price / 1000) * quantity;
    onBuy({ name: `SMM Node: ${selectedService.name}`, price: total });
    alert(`Order protocol initialized for Node #${selectedService.id}. Syncing with network...`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 select-none">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Engagement Matrix</h2>
          <p className="text-slate-400 font-medium">Provision high-scale social signals across the global graph.</p>
        </div>
        <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-3xl shadow-2xl">
          {['single', 'mass', 'history'].map((mode) => (
            <button 
              key={mode} 
              onClick={() => setViewMode(mode as any)} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-tech uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {mode} Terminal
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Category Navigation */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass-panel p-4 rounded-[2rem] border-white/5 shadow-xl">
              <p className="text-[9px] font-tech text-slate-600 uppercase tracking-[0.3em] mb-4 ml-4">Target Network</p>
              <div className="space-y-1">
                {SMM_SERVICES.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => { setActiveCategory(cat.category); setActiveType('All'); setSelectedService(null); }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${activeCategory === cat.category ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                  >
                    <i className={`${cat.icon} text-lg transition-transform group-hover:scale-110`} style={{ color: activeCategory === cat.category ? 'white' : cat.color }}></i>
                    <span className="text-[11px] font-black uppercase tracking-widest">{cat.category}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-[2rem] border-indigo-500/10 bg-indigo-600/5">
                <p className="text-[9px] font-tech text-indigo-400 uppercase tracking-widest mb-2">Network Status</p>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-tech font-bold text-white uppercase tracking-tighter">All Nodes Operational</span>
                </div>
            </div>
          </div>

          {/* Service Matrix */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input 
                  type="text" 
                  placeholder="Filter Node ID or Name..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs font-tech font-bold text-white focus:ring-1 focus:ring-indigo-500 shadow-inner" 
                />
              </div>
              <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                {subTypes.map(type => (
                  <button 
                    key={type} 
                    onClick={() => setActiveType(type)} 
                    className={`px-5 py-2 rounded-xl text-[9px] font-tech uppercase font-black transition-all whitespace-nowrap ${activeType === type ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-white'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar scroll-smooth">
              {filteredItems.length > 0 ? filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => { setSelectedService(item); setQuantity(item.min); }} 
                  className={`glass-panel p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group flex flex-col sm:flex-row items-center gap-6 ${selectedService?.id === item.id ? 'border-indigo-600 bg-indigo-600/5 shadow-2xl scale-[1.01]' : 'border-white/5 hover:border-white/10'}`}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform" 
                    style={{ color: currentCategoryData.color }}
                  >
                    <i className={currentCategoryData.icon}></i>
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight truncate mb-2">{item.name}</h4>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 font-tech text-[8px] uppercase tracking-tighter text-slate-500">
                        <span className="px-2 py-0.5 bg-white/5 rounded border border-white/5 text-indigo-400">NODE: #{item.id}</span>
                        <span className="px-2 py-0.5 bg-white/5 rounded border border-white/5">SPD: {item.speed}</span>
                        <span className="px-2 py-0.5 bg-white/5 rounded border border-white/5">START: {item.avgTime}</span>
                        {item.guarantee && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/10">SYNC: {item.guarantee}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-end flex-shrink-0">
                    <p className="text-3xl font-display font-black text-white glowing-text leading-none">${item.price.toFixed(2)}</p>
                    <p className="text-[8px] text-slate-600 font-tech uppercase tracking-[0.2em] mt-2">/ 1,000 units</p>
                  </div>
                </div>
              )) : (
                <div className="py-24 text-center glass-panel rounded-[3rem] border-dashed border-white/10">
                   <i className="fa-solid fa-microchip text-4xl text-slate-800 mb-4 opacity-20"></i>
                   <p className="text-[10px] font-tech text-slate-600 uppercase tracking-widest">No active nodes in this sector</p>
                </div>
              )}
            </div>
          </div>

          {/* Provisioning Control */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-8 rounded-[3rem] border-indigo-500/20 bg-gradient-to-br from-indigo-900/10 to-transparent sticky top-24 shadow-2xl">
              <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                <i className="fa-solid fa-terminal text-indigo-500"></i> Provision Node
              </h3>
              
              {selectedService ? (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="p-5 bg-slate-950/80 rounded-2xl border border-white/5 space-y-3 font-tech">
                    <p className="text-[10px] font-bold text-white leading-snug uppercase tracking-tight">{selectedService.name}</p>
                    <div className="flex justify-between text-[8px] text-indigo-400 uppercase tracking-widest">
                        <span>Min Threshold</span>
                        <span className="font-black">{selectedService.min}</span>
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-500 uppercase tracking-widest">
                        <span>Max Capacity</span>
                        <span className="font-black">{selectedService.max.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-tech text-slate-600 uppercase tracking-[0.3em] ml-1">Destination Target</label>
                      <input 
                        type="text" 
                        value={link} 
                        onChange={(e) => setLink(e.target.value)} 
                        placeholder="https://platform.node/identity" 
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-4 text-xs font-tech font-bold text-white focus:ring-1 focus:ring-indigo-500 shadow-inner" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-tech text-slate-600 uppercase tracking-[0.3em] ml-1">Volume Multicast</label>
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} 
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-4 text-2xl font-display font-black text-white focus:ring-1 focus:ring-indigo-500 shadow-inner glowing-text" 
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-6">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-tech text-slate-500 uppercase tracking-[0.2em]">Execution Cost</span>
                        <span className="text-3xl font-display font-black text-white glowing-text">
                            ${((selectedService.price / 1000) * quantity).toFixed(2)}
                        </span>
                    </div>
                    <button 
                        onClick={handlePlaceOrder} 
                        disabled={!link || quantity < selectedService.min} 
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-display font-black text-[12px] uppercase tracking-[0.2em] shadow-xl btn-3d disabled:opacity-50 disabled:grayscale transition-all"
                    >
                        Authorize Provisioning
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center space-y-8">
                  <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto border border-dashed border-slate-800 animate-pulse">
                    <i className="fa-solid fa-satellite-dish text-slate-800 text-3xl"></i>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-tech text-slate-700 uppercase tracking-[0.3em] italic">Awaiting Sector Selection</p>
                     <p className="text-[9px] text-slate-800 uppercase tracking-widest max-w-[160px] mx-auto leading-relaxed">Select an engagement node from the matrix to initialize a provision request.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default SMMPanel;
