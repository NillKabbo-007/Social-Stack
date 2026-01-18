
import React, { useState, useMemo } from 'react';
import { SMM_SERVICES, GLOBAL_CURRENCIES } from '../constants';

type SortOption = 'id' | 'price-asc' | 'price-desc' | 'speed' | 'quality';
type ViewType = 'grid' | 'list';

const SMMPanel: React.FC<{ onBuy: (item: any) => void; currency?: string }> = ({ onBuy, currency = 'USD' }) => {
  const [viewMode, setViewMode] = useState<'single' | 'mass' | 'history'>('single');
  const [activeCategory, setActiveCategory] = useState(SMM_SERVICES[0].category);
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1000);
  const [link, setLink] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('id');
  const [viewType, setViewType] = useState<ViewType>('list');

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

  const filteredAndSortedItems = useMemo(() => {
    let items = currentCategoryData.items.filter(item => {
      const matchesType = activeType === 'All' || item.type === activeType;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toString().includes(searchQuery);
      return matchesType && matchesSearch;
    });

    switch (sortBy) {
      case 'price-asc': items.sort((a, b) => a.price - b.price); break;
      case 'price-desc': items.sort((a, b) => b.price - a.price); break;
      case 'speed': 
        items.sort((a, b) => {
            const valA = parseInt(a.speed) || 0;
            const valB = parseInt(b.speed) || 0;
            return valB - valA;
        });
        break;
      case 'quality':
        const qualityRank: Record<string, number> = { 'Ultra': 4, 'Premium': 3, 'HQ': 2, 'Stable': 1, 'Fast': 0 };
        items.sort((a, b) => (qualityRank[b.stability || 'Fast'] || 0) - (qualityRank[a.stability || 'Fast'] || 0));
        break;
      default: items.sort((a, b) => a.id.localeCompare(b.id)); break;
    }

    return items;
  }, [currentCategoryData, activeType, searchQuery, sortBy]);

  const handlePlaceOrder = () => {
    if (!selectedService || !link || quantity < selectedService.min) return;
    const total = (selectedService.price / 1000) * quantity;
    onBuy({ name: `SMM Node: ${selectedService.name}`, price: total });
    alert(`Order protocol initialized for Node #${selectedService.id}. Provisioning sequence started.`);
  };

  const getStabilityColor = (stability: string) => {
    switch (stability) {
      case 'Ultra': return 'text-purple-400 bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      case 'Premium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      case 'HQ': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Fast': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'Stable': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24 select-none">
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-2 h-8 bg-indigo-600 rounded-full shadow-[0_0_15px_#6366f1]"></div>
             <h2 className="text-5xl font-display font-black text-white uppercase tracking-tighter">SMM Smart Panel</h2>
          </div>
          <p className="text-slate-400 font-medium ml-5 text-sm uppercase tracking-widest opacity-60">High-Fidelity Social Capital Provisioning</p>
        </div>
        <div className="flex bg-slate-950/80 p-2 rounded-[1.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
          {['single', 'mass', 'history'].map((mode) => (
            <button 
              key={mode} 
              onClick={() => setViewMode(mode as any)} 
              className={`px-8 py-3 rounded-xl text-[10px] font-tech uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105' : 'text-slate-500 hover:text-slate-200'}`}
            >
              {mode} Access
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* SIDE NAVIGATION: NETWORKS */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-600 to-transparent opacity-50"></div>
              <p className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.4em] mb-6 ml-2 font-black">Network Registry</p>
              <div className="space-y-2">
                {SMM_SERVICES.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => { setActiveCategory(cat.category); setActiveType('All'); setSelectedService(null); }}
                    className={`w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl transition-all group border-2 ${activeCategory === cat.category ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl scale-[1.02]' : 'bg-slate-900/40 border-transparent text-slate-500 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-black/40 border border-white/5 shadow-inner group-hover:scale-110 transition-transform ${activeCategory === cat.category ? 'bg-white/20' : ''}`}>
                           <i className={`${cat.icon} text-2xl`} style={{ color: activeCategory === cat.category ? 'white' : cat.color }}></i>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-wider">{cat.category}</span>
                    </div>
                    {activeCategory === cat.category && <i className="fa-solid fa-chevron-right text-[10px]"></i>}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="glass-panel p-8 rounded-[2.5rem] border-indigo-500/10 bg-indigo-600/5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-tech text-indigo-400 uppercase tracking-widest font-black">Node Integrity</p>
                    <i className="fa-solid fa-signal text-emerald-500 text-[10px] animate-pulse"></i>
                </div>
                <div className="space-y-4">
                    {['PeakSMM', 'ViralNodes', 'MetaPro'].map(node => (
                        <div key={node} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                            <span className="text-[10px] text-slate-400 font-tech font-bold uppercase tracking-tighter">{node} Kernel</span>
                            <div className="flex items-center gap-2">
                               <span className="text-[8px] font-tech text-emerald-400 font-black">99.9%</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 py-3 bg-slate-900 border border-white/10 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:border-indigo-500/50 transition-all">Audit Global Logic</button>
            </div>
          </div>

          {/* MAIN SERVICE MATRIX */}
          <div className="lg:col-span-6 space-y-8">
            {/* SEARCH & FILTERS HUB */}
            <div className="glass-panel p-8 rounded-[3.5rem] border-white/5 space-y-8 shadow-2xl relative overflow-hidden bg-gradient-to-br from-indigo-950/20 to-slate-950">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -mr-32 -mt-32"></div>
                <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                  <div className="relative flex-1 group">
                    <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors text-lg"></i>
                    <input 
                      type="text" 
                      placeholder="SCAN NODE REGISTRY (ID OR NAME)..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="w-full bg-slate-950 border-2 border-white/5 rounded-[1.5rem] pl-16 pr-8 py-5 text-sm font-tech font-bold text-white focus:ring-0 focus:border-indigo-500/50 shadow-inner outline-none transition-all placeholder-slate-800 uppercase tracking-widest" 
                    />
                  </div>
                  <div className="flex gap-3">
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="bg-slate-950 border-2 border-white/5 rounded-[1.5rem] px-6 py-5 text-[11px] font-tech font-black text-slate-400 uppercase outline-none focus:border-indigo-500/50 transition-all cursor-pointer"
                    >
                        <option value="id">ID: Default</option>
                        <option value="price-asc">Price: Low</option>
                        <option value="price-desc">Price: High</option>
                        <option value="speed">Max Velocity</option>
                        <option value="quality">Grade: Ultra</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 relative z-10 p-1">
                    {subTypes.map(type => (
                      <button 
                        key={type} 
                        onClick={() => setActiveType(type)} 
                        className={`px-8 py-3.5 rounded-[1.25rem] text-[10px] font-tech uppercase font-black transition-all border-2 ${activeType === type ? 'bg-white border-white text-slate-950 shadow-[0_10px_20px_rgba(255,255,255,0.1)] scale-105' : 'bg-slate-950 border-white/5 text-slate-600 hover:border-indigo-500/30 hover:text-white'}`}
                      >
                        {type}
                      </button>
                    ))}
                </div>
            </div>

            {/* SERVICES LIST */}
            <div className={`space-y-6 max-h-[80vh] overflow-y-auto pr-3 no-scrollbar scroll-smooth pb-10`}>
              {filteredAndSortedItems.length > 0 ? filteredAndSortedItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => { setSelectedService(item); setQuantity(item.min); }} 
                  className={`glass-panel p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden ${selectedService?.id === item.id ? 'border-indigo-500 bg-indigo-600/5 shadow-[0_20px_50px_rgba(79,70,229,0.1)] scale-[1.01]' : 'border-white/5 hover:border-white/20'}`}
                >
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                     <i className={`${currentCategoryData.icon} text-9xl`}></i>
                  </div>

                  {/* Service Icon Node */}
                  <div 
                    className={`w-20 h-20 rounded-[1.75rem] bg-slate-900 border-2 border-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform shrink-0 relative z-10`} 
                    style={{ color: currentCategoryData.color }}
                  >
                    <i className={`${currentCategoryData.icon} text-4xl`}></i>
                    {item.stability === 'Ultra' && <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-[8px] border-2 border-[#020617] animate-bounce shadow-lg"><i className="fa-solid fa-crown"></i></div>}
                  </div>

                  <div className={`flex-1 min-w-0 space-y-4 text-center sm:text-left relative z-10`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h4 className="text-[15px] font-black text-white uppercase tracking-tight truncate leading-tight group-hover:text-indigo-400 transition-colors">{item.name}</h4>
                        {item.stability && (
                            <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase border-2 transition-all mx-auto sm:mx-0 ${getStabilityColor(item.stability)}`}>
                                {item.stability} GRADE
                            </span>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 font-tech text-[9px] uppercase tracking-widest text-slate-500">
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-xl border border-white/5"><i className="fa-solid fa-fingerprint text-indigo-500"></i> NODE #{item.id}</span>
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-xl border border-white/5"><i className="fa-solid fa-gauge-high text-indigo-500"></i> {item.speed}</span>
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-xl border border-white/5"><i className="fa-solid fa-shield-check text-emerald-500"></i> {item.guarantee}</span>
                    </div>
                  </div>

                  <div className={`flex flex-col items-center sm:items-end shrink-0 pt-6 sm:pt-0 sm:pl-8 sm:border-l sm:border-white/10 relative z-10`}>
                    <div className="flex items-end gap-1">
                       <span className="text-xl font-black text-indigo-400 mb-1">$</span>
                       <p className="text-4xl font-display font-black text-white glowing-text leading-none tracking-tighter tabular-nums">{item.price.toFixed(3)}</p>
                    </div>
                    <p className="text-[9px] text-slate-600 font-tech uppercase tracking-[0.3em] mt-3 font-black">RATE / 1.0K UNITS</p>
                    <div className="mt-4 flex gap-1">
                        {[1,2,3,4,5].map(i => <div key={i} className={`w-3 h-1 rounded-full ${i <= (item.stability === 'Ultra' ? 5 : item.stability === 'Premium' ? 4 : 3) ? 'bg-indigo-500 shadow-[0_0_5px_#6366f1]' : 'bg-slate-800'}`}></div>)}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-40 text-center glass-panel rounded-[4rem] border-dashed border-white/10 border-2 bg-slate-950/20">
                   <div className="w-24 h-24 bg-slate-900/50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border-2 border-white/5 shadow-2xl">
                       <i className="fa-solid fa-microchip text-5xl text-slate-800 animate-pulse"></i>
                   </div>
                   <p className="text-[12px] font-tech text-slate-500 uppercase tracking-[0.6em] font-black">Registry Empty: No Active Nodes in Sector</p>
                   <button onClick={() => { setActiveType('All'); setSearchQuery(''); }} className="mt-8 px-10 py-4 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Reset Global Search</button>
                </div>
              )}
            </div>
          </div>

          {/* PROVISIONING CONTROL TERMINAL */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-8 rounded-[3.5rem] border-indigo-500/30 bg-gradient-to-br from-indigo-900/30 via-slate-950 to-transparent lg:sticky lg:top-24 shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/10 blur-[100px] -mr-20 -mt-20 group-hover:bg-indigo-600/20 transition-all duration-700"></div>
              
              <div className="flex flex-col gap-10 relative z-10">
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter flex items-center gap-4">
                        <i className="fa-solid fa-terminal text-indigo-500 text-lg"></i> Provision Hub
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"><i className="fa-solid fa-circle-check text-emerald-500 text-[10px] animate-pulse"></i></div>
                </div>
              
                {selectedService ? (
                    <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
                    {/* Current Selection Node */}
                    <div className="p-8 bg-slate-950 border-2 border-indigo-500/30 rounded-[2.5rem] space-y-6 font-tech shadow-2xl relative overflow-hidden group/card">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Protocol Active</span>
                            <span className="text-[10px] font-black text-slate-700">ID: {selectedService.id}</span>
                        </div>
                        <p className="text-lg font-black text-white leading-tight uppercase tracking-tight group-hover/card:text-indigo-400 transition-colors line-clamp-2">{selectedService.name}</p>
                        <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-[8px] text-slate-600 uppercase block tracking-widest font-black">MIN PAYLOAD</span>
                                <span className="text-[13px] text-white font-black">{selectedService.min.toLocaleString()}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] text-slate-600 uppercase block tracking-widest font-black">MAX CAPACITY</span>
                                <span className="text-[13px] text-white font-black">{selectedService.max.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Input Logic */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.4em] font-black">Target Identity Node</label>
                            <i className="fa-solid fa-hashtag text-[10px] text-indigo-500"></i>
                        </div>
                        <input 
                            type="text" 
                            value={link} 
                            onChange={(e) => setLink(e.target.value)} 
                            placeholder="HTTPS://NODE.IDENTITY/PATH" 
                            className="w-full bg-slate-950/80 border-2 border-white/5 rounded-1.5rem px-8 py-5 text-[11px] font-tech font-bold text-white focus:ring-0 focus:border-indigo-500/50 shadow-inner outline-none transition-all placeholder-slate-800 uppercase tracking-widest" 
                        />
                        </div>
                        <div className="space-y-3">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.4em] font-black">Frequency Multiplier</label>
                            <i className="fa-solid fa-shuttle-space text-[10px] text-indigo-500"></i>
                        </div>
                        <div className="relative group/input">
                            <input 
                                type="number" 
                                value={quantity} 
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} 
                                className="w-full bg-slate-950/80 border-2 border-white/5 rounded-1.5rem px-8 py-6 text-5xl font-display font-black text-white focus:ring-0 focus:border-indigo-500/50 shadow-inner outline-none transition-all glowing-text tracking-tighter" 
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-700 font-tech text-[10px] uppercase font-black pointer-events-none group-focus-within/input:text-indigo-500 transition-colors">Nodes</div>
                        </div>
                        </div>
                    </div>

                    {/* Final Execution */}
                    <div className="pt-10 border-t border-white/10 space-y-10">
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-[10px] font-tech text-slate-600 uppercase tracking-[0.4em] font-black">Fuel Cell Consumption</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-indigo-400 mb-2">{currData.symbol}</span>
                                <span className="text-7xl font-display font-black text-white glowing-text tracking-tighter tabular-nums">
                                    {((selectedService.price / 1000) * quantity * currData.rate).toFixed(2)}
                                </span>
                            </div>
                            <p className="text-[9px] text-slate-700 font-tech uppercase italic mt-2 tracking-[0.3em] font-black">Authorizing cross-node sync sequence...</p>
                        </div>
                        <button 
                            onClick={handlePlaceOrder} 
                            disabled={!link || quantity < selectedService.min} 
                            className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] font-display font-black text-lg uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(79,70,229,0.3)] btn-3d disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-6 group/btn"
                        >
                            <i className="fa-solid fa-atom text-xl group-hover/btn:rotate-180 transition-transform duration-700"></i>
                            Launch Provision
                        </button>
                    </div>
                    </div>
                ) : (
                    <div className="py-48 text-center space-y-12 relative z-10 animate-pulse">
                    <div className="w-32 h-32 bg-slate-900/50 rounded-[3rem] flex items-center justify-center mx-auto border-2 border-dashed border-slate-800 shadow-inner group-hover:border-indigo-500/20 transition-colors">
                        <i className="fa-solid fa-satellite-dish text-slate-800 text-5xl group-hover:text-indigo-900 transition-colors"></i>
                    </div>
                    <div className="space-y-4">
                        <p className="text-lg font-black text-slate-700 uppercase tracking-[0.3em] italic leading-tight">Input Cluster<br/>Required</p>
                        <p className="text-[11px] text-slate-700 max-w-[220px] mx-auto leading-relaxed font-bold uppercase tracking-widest">Select a production node from the registry to initialize the sequence.</p>
                    </div>
                    </div>
                )}
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default SMMPanel;
