
import React, { useState, useMemo, useEffect } from 'react';
import { SMM_SERVICES, GLOBAL_CURRENCIES } from '../constants';

const SMMPanel: React.FC<{ onBuy: (item: any) => void; currency?: string }> = ({ onBuy, currency = 'USD' }) => {
  const [viewMode, setViewMode] = useState<'single' | 'mass' | 'history'>('single');
  const [activeGroup, setActiveGroup] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState(SMM_SERVICES[0].category);
  const [activeType, setActiveType] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1000);
  const [link, setLink] = useState('');
  const [dripFeed, setDripFeed] = useState(false);
  
  // Mass Order State
  const [massOrderContent, setMassOrderContent] = useState('');

  // Mock History Data
  const [orderHistory, setOrderHistory] = useState([
    { id: 4821, date: '2024-10-12', service: 'Instagram Real Followers', link: 'https://instagram.com/user', charge: 14.50, quantity: 5000, status: 'Completed' },
    { id: 4822, date: '2024-10-13', service: 'YouTube Views (HR)', link: 'https://youtu.be/xyz123', charge: 4.50, quantity: 1000, status: 'Processing' },
    { id: 4823, date: '2024-10-14', service: 'TikTok Likes', link: 'https://tiktok.com/@video', charge: 2.20, quantity: 2000, status: 'Pending' },
    { id: 4824, date: '2024-10-14', service: 'Twitter Retweets', link: 'https://x.com/post/123', charge: 5.50, quantity: 500, status: 'Partial' },
  ]);

  const currData = GLOBAL_CURRENCIES[currency] || GLOBAL_CURRENCIES['USD'];
  const formatPrice = (amount: number) => `${currData.symbol}${(amount * currData.rate).toFixed(2)}`;

  const availableGroups = useMemo(() => {
    const groups = new Set<string>();
    SMM_SERVICES.forEach(s => groups.add(s.group));
    return ['All', ...Array.from(groups)];
  }, []);

  const visibleCategories = useMemo(() => {
    if (activeGroup === 'All') return SMM_SERVICES;
    return SMM_SERVICES.filter(s => s.group === activeGroup);
  }, [activeGroup]);

  const availableRegions = useMemo(() => {
      const regions = new Set<string>(['All']);
      SMM_SERVICES.forEach(cat => cat.items.forEach((item: any) => {
          if(item.region) regions.add(item.region);
      }));
      return Array.from(regions).sort();
  }, []);

  useEffect(() => {
    const isCurrentVisible = visibleCategories.find(c => c.category === activeCategory);
    if (!isCurrentVisible && visibleCategories.length > 0) {
      setActiveCategory(visibleCategories[0].category);
    }
  }, [visibleCategories, activeGroup]);

  useEffect(() => {
    setActiveType('All');
  }, [activeCategory]);

  const activeCategoryData = useMemo(() => {
    return SMM_SERVICES.find(c => c.category === activeCategory) || SMM_SERVICES[0];
  }, [activeCategory]);

  const themeColor = activeCategoryData.color;

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    activeCategoryData.items.forEach((item: any) => {
        if(item.type) types.add(item.type);
    });
    return ['All', ...Array.from(types)];
  }, [activeCategoryData]);

  const filteredServices = useMemo(() => {
    let baseList = [];
    if (searchQuery) {
        baseList = SMM_SERVICES.flatMap(cat => cat.items.map(item => ({
            ...item, 
            categoryName: cat.category, 
            categoryIcon: cat.icon, 
            categoryColor: cat.color
        })));
    } else {
        baseList = activeCategoryData.items.map(item => ({
            ...item, 
            categoryName: activeCategoryData.category,
            categoryIcon: activeCategoryData.icon,
            categoryColor: activeCategoryData.color
        }));
    }

    return baseList.filter((item: any) => {
        const matchesSearch = !searchQuery || 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.id.toString().includes(searchQuery);
        const matchesType = activeType === 'All' || item.type === activeType;
        const matchesRegion = selectedRegion === 'All' || 
            item.region === selectedRegion || 
            (selectedRegion === 'Global' && item.region === 'Global');
        return matchesSearch && matchesType && matchesRegion;
    });
  }, [activeCategoryData, activeType, searchQuery, selectedRegion]);

  const groupedDisplayServices = useMemo(() => {
      if (searchQuery || activeType !== 'All' || selectedRegion !== 'All') return { 'Results': filteredServices };
      const groups: Record<string, typeof filteredServices> = {};
      filteredServices.forEach(service => {
          const type = (service as any).type || 'Other';
          if (!groups[type]) groups[type] = [];
          groups[type].push(service);
      });
      return groups;
  }, [filteredServices, searchQuery, activeType, selectedRegion]);

  const totalPrice = useMemo(() => {
    if (!selectedService) return 0;
    return (selectedService.price / selectedService.per) * quantity;
  }, [selectedService, quantity]);

  const handlePlaceOrder = () => {
    if (!selectedService) return;
    if (!link) {
        alert("Please enter a destination link.");
        return;
    }
    
    setTimeout(() => {
        const newOrder = {
            id: Math.floor(Math.random() * 10000) + 5000,
            date: new Date().toISOString().split('T')[0],
            service: selectedService.name,
            link: link,
            charge: totalPrice,
            quantity: quantity,
            status: 'Pending'
        };
        setOrderHistory([newOrder, ...orderHistory]);
        onBuy({
            name: `SMM: ${selectedService.name}`,
            price: totalPrice 
        });
        alert(`Order #${newOrder.id} initiated! Deployment starting in 15m.`);
    }, 500);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Completed': return 'text-emerald-400 bg-emerald-400/10';
          case 'Processing': return 'text-blue-400 bg-blue-400/10';
          case 'Pending': return 'text-amber-400 bg-amber-400/10';
          case 'Partial': return 'text-purple-400 bg-purple-400/10';
          case 'Canceled': return 'text-rose-400 bg-rose-400/10';
          default: return 'text-slate-400 bg-slate-400/10';
      }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* Header Deck */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-heading">SMM Deployment Grid</h2>
          <p className="text-slate-400 font-medium">Provision viral energy and audience growth across global social nodes.</p>
        </div>
        
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl">
            {[
                { id: 'single', label: 'Provision', icon: 'fa-plus-circle' },
                { id: 'mass', label: 'Bulk Batch', icon: 'fa-layer-group' },
                { id: 'history', label: 'Nodes Status', icon: 'fa-wave-square' }
            ].map(mode => (
                <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as any)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        viewMode === mode.id 
                        ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-105' 
                        : 'text-slate-500 hover:text-slate-200'
                    }`}
                >
                    <i className={`fa-solid ${mode.icon}`}></i>
                    <span>{mode.label}</span>
                </button>
            ))}
        </div>
      </div>

      {viewMode === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Service Explorer */}
            <div className="lg:col-span-8 space-y-6">
                
                {/* Discovery Filters */}
                <div className="glass-panel p-6 rounded-[2.5rem] border-slate-700/50 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                        <div className="flex gap-1.5 bg-black/30 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar w-full md:w-auto">
                            {availableGroups.map(group => (
                                <button
                                    key={group}
                                    onClick={() => { setActiveGroup(group); setSearchQuery(''); }}
                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
                                        activeGroup === group 
                                        ? 'bg-white/10 text-white' 
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {group}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative group">
                                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
                                <input 
                                    type="text"
                                    placeholder="Search nodes..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setSelectedService(null); }}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm focus:ring-1 focus:ring-indigo-500 w-full md:w-64 text-white placeholder-slate-600 transition-all font-medium shadow-inner"
                                />
                            </div>
                            <div className="relative">
                                <select 
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-xs font-black uppercase tracking-widest focus:ring-1 focus:ring-indigo-500 text-slate-300 appearance-none cursor-pointer hover:bg-slate-800 transition-colors shadow-inner"
                                >
                                    {availableRegions.map(r => <option key={r} value={r}>{r === 'All' ? 'Global' : r}</option>)}
                                </select>
                                <i className="fa-solid fa-earth-americas absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] pointer-events-none"></i>
                            </div>
                        </div>
                    </div>

                    {!searchQuery && (
                        <div className="space-y-6">
                            <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
                                {visibleCategories.map(cat => (
                                    <button
                                        key={cat.category}
                                        onClick={() => { setActiveCategory(cat.category); setSelectedService(null); }}
                                        className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-[1.5rem] transition-all border-2 font-black text-xs uppercase tracking-tighter whitespace-nowrap icon-4d ${
                                        activeCategory === cat.category 
                                            ? `text-white shadow-2xl` 
                                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                                        }`}
                                        style={{ 
                                            backgroundColor: activeCategory === cat.category ? cat.color : undefined,
                                            borderColor: activeCategory === cat.category ? cat.color : undefined,
                                        }}
                                    >
                                        <i className={`${cat.icon} text-lg`}></i>
                                        {cat.category}
                                    </button>
                                ))}
                            </div>

                            {availableTypes.length > 1 && (
                                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest self-center mr-2">Layer:</span>
                                    {availableTypes.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setActiveType(t)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                activeType === t 
                                                ? 'bg-slate-800 text-white border-white/20 shadow-lg' 
                                                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                                            }`}
                                            style={{ 
                                                borderColor: activeType === t ? themeColor : undefined,
                                                color: activeType === t ? themeColor : undefined
                                            }}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Service Nodes List */}
                <div className="glass-panel rounded-[2.5rem] overflow-hidden border-slate-700/50 shadow-2xl flex flex-col h-[700px]">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 shadow-inner icon-4d">
                                {!searchQuery ? <i className={activeCategoryData.icon} style={{ color: themeColor }}></i> : <i className="fa-solid fa-search text-slate-500"></i>}
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">
                                    {searchQuery ? 'Cross-Network Search' : `${activeCategoryData.category} Core Nodes`}
                                </h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">{filteredServices.length} Active Endpoints</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar scroll-smooth">
                        {Object.entries(groupedDisplayServices).map(([groupName, items]) => (
                            <div key={groupName} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-4 mb-5 sticky top-0 bg-slate-900/80 backdrop-blur-sm py-2 z-[5]">
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/5 bg-slate-800 text-slate-300 shadow-xl">
                                        {groupName}
                                    </span>
                                    <div className="h-px bg-slate-800 flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {(items as any[]).map((service: any) => (
                                        <div 
                                            key={service.id}
                                            onClick={() => { setSelectedService(service); setQuantity(Math.max(1000, service.min)); }}
                                            className={`p-6 rounded-3xl cursor-pointer transition-all border-2 relative overflow-hidden group hover:scale-[1.01] active:scale-[0.99] ${
                                                selectedService?.id === service.id 
                                                ? 'bg-slate-800 border-indigo-500/50 shadow-2xl' 
                                                : 'bg-slate-900/40 border-slate-800 hover:border-slate-600'
                                            }`}
                                        >
                                            {/* Selection Glow */}
                                            {selectedService?.id === service.id && (
                                                <div className="absolute top-0 right-0 p-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                                                </div>
                                            )}

                                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                                <div className="flex-1 w-full space-y-4">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-[9px] font-mono font-black text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded border border-indigo-400/20">#{service.id}</span>
                                                        <span className="text-[9px] font-black text-slate-300 bg-slate-800 px-2 py-1 rounded uppercase tracking-widest">{service.provider}</span>
                                                        {service.speed === 'Instant' && <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1"><i className="fa-solid fa-bolt"></i> Instant</span>}
                                                    </div>
                                                    
                                                    <h4 className="text-base font-black text-white leading-tight font-heading">{service.name}</h4>
                                                    
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {[
                                                            { label: 'Speed', val: service.speed, icon: 'fa-gauge-high', color: 'text-indigo-400' },
                                                            { label: 'Wait', val: service.avgTime, icon: 'fa-hourglass-start', color: 'text-blue-400' },
                                                            { label: 'Refill', val: service.guarantee, icon: 'fa-shield-check', color: 'text-emerald-400' },
                                                            { label: 'Capacity', val: `${service.min}-${service.max / 1000}k`, icon: 'fa-layer-group', color: 'text-slate-400' }
                                                        ].map((spec, i) => (
                                                            <div key={i} className="bg-black/40 p-2 rounded-xl border border-white/5 flex flex-col items-center text-center justify-center">
                                                                <i className={`fa-solid ${spec.icon} text-[10px] ${spec.color} mb-1.5`}></i>
                                                                <p className="text-[9px] font-black text-white truncate max-w-full uppercase">{spec.val}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-40 gap-4 md:gap-2 md:pl-6 md:border-l border-slate-800">
                                                    <div className="text-left md:text-right">
                                                        <p className="text-3xl font-black cinematic-shine leading-none mb-1">{formatPrice(service.price)}</p>
                                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Rate / 1k</p>
                                                    </div>
                                                    
                                                    <button 
                                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl icon-4d ${selectedService?.id === service.id ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-800 text-slate-500 group-hover:text-white group-hover:bg-slate-700'}`}
                                                    >
                                                        <i className={`fa-solid ${selectedService?.id === service.id ? 'fa-check-double' : 'fa-plus'} text-lg`}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Order Console */}
            <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel p-8 rounded-[3rem] border-indigo-500/20 bg-gradient-to-br from-indigo-900/10 to-transparent sticky top-24 shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl -mr-32 -mt-32"></div>
                    
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tighter relative z-10">
                        <i className="fa-solid fa-terminal text-indigo-500"></i> Provision Console
                    </h3>
                    
                    {selectedService ? (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 relative z-10">
                        <div className="p-6 bg-slate-900/90 border border-white/5 rounded-3xl shadow-inner group-hover:border-indigo-500/30 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest flex items-center gap-2">
                                    <i className="fa-solid fa-satellite-dish animate-pulse"></i> Ready for Sync
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">Endpoint #{selectedService.id}</span>
                            </div>
                            <p className="text-base font-black text-white leading-tight mb-4">{selectedService.name}</p>
                            <div className="flex flex-wrap gap-2">
                                <div className="px-3 py-1 bg-black/40 rounded-lg text-[10px] font-bold text-slate-400 border border-white/5 flex items-center gap-1.5"><i className="fa-solid fa-earth-americas text-[8px]"></i> {selectedService.region}</div>
                                <div className="px-3 py-1 bg-black/40 rounded-lg text-[10px] font-bold text-slate-400 border border-white/5 flex items-center gap-1.5"><i className="fa-solid fa-network-wired text-[8px]"></i> {selectedService.provider}</div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Destination URL</label>
                                <div className="relative group/input">
                                    <i className="fa-solid fa-link absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors text-xs"></i>
                                    <input 
                                        type="text"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        placeholder="https://social.link/node..."
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-10 pr-4 py-4 text-xs font-bold text-white focus:ring-1 focus:ring-indigo-500 shadow-inner transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Quantum Quantity</label>
                                    <span className="text-[9px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">Min {selectedService.min}</span>
                                </div>
                                <div className="relative group/input">
                                    <i className="fa-solid fa-cubes-stacked absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors text-xs"></i>
                                    <input 
                                        type="number"
                                        min={selectedService.min}
                                        max={selectedService.max}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-10 pr-4 py-4 text-sm font-black text-white focus:ring-1 focus:ring-indigo-500 shadow-inner transition-all"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={() => setDripFeed(!dripFeed)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${dripFeed ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <i className={`fa-solid fa-clock-rotate-left ${dripFeed ? 'text-indigo-400' : 'text-slate-500'}`}></i>
                                    <span className={`text-[10px] font-black uppercase ${dripFeed ? 'text-white' : 'text-slate-500'}`}>Drip-Feed Deployment</span>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative p-1 transition-colors ${dripFeed ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full transition-all ${dripFeed ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </button>
                        </div>

                        <div className="pt-8 border-t border-slate-800">
                            <div className="flex flex-col items-center text-center mb-8">
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2">Total Project Cost</span>
                                <h3 className="text-5xl font-black text-white tracking-tighter cinematic-shine">{formatPrice(totalPrice)}</h3>
                                <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">Inclusive of Cross-Node Logic Fees</p>
                            </div>
                            
                            <button 
                                onClick={handlePlaceOrder}
                                disabled={!link || quantity < selectedService.min}
                                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-[0_10px_40px_rgba(79,70,229,0.4)] hover:shadow-[0_10px_60px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group/btn btn-3d disabled:opacity-50 disabled:grayscale"
                            >
                                <i className="fa-solid fa-rocket-launch text-lg group-hover/btn:-translate-y-1 transition-transform"></i>
                                Authorize Provision
                            </button>
                            
                            <div className="mt-6 flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase">
                                    <i className="fa-solid fa-shield-halved text-emerald-500"></i>
                                    <span>Military-grade order encryption</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase">
                                    <i className="fa-solid fa-microchip text-indigo-400"></i>
                                    <span>Gemini 3 Pro Route Optimization</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : (
                    <div className="py-24 text-center space-y-8 relative z-10">
                        <div className="w-24 h-24 bg-slate-800/40 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-dashed border-slate-700 animate-pulse">
                            <i className="fa-solid fa-arrow-left text-slate-800 text-4xl"></i>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-black text-slate-600 uppercase tracking-widest italic">Signal Search Active</p>
                            <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">Select a service node from the deployment grid to initialize the provision console.</p>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {viewMode === 'mass' && (
          <div className="glass-panel p-12 rounded-[3rem] border-slate-700/50 max-w-4xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <i className="fa-solid fa-layer-group text-9xl text-white"></i>
              </div>
              <div className="flex items-center gap-6 mb-10 relative z-10">
                  <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-2xl shadow-2xl shadow-indigo-600/30 icon-4d">
                      <i className="fa-solid fa-cubes"></i>
                  </div>
                  <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Bulk Batch Execution</h3>
                      <p className="text-sm text-slate-400">Mass deployment across multiple endpoints using structured input.</p>
                  </div>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 mb-8 relative z-10 shadow-inner">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Protocol syntax</p>
                  <code className="block font-mono text-sm text-emerald-400 bg-black/40 p-4 rounded-xl border border-white/5">
                      service_id | destination_link | volume_quantity
                  </code>
                  <p className="text-[10px] text-slate-500 mt-4 uppercase font-bold tracking-widest"><i className="fa-solid fa-info-circle mr-1"></i> Example: 1024 | https://node.com/p/x1 | 5000</p>
              </div>

              <textarea 
                  value={massOrderContent}
                  onChange={e => setMassOrderContent(e.target.value)}
                  placeholder={`1024 | https://instagram.com/p/C... | 5000\n4401 | https://youtube.com/watch?v=... | 10000`}
                  className="w-full h-80 bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 text-sm font-mono text-slate-300 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed shadow-inner mb-8"
              ></textarea>

              <div className="flex justify-end relative z-10">
                  <button 
                    onClick={() => {
                        const count = massOrderContent.split('\n').filter(l => l.trim()).length;
                        if(!count) return;
                        onBuy({ name: `Bulk Batch (${count} lines)`, price: count * 1.25 });
                        alert(`Batch Protocol Accepted: ${count} deployments sequenced.`);
                    }} 
                    className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/30 btn-3d transition-all"
                  >
                      Initiate Batch Processing
                  </button>
              </div>
          </div>
      )}

      {viewMode === 'history' && (
          <div className="glass-panel p-8 rounded-[3rem] border-slate-700/50 animate-in slide-in-from-bottom-8 duration-500 flex flex-col h-[700px] shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 border border-white/5 shadow-inner">
                        <i className="fa-solid fa-clock-rotate-left"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Active Node Log</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Tracking real-time deployment status</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                      <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all">Export Protocol Log</button>
                      <button className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"><i className="fa-solid fa-rotate"></i></button>
                  </div>
              </div>
              
              <div className="overflow-auto flex-1 no-scrollbar rounded-[2rem] border border-slate-800 shadow-inner">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-900 sticky top-0 z-10 border-b border-slate-800">
                          <tr>
                              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol ID</th>
                              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Service</th>
                              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vector Link</th>
                              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Charge</th>
                              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity</th>
                              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Node Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                          {orderHistory.map(order => (
                              <tr key={order.id} className="hover:bg-indigo-600/5 transition-all group">
                                  <td className="p-6 font-mono text-[10px] text-slate-500">#N-{order.id}</td>
                                  <td className="p-6 text-xs font-black text-slate-400 uppercase">{order.date}</td>
                                  <td className="p-6 text-sm font-black text-white group-hover:text-indigo-400 transition-colors">{order.service}</td>
                                  <td className="p-6">
                                      <a href={order.link} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-300 text-xs font-bold truncate block max-w-[200px] flex items-center gap-2"><i className="fa-solid fa-external-link text-[10px]"></i> View Vector</a>
                                  </td>
                                  <td className="p-6 text-sm font-black text-slate-200">{formatPrice(order.charge)}</td>
                                  <td className="p-6 text-sm font-black text-slate-400 tracking-tighter">{order.quantity.toLocaleString()}</td>
                                  <td className="p-6 text-right">
                                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg ${getStatusColor(order.status)}`}>
                                          {order.status}
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}
    </div>
  );
};

export default SMMPanel;
