
import React, { useState, useMemo } from 'react';
import { RDP_SERVICES_DATA, PROXY_DATA } from '../constants';

const RDPServices: React.FC<{ onBuy: (item: any) => void }> = ({ onBuy }) => {
  const [activeTab, setActiveTab] = useState<'rdp' | 'proxy'>('rdp');
  const [proxyTypeFilter, setProxyTypeFilter] = useState<string>('All');
  const [proxyLocationFilter, setProxyLocationFilter] = useState<string>('All');

  const ProviderLogo = ({ icon, color, label }: { icon: string, color: string, label: string }) => (
    <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border-2 border-white/5 relative overflow-hidden group" style={{ backgroundColor: `${color}15`, color: color }}>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <i className={`${icon.includes('fa-') ? icon : 'fa-brands ' + icon}`}></i>
        </div>
        <div>
            <p className="text-[9px] font-tech text-slate-500 uppercase tracking-tight mb-0.5">Primary Node</p>
            <p className="text-base font-black text-white leading-tight uppercase tracking-tighter">{label}</p>
        </div>
    </div>
  );

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
        return matchesType && matchesLocation;
    });
  }, [proxyTypeFilter, proxyLocationFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 select-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Infrastructure Matrix</h2>
          <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-xl">Provision high-fidelity compute nodes and stealth network endpoints across the global graph.</p>
        </div>
        <div className="flex bg-slate-950/40 p-1.5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-3xl">
          <button 
            onClick={() => setActiveTab('rdp')} 
            className={`px-8 py-4 rounded-2xl text-[10px] font-tech uppercase tracking-widest transition-all ${activeTab === 'rdp' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-200'}`}
          >
            Cloud VPS
          </button>
          <button 
            onClick={() => setActiveTab('proxy')} 
            className={`px-8 py-4 rounded-2xl text-[10px] font-tech uppercase tracking-widest transition-all ${activeTab === 'proxy' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-200'}`}
          >
            Stealth Proxies
          </button>
        </div>
      </div>

      {activeTab === 'rdp' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in slide-in-from-bottom-6 duration-500">
            {RDP_SERVICES_DATA.map((rdp, i) => (
                <div key={i} className="glass-panel rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/40 transition-all shadow-2xl flex flex-col border-2 border-white/5">
                    <div className="p-8 border-b border-white/5 flex justify-between items-start bg-slate-900/40">
                        <ProviderLogo icon={rdp.providerIcon} color={rdp.brandColor} label={rdp.provider} />
                        <div className="text-right">
                            <p className="text-3xl font-display font-black text-white leading-none glowing-text font-tech">${rdp.price}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase mt-2 tracking-widest font-tech">/ month node</p>
                        </div>
                    </div>
                    <div className="p-8 space-y-6 flex-1 font-tech uppercase text-[10px] tracking-tighter">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{rdp.name}</h3>
                            <span className="px-2 py-1 bg-white/5 rounded border border-white/5 text-slate-500">{rdp.region}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col p-4 bg-slate-950/80 rounded-2xl border border-white/5 shadow-inner">
                                <span className="text-slate-600 mb-1">CPU ARRAY</span>
                                <span className="text-white text-xs font-black">{rdp.cpu}</span>
                            </div>
                            <div className="flex flex-col p-4 bg-slate-950/80 rounded-2xl border border-white/5 shadow-inner">
                                <span className="text-slate-600 mb-1">RAM NODE</span>
                                <span className="text-white text-xs font-black">{rdp.ram} V-RAM</span>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/5 shadow-inner">
                            <span className="text-slate-600 mb-1">STORAGE FABRIC</span>
                            <span className="text-white text-xs font-black block mt-1">{rdp.storage}</span>
                        </div>
                        <button 
                            onClick={() => onBuy({ name: `${rdp.provider} ${rdp.name}`, price: rdp.price })} 
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl transition-all btn-3d mt-2"
                        >
                            Initialize Instance
                        </button>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-6 duration-500">
            {/* Filter Hub */}
            <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col xl:flex-row justify-between gap-10 items-start bg-gradient-to-br from-indigo-900/5 to-transparent">
                <div className="space-y-4">
                    <p className="text-[9px] font-tech text-indigo-400 uppercase tracking-[0.3em] ml-1">Traffic Protocol Filter</p>
                    <div className="flex flex-wrap gap-2">
                        {uniqueProxyTypes.map(type => (
                            <button 
                                key={type} 
                                onClick={() => setProxyTypeFilter(type)} 
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-tech uppercase font-black transition-all ${proxyTypeFilter === type ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 border border-white/5 text-slate-500 hover:text-slate-300'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-4 w-full xl:w-auto">
                    <p className="text-[9px] font-tech text-indigo-400 uppercase tracking-[0.3em] ml-1">Geo Geographic Node</p>
                    <div className="relative group">
                        <select 
                            value={proxyLocationFilter} 
                            onChange={e => setProxyLocationFilter(e.target.value)} 
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-[11px] font-tech font-black text-white uppercase outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner appearance-none min-w-[240px]"
                        >
                            {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc === 'All' ? 'GLOBAL NETWORK HUB' : `${loc} REGIONAL NODE`}</option>)}
                        </select>
                        <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 pointer-events-none group-hover:text-white transition-colors"></i>
                    </div>
                </div>
            </div>

            {/* Proxy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredProxies.length > 0 ? filteredProxies.map((proxy) => (
                    <div key={proxy.id} className="glass-panel p-6 rounded-[2.5rem] flex flex-col justify-between group hover:border-emerald-500/40 transition-all shadow-xl bg-slate-950/20 relative overflow-hidden border-2 border-white/5">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-6xl">
                            <i className={proxy.providerIcon}></i>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform" style={{ color: proxy.brandColor }}>
                                    <i className={proxy.providerIcon}></i>
                                </div>
                                <span className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-[8px] font-tech font-black uppercase text-slate-400 tracking-widest">{proxy.type}</span>
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{proxy.name}</h4>
                                <p className="text-[9px] text-slate-500 font-tech uppercase tracking-tighter">{proxy.provider} Stealth Engine</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[8px] font-tech text-emerald-400/80 uppercase">
                                    <i className="fa-solid fa-check-circle"></i> {proxy.feature}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {proxy.locations.map(l => (
                                        <span key={l} className="text-[7px] font-tech bg-white/5 px-2 py-0.5 rounded text-slate-500 uppercase">{l}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                            <div className="font-tech uppercase tracking-tighter">
                                <p className="text-3xl font-display font-black text-white leading-none glowing-text">${proxy.price.toFixed(2)}</p>
                                <p className="text-[9px] text-slate-600 mt-2">/ {proxy.unit}</p>
                            </div>
                            <button 
                                onClick={() => onBuy({ name: proxy.name, price: proxy.price })} 
                                className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 shadow-indigo-600/20"
                            >
                                <i className="fa-solid fa-plus text-lg"></i>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-24 text-center glass-panel rounded-[3rem] border-dashed border-white/10 border-2">
                        <i className="fa-solid fa-microchip text-4xl text-slate-800 mb-4 opacity-20"></i>
                        <p className="text-[10px] font-tech text-slate-600 uppercase tracking-widest">No active proxy nodes in this sector</p>
                        <button onClick={() => { setProxyTypeFilter('All'); setProxyLocationFilter('All'); }} className="mt-4 text-indigo-400 font-tech text-[10px] font-black uppercase underline underline-offset-4">Reset Matrix Filters</button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default RDPServices;
