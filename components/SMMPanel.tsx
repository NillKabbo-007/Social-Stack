
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

  // Reset active category if it's not in the visible list
  useEffect(() => {
    const isCurrentVisible = visibleCategories.find(c => c.category === activeCategory);
    if (!isCurrentVisible && visibleCategories.length > 0) {
      setActiveCategory(visibleCategories[0].category);
    }
  }, [visibleCategories, activeGroup]);

  // Reset active type when category changes
  useEffect(() => {
    setActiveType('All');
  }, [activeCategory]);

  const activeCategoryData = useMemo(() => {
    return SMM_SERVICES.find(c => c.category === activeCategory) || SMM_SERVICES[0];
  }, [activeCategory]);

  const themeColor = activeCategoryData.color; // Dynamic Brand Color

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    activeCategoryData.items.forEach((item: any) => {
        if(item.type) types.add(item.type);
    });
    return ['All', ...Array.from(types)];
  }, [activeCategoryData]);

  const filteredServices = useMemo(() => {
    // 1. Base List Selection
    let baseList = [];
    if (searchQuery) {
        // Global search across all categories
        baseList = SMM_SERVICES.flatMap(cat => cat.items.map(item => ({
            ...item, 
            categoryName: cat.category, 
            categoryIcon: cat.icon, 
            categoryColor: cat.color
        })));
    } else {
        // Current category items
        baseList = activeCategoryData.items.map(item => ({
            ...item, 
            categoryName: activeCategoryData.category,
            categoryIcon: activeCategoryData.icon,
            categoryColor: activeCategoryData.color
        }));
    }

    // 2. Apply Filters
    return baseList.filter((item: any) => {
        const matchesSearch = !searchQuery || 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.id.includes(searchQuery);
        
        const matchesType = activeType === 'All' || item.type === activeType;
        
        const matchesRegion = selectedRegion === 'All' || 
            item.region === selectedRegion || 
            (selectedRegion === 'Global' && item.region === 'Global');

        return matchesSearch && matchesType && matchesRegion;
    });
  }, [activeCategoryData, activeType, searchQuery, selectedRegion]);

  // Group services by type for display
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
    if (!selectedService) return formatPrice(0);
    const rawTotal = (selectedService.price / selectedService.per) * quantity;
    return formatPrice(rawTotal);
  }, [selectedService, quantity, currency]);

  const handlePlaceOrder = () => {
    if (!selectedService) return;
    if (!link) {
        alert("Please enter a valid link.");
        return;
    }
    const rawTotal = (selectedService.price / selectedService.per) * quantity;
    
    // Simulate API call
    setTimeout(() => {
        const newOrder = {
            id: Math.floor(Math.random() * 10000) + 5000,
            date: new Date().toISOString().split('T')[0],
            service: selectedService.name,
            link: link,
            charge: rawTotal,
            quantity: quantity,
            status: 'Pending'
        };
        setOrderHistory([newOrder, ...orderHistory]);
        onBuy({
            name: `SMM: ${selectedService.name} (${quantity})`,
            price: rawTotal 
        });
        alert(`Order #${newOrder.id} placed successfully!`);
    }, 500);
  };

  const handlePlaceMassOrder = () => {
      if(!massOrderContent.trim()) return;
      const lines = massOrderContent.trim().split('\n');
      const totalOrders = lines.length;
      alert(`Processing ${totalOrders} orders via Bulk API... (Simulation)`);
      onBuy({
          name: `Mass Order (${totalOrders} items)`,
          price: totalOrders * 1.5 // Mock price
      });
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
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Global Service Aggregator</h2>
          <p className="text-slate-400">Unified access to premium SMM networks worldwide.</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700/50">
                {[
                    { id: 'single', label: 'Single Order', icon: 'fa-plus' },
                    { id: 'mass', label: 'Mass Order', icon: 'fa-layer-group' },
                    { id: 'history', label: 'Orders', icon: 'fa-clock-rotate-left' }
                ].map(mode => (
                    <button
                        key={mode.id}
                        onClick={() => setViewMode(mode.id as any)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${
                            viewMode === mode.id 
                            ? 'bg-indigo-600 text-white shadow-lg' 
                            : 'text-slate-500 hover:text-slate-200'
                        }`}
                    >
                        <i className={`fa-solid ${mode.icon}`}></i>
                        <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>

      {viewMode === 'single' && (
        <>
            {/* Filters */}
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4 items-center">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 border-b sm:border-b-0 border-slate-700/50 w-full lg:w-auto">
                        {availableGroups.map(group => (
                            <button
                                key={group}
                                onClick={() => { setActiveGroup(group); setSearchQuery(''); }}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                                    activeGroup === group 
                                    ? 'border-indigo-500 text-indigo-400' 
                                    : 'border-transparent text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {group}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex gap-4 w-full lg:w-auto">
                        <div className="relative">
                            <select 
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-8 py-2.5 text-xs font-bold focus:ring-1 focus:ring-indigo-500 text-white appearance-none cursor-pointer hover:bg-slate-800 transition-colors h-full"
                            >
                                {availableRegions.map(r => <option key={r} value={r}>{r === 'All' ? 'All Regions' : r}</option>)}
                            </select>
                            <i className="fa-solid fa-earth-americas absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none"></i>
                            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none"></i>
                        </div>

                        <div className="relative flex-1 lg:w-64">
                            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                            <input 
                            type="text"
                            placeholder="Search Service ID, Name..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setSelectedService(null);
                            }}
                            className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:ring-1 focus:ring-indigo-500 w-full text-white placeholder-slate-500"
                            />
                        </div>
                    </div>
                </div>

                {!searchQuery && (
                    <div className="space-y-4">
                        {/* Categories Horizontal Scroll */}
                        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide no-scrollbar">
                            {visibleCategories.map(cat => (
                            <button
                                key={cat.category}
                                onClick={() => {
                                setActiveCategory(cat.category);
                                setSelectedService(null);
                                setQuantity(1000);
                                }}
                                className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl transition-all border font-bold text-[11px] uppercase tracking-wider whitespace-nowrap ${
                                activeCategory === cat.category 
                                    ? `bg-[${cat.color}] text-white shadow-lg scale-105 border-transparent` 
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                                }`}
                                style={{ 
                                    backgroundColor: activeCategory === cat.category ? cat.color : undefined,
                                    borderColor: activeCategory === cat.category ? cat.color : undefined,
                                    boxShadow: activeCategory === cat.category ? `0 10px 20px -5px ${cat.color}40` : undefined
                                }}
                            >
                                <i className={`${cat.icon} text-base`}></i>
                                {cat.category}
                            </button>
                            ))}
                        </div>

                        {/* Subcategories (Types) Filters - Granular Tabs */}
                        {availableTypes.length > 1 && (
                            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300 bg-slate-900/30 p-2 rounded-xl border border-slate-800/50">
                                {availableTypes.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setActiveType(t)}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                                            activeType === t 
                                            ? 'text-white border-transparent shadow-md' 
                                            : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                        }`}
                                        style={{ 
                                            backgroundColor: activeType === t ? themeColor : 'transparent',
                                            textShadow: activeType === t ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Service List */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col border-slate-700/50 shadow-xl h-[650px]">
                        <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md flex justify-between items-center sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                                    {!searchQuery && <i className={`${activeCategoryData.icon}`} style={{ color: activeCategoryData.color }}></i>}
                                    {searchQuery && <i className="fa-solid fa-search text-slate-400"></i>}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-tighter">
                                        {searchQuery ? 'Search Results' : `${activeCategoryData.category} Catalogue`}
                                    </h3>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{filteredServices.length} Nodes Available</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 p-4 space-y-6 custom-scrollbar">
                            {Object.entries(groupedDisplayServices).map(([groupName, items]) => (
                                <div key={groupName} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {(!searchQuery && activeType === 'All' && selectedRegion === 'All') && (
                                        <div className="flex items-center gap-4 mb-3 px-2">
                                            <h4 className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg border" style={{ color: themeColor, borderColor: `${themeColor}30`, backgroundColor: `${themeColor}10` }}>
                                                {groupName}
                                            </h4>
                                            <div className="h-px bg-slate-800 flex-1"></div>
                                        </div>
                                    )}
                                    <div className="space-y-3">
                                        {(items as any[]).map((service: any) => (
                                            <div 
                                                key={service.id}
                                                onClick={() => {
                                                    setSelectedService(service);
                                                    setQuantity(Math.max(1000, service.min));
                                                }}
                                                className={`p-5 rounded-2xl cursor-pointer transition-all border relative overflow-hidden group hover:-translate-y-0.5 ${
                                                    selectedService?.id === service.id 
                                                    ? 'bg-slate-800 shadow-xl' 
                                                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-slate-600'
                                                }`}
                                                style={{ 
                                                    borderColor: selectedService?.id === service.id ? themeColor : undefined,
                                                    boxShadow: selectedService?.id === service.id ? `0 0 20px ${themeColor}20` : undefined
                                                }}
                                            >
                                                <div className="flex flex-col sm:flex-row gap-5 items-start">
                                                    {/* Service Info */}
                                                    <div className="flex-1 w-full">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-[9px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 group-hover:border-slate-500 transition-colors">ID: {service.id}</span>
                                                            {service.region && service.region !== 'Global' && (
                                                                <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded uppercase border border-amber-400/20">{service.region}</span>
                                                            )}
                                                            <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase">{service.provider}</span>
                                                        </div>
                                                        
                                                        <h4 className={`text-sm font-bold leading-tight mb-3 ${selectedService?.id === service.id ? 'text-white' : 'text-slate-200'}`}>{service.name}</h4>
                                                        
                                                        {/* Detailed Stats Grid */}
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px]">
                                                            <div className="bg-slate-950/30 p-1.5 rounded-lg border border-slate-800/50 flex flex-col justify-center">
                                                                <p className="text-slate-500 font-bold uppercase mb-0.5 text-[8px]">Speed</p>
                                                                <p className="text-emerald-400 font-bold truncate">{service.speed}</p>
                                                            </div>
                                                            <div className="bg-slate-950/30 p-1.5 rounded-lg border border-slate-800/50 flex flex-col justify-center">
                                                                <p className="text-slate-500 font-bold uppercase mb-0.5 text-[8px]">Start</p>
                                                                <p className="text-blue-400 font-bold truncate">{service.avgTime}</p>
                                                            </div>
                                                            <div className="bg-slate-950/30 p-1.5 rounded-lg border border-slate-800/50 flex flex-col justify-center">
                                                                <p className="text-slate-500 font-bold uppercase mb-0.5 text-[8px]">Refill</p>
                                                                <p className="text-amber-400 font-bold truncate">{service.guarantee}</p>
                                                            </div>
                                                            <div className="bg-slate-950/30 p-1.5 rounded-lg border border-slate-800/50 flex flex-col justify-center">
                                                                <p className="text-slate-500 font-bold uppercase mb-0.5 text-[8px]">Limit</p>
                                                                <p className="text-slate-300 font-bold truncate">{service.min}-{service.max}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Price & Action */}
                                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 sm:gap-2 pl-0 sm:pl-4 sm:border-l border-slate-700/30">
                                                        <div className="text-left sm:text-right">
                                                            <p className="text-xl font-black" style={{ color: themeColor }}>{formatPrice(service.price)}</p>
                                                            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wide bg-slate-950/50 px-1.5 py-0.5 rounded inline-block">Per 1000</p>
                                                        </div>
                                                        
                                                        <button 
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg mt-1 ${selectedService?.id === service.id ? 'text-white scale-110' : 'bg-slate-800 text-slate-600 group-hover:text-white'}`}
                                                            style={{ backgroundColor: selectedService?.id === service.id ? themeColor : undefined }}
                                                        >
                                                            {selectedService?.id === service.id ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-plus"></i>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {filteredServices.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                                    <i className="fa-solid fa-globe text-3xl mb-3 opacity-20"></i>
                                    <p className="text-xs font-bold uppercase">No global services found</p>
                                    <p className="text-[10px] mt-1">Try adjusting your region or search filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Form */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
                    <div className="glass-panel p-6 rounded-3xl border-slate-700/30 bg-gradient-to-br from-slate-900/80 to-transparent shadow-2xl sticky top-24" style={{ borderColor: selectedService ? `${themeColor}40` : undefined }}>
                        <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-white uppercase tracking-tighter">
                            <i className="fa-solid fa-cart-plus" style={{ color: themeColor }}></i> Order Terminal
                        </h3>
                        
                        {selectedService ? (
                        <div className="space-y-5 animate-in fade-in duration-300">
                            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-8 -mt-8 opacity-20 transition-colors" style={{ backgroundColor: themeColor }}></div>
                                <div className="flex justify-between items-start mb-3 relative z-10">
                                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Service Active
                                    </span>
                                    <span className="text-[9px] font-mono px-2 py-1 rounded border" style={{ color: themeColor, borderColor: `${themeColor}30`, backgroundColor: `${themeColor}10` }}>#{selectedService.id}</span>
                                </div>
                                <p className="text-sm font-bold leading-snug text-white line-clamp-2 relative z-10 mb-2">{selectedService.name}</p>
                                <div className="flex flex-wrap gap-2 relative z-10">
                                    <span className="text-[9px] bg-black/40 px-2 py-1 rounded text-slate-400 border border-white/5 uppercase font-bold"><i className="fa-solid fa-server mr-1"></i> {selectedService.provider}</span>
                                    <span className="text-[9px] bg-black/40 px-2 py-1 rounded text-slate-400 border border-white/5 uppercase font-bold"><i className="fa-solid fa-earth-americas mr-1"></i> {selectedService.region}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Link / URL</label>
                                <div className="relative group">
                                    <i className="fa-solid fa-link absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors text-xs"></i>
                                    <input 
                                        type="text"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-white shadow-inner focus:outline-none focus:border-opacity-100 transition-all"
                                        style={{ outlineColor: themeColor }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Quantity</label>
                                    <span className="text-[9px] font-bold text-slate-600 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Limit: {selectedService.min} - {selectedService.max.toLocaleString()}</span>
                                </div>
                                <div className="relative group">
                                    <i className="fa-solid fa-layer-group absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors text-xs"></i>
                                    <input 
                                        type="number"
                                        min={selectedService.min}
                                        max={selectedService.max}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white shadow-inner focus:outline-none focus:border-opacity-100 transition-all"
                                        style={{ outlineColor: themeColor }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${dripFeed ? '' : 'bg-slate-700'}`} style={{ backgroundColor: dripFeed ? themeColor : undefined }} onClick={() => setDripFeed(!dripFeed)}>
                                        <div className={`w-2 h-2 bg-white rounded-full absolute top-1 transition-all ${dripFeed ? 'left-5' : 'left-1'}`}></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Drip-Feed Mode</span>
                                </div>
                                {dripFeed && <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: themeColor }}>Active</span>}
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <div className="flex justify-between items-end mb-4 px-1">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Charge</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-white tracking-tight">{totalPrice}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handlePlaceOrder}
                                    className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest text-white shadow-xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden hover:brightness-110"
                                    style={{ backgroundColor: themeColor, boxShadow: `0 10px 20px -5px ${themeColor}40` }}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <i className="fa-solid fa-rocket group-hover:-translate-y-1 transition-transform"></i>
                                        Confirm Order
                                    </span>
                                </button>
                            </div>
                        </div>
                        ) : (
                        <div className="py-20 text-center space-y-6">
                            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-700 animate-pulse">
                                <i className="fa-solid fa-arrow-left text-slate-600 text-3xl"></i>
                            </div>
                            <div>
                                <p className="text-sm text-white font-bold uppercase tracking-wide">Select a Service</p>
                                <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] mx-auto">Choose a node from the global list to configure your order.</p>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </>
      )}

      {viewMode === 'mass' && (
          <div className="glass-panel p-8 rounded-3xl border-slate-700/50 max-w-4xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl">
                      <i className="fa-solid fa-layer-group"></i>
                  </div>
                  <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">Mass Order Processing</h3>
                      <p className="text-xs text-slate-400">Execute multiple orders simultaneously. One order per line.</p>
                  </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Format Guide</p>
                  <p className="font-mono text-sm text-emerald-400 bg-black/50 p-2 rounded border border-slate-800/50">
                      service_id | link | quantity
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2">Example: 1024 | https://instagram.com/p/Cx... | 1000</p>
              </div>

              <textarea 
                  value={massOrderContent}
                  onChange={e => setMassOrderContent(e.target.value)}
                  placeholder={`1024 | https://link.com/post1 | 1000\n1024 | https://link.com/post2 | 500\n4401 | https://youtube.com/watch?v=... | 2000`}
                  className="w-full h-64 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-sm font-mono text-slate-300 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
              ></textarea>

              <div className="flex justify-end mt-6">
                  <button onClick={handlePlaceMassOrder} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20">
                      Submit Bulk Order
                  </button>
              </div>
          </div>
      )}

      {viewMode === 'history' && (
          <div className="glass-panel p-6 rounded-3xl border-slate-700/50 animate-in slide-in-from-bottom-4 duration-500 flex flex-col h-[600px]">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">Order History</h3>
                  <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg text-[10px] font-bold uppercase hover:text-white">Export CSV</button>
                  </div>
              </div>
              
              <div className="overflow-auto flex-1 no-scrollbar rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-900/80 sticky top-0 z-10 backdrop-blur-sm">
                          <tr>
                              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID</th>
                              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Service</th>
                              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Link</th>
                              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Charge</th>
                              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Qty</th>
                              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                          {orderHistory.map(order => (
                              <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                                  <td className="p-4 text-xs font-mono text-slate-400">#{order.id}</td>
                                  <td className="p-4 text-xs font-bold text-slate-500">{order.date}</td>
                                  <td className="p-4 text-xs font-bold text-white">{order.service}</td>
                                  <td className="p-4">
                                      <a href={order.link} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 text-xs truncate block max-w-[150px]"><i className="fa-solid fa-link mr-1"></i> Link</a>
                                  </td>
                                  <td className="p-4 text-xs font-bold text-slate-300">{formatPrice(order.charge)}</td>
                                  <td className="p-4 text-xs font-bold text-slate-400">{order.quantity}</td>
                                  <td className="p-4 text-right">
                                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wide ${getStatusColor(order.status)}`}>
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
