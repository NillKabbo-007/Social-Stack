
import React, { useState, useMemo } from 'react';
import { RDP_SERVICES_DATA, PROXY_DATA } from '../constants';

const RDPServices: React.FC<{ onBuy: (item: any) => void }> = ({ onBuy }) => {
  const [activeTab, setActiveTab] = useState<'rdp' | 'proxy'>('rdp');
  
  // RDP State
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedOS, setSelectedOS] = useState<Record<string, string>>({});
  const [rdpSearch, setRdpSearch] = useState('');

  // Proxy State
  const [proxyType, setProxyType] = useState<string>('All');
  const [proxyLocation, setProxyLocation] = useState<string>('All');
  const [proxyProvider, setProxyProvider] = useState<string>('All');
  const [proxySearch, setProxySearch] = useState('');

  // RDP Logic
  const handleBuyRDP = (rdp: any) => {
    const os = selectedOS[rdp.name] || 'Windows Server 2022';
    const price = billingCycle === 'yearly' ? rdp.price * 10 : rdp.price;
    onBuy({ 
      name: `${rdp.name} (${os}) - ${billingCycle}`, 
      price: price 
    });
  };

  const filteredRDPs = useMemo(() => {
    return RDP_SERVICES_DATA.filter(rdp => 
      rdp.name.toLowerCase().includes(rdpSearch.toLowerCase()) ||
      rdp.provider.toLowerCase().includes(rdpSearch.toLowerCase())
    );
  }, [rdpSearch]);

  // Proxy Logic
  const filteredProxies = useMemo(() => {
    return PROXY_DATA.filter(proxy => {
        const matchesType = proxyType === 'All' || proxy.type === proxyType;
        const matchesLocation = proxyLocation === 'All' || proxy.locations.includes(proxyLocation) || (proxyLocation === 'Global' && proxy.locations.includes('Global'));
        const matchesProvider = proxyProvider === 'All' || proxy.provider === proxyProvider;
        const matchesSearch = proxy.name.toLowerCase().includes(proxySearch.toLowerCase()) || proxy.provider.toLowerCase().includes(proxySearch.toLowerCase());
        return matchesType && matchesLocation && matchesSearch && matchesProvider;
    });
  }, [proxyType, proxyLocation, proxyProvider, proxySearch]);

  const uniqueProxyTypes = useMemo(() => ['All', ...Array.from(new Set(PROXY_DATA.map(p => p.type)))], []);
  
  const uniqueLocations = useMemo(() => {
      const locs = new Set<string>();
      PROXY_DATA.forEach(p => p.locations.forEach(l => locs.add(l)));
      return ['All', ...Array.from(locs).sort()];
  }, []);

  const uniqueProviders = useMemo(() => ['All', ...Array.from(new Set(PROXY_DATA.map(p => p.provider)))], []);

  const ProviderBadge = ({ icon, color, size = 'md' }: { icon: string, color: string, size?: 'sm' | 'md' | 'lg' }) => {
      const sizeClasses = {
          sm: 'w-10 h-10 text-lg',
          md: 'w-14 h-14 text-2xl',
          lg: 'w-16 h-16 text-3xl'
      };
      
      return (
        <div className={`${sizeClasses[size]} rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-slate-800 border border-white/10`}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundColor: color }}></div>
            <i className={`${icon} relative z-10`} style={{ color: color }}></i>
        </div>
      );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight font-heading drop-shadow-sm">Infrastructure Node Hub</h2>
          <p className="text-slate-400 font-medium mt-1 text-base">Deploy scalable cloud compute instances and high-anonymity proxy networks.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700/50 shadow-inner flex shrink-0 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('rdp')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'rdp' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <i className="fa-solid fa-server"></i> Cloud VPS
          </button>
          <button
            onClick={() => setActiveTab('proxy')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'proxy' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-105' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <i className="fa-solid fa-network-wired"></i> Proxy Nodes
          </button>
        </div>
      </div>

      {activeTab === 'rdp' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* RDP Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 shadow-xl backdrop-blur-xl">
                <div className="relative w-full sm:w-auto flex-1 max-w-md group">
                    <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-indigo-500 transition-colors"></i>
                    <input 
                        type="text" 
                        placeholder="Search provider (e.g. AWS, Azure)..." 
                        value={rdpSearch}
                        onChange={(e) => setRdpSearch(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-sm focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 transition-all font-medium"
                    />
                </div>

                <div className="flex bg-slate-800 border border-slate-700 p-1 rounded-xl relative shadow-lg">
                    <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase transition-all z-10 ${billingCycle === 'monthly' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>Monthly</button>
                    <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase transition-all z-10 ${billingCycle === 'yearly' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-400 hover:text-slate-200'}`}>Yearly (-20%)</button>
                </div>
            </div>

            {/* RDP Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRDPs.map((rdp, idx) => {
                const brandColor = (rdp as any).brandColor || '#6366f1';
                const annualPrice = rdp.price * 10; // 2 months free equivalent
                
                return (
                <div key={idx} 
                     className="glass-panel p-0 rounded-[2.5rem] relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-800 hover:border-slate-600 flex flex-col"
                >
                    {/* Header with Brand Color */}
                    <div className="p-8 relative overflow-hidden bg-slate-900/50">
                        <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${brandColor}, transparent)` }}></div>
                        <div className="flex items-center gap-5 relative z-10">
                            <ProviderBadge icon={rdp.providerIcon} color={brandColor} size="md" />
                            <div>
                                <h3 className="text-xl font-heading font-black text-white leading-tight">{rdp.name}</h3>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1 opacity-80 flex items-center gap-1">
                                    {rdp.provider} <i className="fa-solid fa-circle-check text-blue-400 text-[8px]"></i>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 space-y-6 flex-1 flex flex-col bg-slate-900/20 backdrop-blur-md">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'vCPU', val: rdp.cpu, icon: 'fa-microchip' },
                                { label: 'RAM', val: rdp.ram, icon: 'fa-memory' },
                                { label: 'Storage', val: rdp.storage, icon: 'fa-hard-drive' },
                                { label: 'Region', val: rdp.region, icon: 'fa-globe' }
                            ].map((spec, i) => (
                                <div key={i} className="flex flex-col p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1.5">
                                        <i className={`fa-solid ${spec.icon} text-[10px] opacity-70`}></i> {spec.label}
                                    </span>
                                    <span className="text-sm font-bold text-white tracking-wide">{spec.val}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Operating System</label>
                            <div className="relative">
                                <select 
                                    value={selectedOS[rdp.name] || 'Windows Server 2022'} 
                                    onChange={(e) => setSelectedOS(prev => ({...prev, [rdp.name]: e.target.value}))}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:ring-1 focus:ring-indigo-500 appearance-none hover:border-slate-600 transition-colors cursor-pointer shadow-inner"
                                >
                                    <option>Windows Server 2022</option>
                                    <option>Windows 11 Enterprise</option>
                                    <option>Ubuntu 24.04 LTS</option>
                                    <option>Kali Linux</option>
                                    <option>Debian 12</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <i className="fa-solid fa-chevron-down text-xs"></i>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-slate-500">$</span>
                                    <span className="text-3xl font-heading font-black text-white tracking-tight">{billingCycle === 'yearly' ? annualPrice : rdp.price}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleBuyRDP(rdp)}
                                className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 btn-3d"
                                style={{ backgroundColor: brandColor, boxShadow: `0 10px 20px -5px ${brandColor}40` }}
                            >
                                <i className="fa-solid fa-rocket"></i> Deploy
                            </button>
                        </div>
                    </div>
                </div>
                );
            })}
            </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          
          {/* Enhanced Proxy Filter Bar */}
          <div className="glass-panel p-6 rounded-[2.5rem] border-slate-700/50 flex flex-col gap-6 shadow-2xl">
             <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                 <div className="relative w-full lg:w-96 group">
                    <i className="fa-solid fa-filter absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
                    <input 
                        type="text" 
                        placeholder="Search proxies..." 
                        value={proxySearch}
                        onChange={(e) => setProxySearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-3 text-sm focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 transition-all font-medium shadow-inner"
                    />
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Location Filter */}
                    <div className="relative flex-1 sm:flex-none min-w-[200px]">
                        <label className="absolute -top-2.5 left-4 px-2 bg-[#0f172a] text-[9px] font-bold text-slate-400 uppercase tracking-widest z-10 rounded">Location</label>
                        <select 
                            value={proxyLocation} 
                            onChange={(e) => setProxyLocation(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 text-xs font-bold text-white focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
                        >
                            {uniqueLocations.map(l => <option key={l} value={l}>{l === 'All' ? 'Anywhere' : l}</option>)}
                        </select>
                        <i className="fa-solid fa-earth-americas absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none"></i>
                    </div>

                    {/* Provider Filter */}
                    <div className="relative flex-1 sm:flex-none min-w-[200px]">
                        <label className="absolute -top-2.5 left-4 px-2 bg-[#0f172a] text-[9px] font-bold text-slate-400 uppercase tracking-widest z-10 rounded">Provider</label>
                        <select 
                            value={proxyProvider} 
                            onChange={(e) => setProxyProvider(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 text-xs font-bold text-white focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
                        >
                            {uniqueProviders.map(p => <option key={p} value={p}>{p === 'All' ? 'All Providers' : p}</option>)}
                        </select>
                        <i className="fa-solid fa-server absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none"></i>
                    </div>
                 </div>
             </div>

             <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-2 mr-2">Network Type:</span>
                <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl">
                    {uniqueProxyTypes.map(t => (
                        <button
                            key={t}
                            onClick={() => setProxyType(t)}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                                proxyType === t 
                                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' 
                                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                {(proxyType !== 'All' || proxyLocation !== 'All' || proxyProvider !== 'All' || proxySearch) && (
                    <button 
                        onClick={() => {setProxyType('All'); setProxyLocation('All'); setProxyProvider('All'); setProxySearch('');}}
                        className="ml-auto text-[10px] font-bold text-rose-400 hover:text-rose-300 uppercase flex items-center gap-1"
                    >
                        <i className="fa-solid fa-xmark"></i> Reset
                    </button>
                )}
             </div>
          </div>

          {/* Proxy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProxies.length > 0 ? filteredProxies.map((proxy) => {
                const brandColor = (proxy as any).brandColor || '#10b981';
                return (
                  <div key={proxy.id} 
                       className="glass-panel p-6 rounded-[2.5rem] group transition-all flex flex-col justify-between shadow-xl relative overflow-hidden h-full hover:scale-[1.02] border border-slate-800/50 hover:border-slate-600"
                  >
                     <div className="space-y-6 relative z-10 flex-1">
                        <div className="flex items-start justify-between">
                           <ProviderBadge icon={proxy.providerIcon} color={brandColor} size="sm" />
                           <span className="text-[8px] font-black uppercase tracking-widest py-1.5 px-3 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
                                {proxy.type}
                           </span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-bold text-slate-400 text-xs leading-tight font-heading uppercase tracking-wider">{proxy.provider}</h4>
                                <i className="fa-solid fa-circle-check text-blue-500 text-[10px]"></i>
                            </div>
                            <h3 className="text-lg font-black text-white leading-tight mb-2 font-heading">{proxy.name}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 font-medium bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
                                <i className="fa-solid fa-bolt text-amber-400 mr-1"></i> {proxy.feature}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {proxy.locations.slice(0, 3).map((loc, i) => (
                                <span key={i} className="px-2.5 py-1.5 bg-black/30 rounded-lg text-[9px] font-bold text-slate-300 uppercase border border-white/5 flex items-center gap-1.5">
                                    <i className="fa-solid fa-earth-americas text-[9px] text-slate-500"></i> {loc}
                                </span>
                            ))}
                            {proxy.locations.length > 3 && (
                                <span className="px-2.5 py-1.5 bg-black/30 rounded-lg text-[9px] font-bold text-slate-500 border border-white/5">
                                    +{proxy.locations.length - 3}
                                </span>
                            )}
                        </div>
                     </div>

                     <div className="pt-6 mt-6 relative z-10 border-t border-slate-800/50 flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs font-bold text-slate-500">$</span>
                                <p className="text-3xl font-black text-white font-heading tracking-tight">{proxy.price}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase">/{proxy.unit.split('/')[1] || 'GB'}</p>
                            </div>
                        </div>
                        <button 
                          onClick={() => onBuy({ name: proxy.name, price: proxy.price })}
                          className="w-full py-3.5 rounded-xl font-black transition-all text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 text-white hover:brightness-110 btn-3d"
                          style={{ backgroundColor: brandColor }}
                        >
                           <span>Purchase Access</span>
                           <i className="fa-solid fa-arrow-right"></i>
                        </button>
                     </div>
                  </div>
                );
            }) : (
                <div className="col-span-full py-24 text-center glass-panel rounded-[2rem] border-dashed border-slate-700/50 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <i className="fa-solid fa-network-wired text-4xl text-slate-600"></i>
                    </div>
                    <p className="text-xl font-bold text-white uppercase tracking-tight">No Proxy Nodes Found</p>
                    <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto font-medium">We couldn't find any proxies matching your filters. Try adjusting your location or type preferences.</p>
                    <button 
                        onClick={() => {setProxyType('All'); setProxyLocation('All'); setProxyProvider('All'); setProxySearch('');}} 
                        className="mt-8 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-xs font-black uppercase text-white transition-all shadow-xl shadow-emerald-600/30 btn-3d"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RDPServices;
