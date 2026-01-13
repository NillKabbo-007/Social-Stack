
import React, { useState, useMemo } from 'react';
import { RDP_SERVICES_DATA, PROXY_DATA } from '../constants';

const RDPServices: React.FC<{ onBuy: (item: any) => void }> = ({ onBuy }) => {
  const [activeTab, setActiveTab] = useState<'rdp' | 'proxy'>('rdp');
  
  // RDP State
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedOS, setSelectedOS] = useState<Record<string, string>>({});
  const [rdpSearch, setRdpSearch] = useState('');

  // Proxy State
  const [proxyTypeFilter, setProxyTypeFilter] = useState<string>('All');
  const [proxyLocationFilter, setProxyLocationFilter] = useState<string>('All');
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
  const uniqueProxyTypes = useMemo(() => ['All', ...Array.from(new Set(PROXY_DATA.map(p => p.type)))], []);
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    PROXY_DATA.forEach(p => p.locations.forEach(l => locs.add(l)));
    return ['All', ...Array.from(locs).sort()];
  }, []);

  const filteredProxies = useMemo(() => {
    return PROXY_DATA.filter(proxy => {
        const matchesType = proxyTypeFilter === 'All' || proxy.type === proxyTypeFilter;
        const matchesLocation = proxyLocationFilter === 'All' || proxy.locations.includes(proxyLocationFilter);
        const matchesSearch = proxy.name.toLowerCase().includes(proxySearch.toLowerCase()) || proxy.provider.toLowerCase().includes(proxySearch.toLowerCase());
        return matchesType && matchesLocation && matchesSearch;
    });
  }, [proxyTypeFilter, proxyLocationFilter, proxySearch]);

  const ProviderLogo = ({ icon, color, label }: { icon: string, color: string, label: string }) => (
    <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border-2 border-white/5 relative overflow-hidden group" style={{ backgroundColor: `${color}15`, color: color }}>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <i className={`fa-brands ${icon}`}></i>
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Cloud Authority</p>
            <p className="text-base font-black text-white leading-tight">{label}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 select-none">
      
      {/* Dynamic Hub Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Infrastructure Hub</h2>
          <p className="text-slate-400 font-medium text-sm">Provision high-performance compute and stealth network nodes.</p>
        </div>
        
        <div className="flex bg-slate-900/80 p-2 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('rdp')}
            className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === 'rdp' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-server text-lg"></i>
            <span>Cloud VPS</span>
          </button>
          <button
            onClick={() => setActiveTab('proxy')}
            className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === 'proxy' ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-network-wired text-lg"></i>
            <span>Stealth Proxies</span>
          </button>
        </div>
      </div>

      {activeTab === 'rdp' ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-500">
            
            {/* RDP Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 glass-panel rounded-[2.5rem] border-slate-700/30 shadow-2xl">
                <div className="relative w-full md:w-96 group">
                    <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"></i>
                    <input 
                        type="text" 
                        placeholder="Filter by provider or node name..." 
                        value={rdpSearch}
                        onChange={(e) => setRdpSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-1 focus:ring-indigo-500 text-white font-medium shadow-inner"
                    />
                </div>

                <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700 shadow-inner">
                    <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Monthly</button>
                    <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Yearly Node (-20%)</button>
                </div>
            </div>

            {/* RDP Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredRDPs.map((rdp, i) => (
                    <div key={i} className="glass-panel rounded-[2.5rem] overflow-hidden border-slate-700/50 flex flex-col group hover:border-indigo-500/30 transition-all shadow-2xl bg-gradient-to-b from-transparent to-slate-950/20">
                        <div className="p-8 border-b border-slate-800 flex justify-between items-start bg-slate-900/40">
                            <ProviderLogo icon={rdp.providerIcon} color={rdp.brandColor} label={rdp.provider} />
                            <div className="text-right">
                                <p className="text-3xl font-display font-black text-white leading-none glowing-text">${billingCycle === 'yearly' ? rdp.price * 10 : rdp.price}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">/{billingCycle === 'yearly' ? 'year' : 'mo'}</p>
                            </div>
                        </div>
                        <div className="p-8 space-y-8 flex-1">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{rdp.name}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { l: 'vCPU', v: rdp.cpu, i: 'fa-microchip', c: 'text-indigo-400' },
                                    { l: 'RAM', v: rdp.ram, i: 'fa-memory', c: 'text-emerald-400' },
                                    { l: 'SSD', v: rdp.storage, i: 'fa-database', c: 'text-amber-400' },
                                    { l: 'Region', v: rdp.region, i: 'fa-earth-americas', c: 'text-rose-400' }
                                ].map((s, si) => (
                                    <div key={si} className="flex flex-col p-4 bg-slate-900 border border-white/5 rounded-2xl shadow-inner group/spec hover:bg-slate-800 transition-colors">
                                        <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2 mb-2">
                                            <i className={`fa-solid ${s.i} ${s.c}`}></i> {s.l}
                                        </span>
                                        <span className="text-xs font-black text-white">{s.v}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">OS Distribution</label>
                                <select 
                                    value={selectedOS[rdp.name] || 'Windows Server 2022'}
                                    onChange={(e) => setSelectedOS({...selectedOS, [rdp.name]: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-black text-slate-300 appearance-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                                >
                                    <option>Windows Server 2022</option>
                                    <option>Ubuntu 24.04 LTS</option>
                                    <option>Debian 12</option>
                                    <option>Kali Linux (Secure)</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-8 pt-0">
                            <button onClick={() => handleBuyRDP(rdp)} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all btn-3d border-b-4 border-indigo-800 active:border-b-0">
                                Initialize Cloud Instance
                            </button>
                            <button className="w-full mt-4 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                <i className="fa-solid fa-file-download mr-2"></i> Download Config Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in slide-in-from-right-6 duration-500">
            
            {/* Proxy Dynamic Filter Section */}
            <div className="glass-panel p-8 rounded-[3rem] border-slate-700/40 space-y-10 shadow-2xl">
                <div className="flex flex-col xl:flex-row justify-between gap-10 items-start">
                    <div className="space-y-4 flex-1 w-full">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Traffic Layer</p>
                            <button onClick={() => setProxyTypeFilter('All')} className="text-[9px] font-black text-indigo-400 uppercase hover:underline">Reset</button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {uniqueProxyTypes.map(type => (
                                <button 
                                    key={type}
                                    onClick={() => setProxyTypeFilter(type)}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                        proxyTypeFilter === type 
                                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl scale-105' 
                                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="w-full xl:w-96 space-y-4">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Live Node Search</p>
                        <div className="relative group">
                            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors"></i>
                            <input 
                                type="text"
                                placeholder="Search stealth networks..."
                                value={proxySearch}
                                onChange={(e) => setProxySearch(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-xs font-black text-white focus:ring-1 focus:ring-emerald-500 shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Geographic Origin</p>
                        <span className="text-[9px] font-bold text-slate-600 uppercase">{uniqueLocations.length - 1} Nodes Mapping</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {uniqueLocations.map(loc => (
                            <button 
                                key={loc}
                                onClick={() => setProxyLocationFilter(loc)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                    proxyLocationFilter === loc 
                                    ? 'bg-white text-slate-900 border-white shadow-lg' 
                                    : 'bg-slate-800/40 border-white/5 text-slate-500 hover:text-slate-200'
                                }`}
                            >
                                <i className={`fa-solid fa-location-dot mr-2 ${proxyLocationFilter === loc ? 'text-indigo-600' : 'opacity-30'}`}></i>
                                {loc === 'All' ? 'Global Network' : loc}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Proxy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredProxies.map((proxy) => (
                    <div key={proxy.id} className="glass-panel p-6 rounded-[2.5rem] border-slate-700/30 flex flex-col justify-between group hover:border-emerald-500/30 transition-all shadow-xl bg-slate-950/20 h-full overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-500">
                            <i className={`${proxy.providerIcon} text-7xl`}></i>
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110" style={{ color: proxy.brandColor }}>
                                    <i className={proxy.providerIcon}></i>
                                </div>
                                <span className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-[8px] font-black uppercase text-slate-400 tracking-widest">
                                    {proxy.type}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{proxy.name}</h4>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{proxy.provider} Protocol</p>
                            </div>
                            <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">Optimization Profile</p>
                                <p className="text-xs text-slate-300 leading-tight font-medium">{proxy.feature}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {proxy.locations.slice(0, 3).map((l, li) => (
                                    <span key={li} className="px-2.5 py-1 bg-slate-900 border border-white/5 rounded-lg text-[9px] font-black text-slate-500 uppercase">{l}</span>
                                ))}
                                {proxy.locations.length > 3 && <span className="px-2.5 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-[9px] font-black text-indigo-400 uppercase">+{proxy.locations.length - 3}</span>}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-3xl font-display font-black text-white leading-none glowing-emerald">${proxy.price}</p>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">/{proxy.unit.split('/')[1]}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => alert("Downloading proxy auth credentials file (auth.txt)...")} className="w-10 h-10 bg-slate-900 border border-white/10 hover:border-indigo-500 text-slate-500 hover:text-white rounded-xl flex items-center justify-center transition-all">
                                    <i className="fa-solid fa-file-export text-xs"></i>
                                </button>
                                <button onClick={() => onBuy({ name: proxy.name, price: proxy.price })} className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all active:scale-90 group/buy">
                                    <i className="fa-solid fa-plus text-xl group-hover/buy:rotate-90 transition-transform"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default RDPServices;
