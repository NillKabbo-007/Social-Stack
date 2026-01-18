
import React, { useState, useMemo } from 'react';
import { SMM_SERVICES, GLOBAL_CURRENCIES } from '../constants';

type SortOption = 'id' | 'price-asc' | 'price-desc' | 'speed';
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
  const formatPrice = (amount: number) => `${currData.symbol}${(amount * currData.rate).toFixed(2)}`;
  
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
        // Rudimentary speed sort based on the string (e.g. "20K/Day")
        items.sort((a, b) => {
            const valA = parseInt(a.speed) || 0;
            const valB = parseInt(b.speed) || 0;
            return valB - valA;
        });
        break;
      default: items.sort((a, b) => a.id.localeCompare(b.id)); break;
    }

    return items;
  }, [currentCategoryData, activeType, searchQuery, sortBy]);

  const handlePlaceOrder = () => {
    if (!selectedService || !link || quantity < selectedService.min) return;
    const total = (selectedService.price / 1000) * quantity;
    onBuy({ name: `SMM Node: ${selectedService.name}`, price: total });
    alert(`Order protocol initialized for Node #${selectedService.id}. Syncing with network frequencies...`);
  };

  const getStabilityColor = (stability: string) => {
    switch (stability) {
      case 'Ultra': return 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'Premium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'HQ': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Fast': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'Stable': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 select-none">
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Growth Matrix</h2>
          <p className="text-slate-400 font-medium">Provision high-fidelity social signals and engagement nodes.</p>
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
          {/* SIDE NAVIGATION: NETWORKS */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
            <div className="glass-panel p-4 rounded-[2.5rem] border-white/5 shadow-xl">
              <p className="text-[9px] font-tech text-slate-600 uppercase tracking-[0.3em] mb-4 ml-4">Target Network</p>
              <div className="space-y-1">
                {SMM_SERVICES.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => { setActiveCategory(cat.category); setActiveType('All'); setSelectedService(null); }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${activeCategory === cat.category ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/20 group-hover:scale-110 transition-transform">
                       <i className={`${cat.icon} text-xl`} style={{ color: activeCategory === cat.category ? 'white' : cat.color }}></i>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{cat.category}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-[2.5rem] border-indigo-500/10 bg-indigo-600/5">
                <p className="text-[9px] font-tech text-indigo-400 uppercase tracking-widest mb-3">Live Feed Integrity</p>
                <div className="space-y-3">
                    {['PeakSMM', 'ViralNodes', 'MetaPro'].map(node => (
                        <div key={node} className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-tech uppercase">{node}</span>
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                               <span className="text-[8px] font-tech text-white">NOMINAL</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* MAIN SERVICE MATRIX */}
          <div className="lg:col-span-6 space-y-6">
            {/* SEARCH & FILTERS HUB */}
            <div className="glass-panel p-6 rounded-[3rem] border-white/5 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 group">
                    <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors"></i>
                    <input 
                      type="text" 
                      placeholder="Search Node ID or Identity..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs font-tech font-bold text-white focus:ring-1 focus:ring-indigo-500 shadow-inner outline-none transition-all placeholder-slate-700" 
                    />
                  </div>
                  <div className="flex gap-2">
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="bg-slate-900 border border-white/5 rounded-2xl px-4 py-2 text-[10px] font-tech font-black text-slate-400 uppercase outline-none focus:border-indigo-500/50"
                    >
                        <option value="id">ID: Default</option>
                        <option value="price-asc">Price: Low</option>
                        <option value="price-desc">Price: High</option>
                        <option value="speed">Velocity</option>
                    </select>
                    <div className="bg-slate-900 border border-white/5 rounded-2xl p-1 flex">
                        <button onClick={() => setViewType('list')} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${viewType === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}><i className="fa-solid fa-list-ul text-xs"></i></button>
                        <button onClick={() => setViewType('grid')} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${viewType === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}><i className="fa-solid fa-table-cells-large text-xs"></i></button>
                    </div>
                  </div>
                </div>

                <div className="flex bg-slate-950/50 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                    {subTypes.map(type => (
                      <button 
                        key={type} 
                        onClick={() => setActiveType(type)} 
                        className={`px-6 py-2.5 rounded-xl text-[9px] font-tech uppercase font-black transition-all whitespace-nowrap ${activeType === type ? 'bg-white text-slate-900 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-white'}`}
                      >
                        {type}
                      </button>
                    ))}
                </div>
            </div>

            {/* SERVICES LIST/GRID */}
            <div className={`${viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'} max-h-[70vh] overflow-y-auto pr-2 no-scrollbar scroll-smooth`}>
              {filteredAndSortedItems.length > 0 ? filteredAndSortedItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => { setSelectedService(item); setQuantity(item.min); }} 
                  className={`glass-panel p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group flex flex-col relative overflow-hidden ${selectedService?.id === item.id ? 'border-indigo-600 bg-indigo-600/5 shadow-2xl scale-[1.01]' : 'border-white/5 hover:border-white/10'} ${viewType === 'list' ? 'sm:flex-row items-center gap-6' : 'gap-4'}`}
                >
                  {/* Service Icon Node */}
                  <div 
                    className={`rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform shrink-0 ${viewType === 'list' ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-2xl mb-2'}`} 
                    style={{ color: currentCategoryData.color }}
                  >
                    <i className={currentCategoryData.icon}></i>
                  </div>

                  <div className={`flex-1 min-w-0 space-y-3 ${viewType === 'grid' ? 'text-left' : 'text-center sm:text-left'}`}>
                    <div className={`flex flex-wrap items-center gap-3 ${viewType === 'grid' ? 'justify-start' : 'justify-center sm:justify-start'}`}>
                        <h4 className="text-[13px] font-black text-white uppercase tracking-tight truncate leading-tight">{item.name}</h4>
                        {item.stability && (
                            <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase border animate-pulse ${getStabilityColor(item.stability)}`}>
                                {item.stability}
                            </span>
                        )}
                    </div>
                    
                    <div className={`flex flex-wrap gap-2 font-tech text-[8px] uppercase tracking-tighter ${viewType === 'grid' ? 'justify-start' : 'justify-center sm:justify-start'}`}>
                        <span className="px-2 py-1 bg-black/40 rounded-lg border border-white/5 text-indigo-400 font-bold"># {item.id}</span>
                        <span className="px-2 py-1 bg-black/40 rounded-lg border border-white/5 text-slate-500"><i className="fa-solid fa-gauge-high mr-1 text-indigo-500"></i> {item.speed}</span>
                        <span className="px-2 py-1 bg-black/40 rounded-lg border border-white/5 text-slate-500"><i className="fa-solid fa-bolt mr-1 text-amber-500"></i> {item.avgTime}</span>
                        {item.guarantee && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">{item.guarantee} Refill</span>}
                    </div>
                  </div>

                  <div className={`flex flex-col shrink-0 ${viewType === 'list' ? 'items-center sm:items-end pt-2 sm:pt-0 sm:pl-6 sm:border-l sm:border-white/5' : 'items-start pt-4 border-t border-white/5 mt-auto'}`}>
                    <p className="text-3xl font-display font-black text-white glowing-text leading-none">${item.price.toFixed(2)}</p>
                    <p className="text-[8px] text-slate-600 font-tech uppercase tracking-[0.2em] mt-2">Rate / 1,000 Nodes</p>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-32 text-center glass-panel rounded-[3.5rem] border-dashed border-white/10 border-2">
                   <div className="w-20 h-20 bg-slate-900/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                       <i className="fa-solid fa-microchip text-4xl text-slate-800 animate-pulse opacity-20"></i>
                   </div>
                   <p className="text-[10px] font-tech text-slate-600 uppercase tracking-[0.4em]">Sector Offline: No Nodes Detected</p>
                </div>
              )}
            </div>
          </div>

          {/* PROVISIONING CONTROL TERMINAL */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-8 rounded-[3.5rem] border-indigo-500/20 bg-gradient-to-br from-indigo-900/10 via-slate-950 to-transparent lg:sticky lg:top-24 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] -mr-16 -mt-16"></div>
              
              <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4 relative z-10">
                <i className="fa-solid fa-terminal text-indigo-500 text-lg"></i> Provision Hub
              </h3>
              
              {selectedService ? (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 relative z-10">
                  {/* Current Selection Node */}
                  <div className="p-6 bg-slate-950/90 rounded-[2rem] border border-white/10 space-y-4 font-tech shadow-xl">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Active Sequence</span>
                        <span className="text-[8px] font-black text-slate-600">ID: {selectedService.id}</span>
                    </div>
                    <p className="text-[11px] font-bold text-white leading-snug uppercase tracking-tight line-clamp-2">{selectedService.name}</p>
                    <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-[7px] text-slate-500 uppercase block tracking-widest">Min Node</span>
                            <span className="text-[10px] text-white font-black">{selectedService.min}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[7px] text-slate-500 uppercase block tracking-widest">Limit</span>
                            <span className="text-[10px] text-white font-black">{selectedService.max.toLocaleString()}</span>
                        </div>
                    </div>
                  </div>

                  {/* Input Logic */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[9px] font-tech text-slate-500 uppercase tracking-[0.3em]">Target Identifier</label>
                        <i className="fa-solid fa-link text-[10px] text-indigo-500"></i>
                      </div>
                      <input 
                        type="text" 
                        value={link} 
                        onChange={(e) => setLink(e.target.value)} 
                        placeholder="https://identity.node/path" 
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-6 py-4 text-xs font-tech font-bold text-white focus:ring-1 focus:ring-indigo-500 shadow-inner outline-none transition-all placeholder-slate-700" 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[9px] font-tech text-slate-500 uppercase tracking-[0.3em]">Frequency Multiplier</label>
                        <i className="fa-solid fa-layer-group text-[10px] text-indigo-500"></i>
                      </div>
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} 
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-6 py-4 text-4xl font-display font-black text-white focus:ring-1 focus:ring-indigo-500 shadow-inner outline-none transition-all glowing-text" 
                      />
                    </div>
                  </div>

                  {/* Final Execution */}
                  <div className="pt-8 border-t border-white/10 space-y-8">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[9px] font-tech text-slate-500 uppercase tracking-[0.3em]">Operational Fuel Cost</span>
                        <div className="flex items-end gap-1">
                            <span className="text-xl font-black text-indigo-400 mb-1">$</span>
                            <span className="text-5xl font-display font-black text-white glowing-text tracking-tighter">
                                {((selectedService.price / 1000) * quantity).toFixed(2)}
                            </span>
                        </div>
                        <p className="text-[8px] text-slate-600 font-tech uppercase italic mt-1 tracking-widest">Provisioning Node cluster...</p>
                    </div>
                    <button 
                        onClick={handlePlaceOrder} 
                        disabled={!link || quantity < selectedService.min} 
                        className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-display font-black text-[13px] uppercase tracking-[0.2em] shadow-xl btn-3d disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-4 group"
                    >
                        <i className="fa-solid fa-bolt-lightning group-hover:scale-125 transition-transform"></i>
                        Execute Broadcast
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-32 text-center space-y-10 relative z-10">
                  <div className="w-24 h-24 bg-slate-900/50 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-dashed border-slate-800 animate-pulse">
                    <i className="fa-solid fa-satellite-dish text-slate-800 text-4xl"></i>
                  </div>
                  <div className="space-y-3">
                     <p className="text-sm font-black text-slate-700 uppercase tracking-widest italic leading-tight">Input Vector<br/>Required</p>
                     <p className="text-[10px] text-slate-600 max-w-[180px] mx-auto leading-relaxed font-medium">Select a service node from the matrix to initialize provisioning protocol.</p>
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
