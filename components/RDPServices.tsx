
import React, { useState, useMemo } from 'react';
import { RDP_SERVICES_DATA, PROXY_DATA } from '../constants';

const RDPServices: React.FC<{ onBuy: (item: any) => void }> = ({ onBuy }) => {
  const [activeTab, setActiveTab] = useState<'rdp' | 'proxy'>('rdp');
  const [proxyTypeFilter, setProxyTypeFilter] = useState<string>('All');
  const [proxyLocationFilter, setProxyLocationFilter] = useState<string>('All');
  const [proxySearch, setProxySearch] = useState('');

  const ProviderLogo = ({ icon, color, label }: { icon: string, color: string, label: string }) => (
    <div className="flex items-center gap-4 group">
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border border-white/10 relative overflow-hidden transition-all group-hover:scale-110" 
        style={{ 
          backgroundColor: `${color}15`, 
          color: color,
          boxShadow: `0 0 20px ${color}10, inset 0 0 10px ${color}10`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-40"></div>
        <i className={`${icon.includes('fa-') ? icon : 'fa-brands ' + icon} relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`}></i>
      </div>
      <div className="hidden sm:block">
        <p className="text-[7px] font-tech text-slate-500 uppercase tracking-[0.3em] mb-0.5">Supply Node</p>
        <p className="text-sm font-black text-white leading-tight uppercase tracking-tighter">{label}</p>
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
      const matchesSearch = proxy.name.toLowerCase().includes(proxySearch.toLowerCase()) || 
                          proxy.provider.toLowerCase().includes(proxySearch.toLowerCase());
      return matchesType && matchesLocation && matchesSearch;
    });
  }, [proxyTypeFilter, proxyLocationFilter, proxySearch]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 select-none">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1] animate-pulse"></div>
            <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Infrastructure Matrix</h2>
          </div>
          <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-xl">
            Provision high-fidelity compute nodes and stealth network endpoints across the global graph. 
            <span className="text-indigo-400 ml-1 font-tech text-[10px] uppercase">Node Status: Optimized</span>
          </p>
        </div>
        <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-3xl">
          <button 
            onClick={() => setActiveTab('rdp')} 
            className={`px-10 py-3.5 rounded-xl text-[10px] font-tech uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === 'rdp' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-server text-xs"></i> Cloud VPS
          </button>
          <button 
            onClick={() => setActiveTab('proxy')} 
            className={`px-10 py-3.5 rounded-xl text-[10px] font-tech uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === 'proxy' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-network-wired text-xs"></i> Stealth Proxies
          </button>
        </div>
      </div>

      {activeTab === 'rdp' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-500">
          {RDP_SERVICES_DATA.map((rdp, i) => (
            <div key={i} className="glass-panel rounded-[3rem] overflow-hidden group hover:border-indigo-500/40 transition-all shadow-2xl flex flex-col border-2 border-white/5 relative">
              <div className="p-8 border-b border-white/5 flex justify-between items-start bg-slate-900/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px] -mr-24 -mt-24"></div>
                <ProviderLogo icon={rdp.providerIcon} color={rdp.brandColor} label={rdp.provider} />
                <div className="text-right relative z-10">
                  <div className="flex items-start gap-1 justify-end font-tech">
                    <span className="text-indigo-400 text-sm mt-1">$</span>
                    <p className="text-5xl font-display font-black text-white leading-none tracking-tighter tabular-nums">{rdp.price}</p>
                  </div>
                  <p className="text-[7px] font-black text-slate-500 uppercase mt-3 tracking-[0.3em] font-tech">Provision / Mo</p>
                </div>
              </div>
              
              <div className="p-8 space-y-6 flex-1 font-tech uppercase text-[10px] tracking-tighter">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{rdp.name}</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-slate-400 font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    {rdp.region}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col p-5 bg-black/40 rounded-2xl border border-white/5 shadow-inner group/stat hover:border-indigo-500/30 transition-all">
                    <span className="text-slate-600 mb-2 group-hover/stat:text-indigo-400 transition-colors">CPU FABRIC</span>
                    <span className="text-white text-xs font-black tracking-widest">{rdp.cpu}</span>
                  </div>
                  <div className="flex flex-col p-5 bg-black/40 rounded-2xl border border-white/5 shadow-inner group/stat hover:border-indigo-500/30 transition-all">
                    <span className="text-slate-600 mb-2 group-hover/stat:text-indigo-400 transition-colors">MEMORY SYNC</span>
                    <span className="text-white text-xs font-black tracking-widest">{rdp.ram}</span>
                  </div>
                </div>
                
                <div className="p-5 bg-black/40 rounded-2xl border border-white/5 shadow-inner flex justify-between items-center group/stat hover:border-indigo-500/30 transition-all">
                  <div>
                    <span className="text-slate-600 mb-2 block group-hover/stat:text-indigo-400 transition-colors">STORAGE ARRAY</span>
                    <span className="text-white text-xs font-black tracking-widest">{rdp.storage}</span>
                  </div>
                  <i className="fa-solid fa-microchip text-slate-800 text-2xl group-hover/stat:text-indigo-900 transition-colors"></i>
                </div>
                
                <button 
                  onClick={() => onBuy({ name: `${rdp.provider} ${rdp.name}`, price: rdp.price })} 
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl transition-all btn-3d mt-2 flex items-center justify-center gap-4 group/btn"
                >
                  <i className="fa-solid fa-bolt-lightning text-xs group-hover/btn:scale-125 transition-transform"></i>
                  Initialize Instance
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
          {/* TACTICAL FILTER HUB */}
          <div className="glass-panel p-8 rounded-[3rem] border-white/5 bg-gradient-to-br from-indigo-900/5 via-slate-900/40 to-transparent relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="flex flex-col xl:flex-row justify-between gap-10 relative z-10">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-3 ml-1">
                  <i className="fa-solid fa-magnifying-glass text-indigo-500 text-[10px]"></i>
                  <p className="text-[9px] font-tech text-indigo-400 uppercase tracking-[0.4em]">Protocol Search</p>
                </div>
                <input 
                  type="text"
                  value={proxySearch}
                  onChange={(e) => setProxySearch(e.target.value)}
                  placeholder="Scan providers or node descriptors..."
                  className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-6 py-4 text-xs font-tech font-bold text-white focus:ring-1 focus:ring-indigo-500 shadow-inner outline-none transition-all placeholder-slate-700"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 ml-1">
                  <i className="fa-solid fa-filter text-indigo-500 text-[10px]"></i>
                  <p className="text-[9px] font-tech text-indigo-400 uppercase tracking-[0.4em]">Signal Type</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {uniqueProxyTypes.map(type => (
                    <button 
                      key={type} 
                      onClick={() => setProxyTypeFilter(type)} 
                      className={`px-5 py-3 rounded-xl text-[10px] font-tech uppercase font-black transition-all border ${proxyTypeFilter === type ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 ml-1">
                  <i className="fa-solid fa-earth-americas text-indigo-500 text-[10px]"></i>
                  <p className="text-[9px] font-tech text-indigo-400 uppercase tracking-[0.4em]">Deployment Cluster</p>
                </div>
                <div className="relative group min-w-[280px]">
                  <select 
                    value={proxyLocationFilter} 
                    onChange={e => setProxyLocationFilter(e.target.value)} 
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-[11px] font-tech font-black text-white uppercase outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner appearance-none cursor-pointer hover:bg-slate-900 transition-colors"
                  >
                    {uniqueLocations.map(loc => (
                      <option key={loc} value={loc} className="bg-slate-900 font-tech">
                        {loc === 'All' ? 'GLOBAL NETWORK GRID' : `${loc} REGIONAL CLUSTER`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-chevron-down text-[10px]"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PROXY NODE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredProxies.length > 0 ? filteredProxies.map((proxy) => (
              <div key={proxy.id} className="glass-panel p-6 rounded-[2.5rem] flex flex-col justify-between group hover:border-emerald-500/40 transition-all shadow-xl bg-slate-950/20 relative overflow-hidden border-2 border-white/5 animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-8xl group-hover:opacity-10 group-hover:scale-125 transition-all duration-700" style={{ color: proxy.brandColor }}>
                  <i className={proxy.providerIcon}></i>
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div 
                      className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-3xl shadow-inner group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all" 
                      style={{ color: proxy.brandColor }}
                    >
                      <i className={proxy.providerIcon}></i>
                    </div>
                    <span className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-[8px] font-tech font-black uppercase text-slate-400 tracking-[0.2em]">{proxy.type}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">{proxy.name}</h4>
                    <p className="text-[9px] text-slate-500 font-tech uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_#10b981]"></span>
                      {proxy.provider} Kernel
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[9px] font-tech text-emerald-400/90 uppercase font-black">
                      <i className="fa-solid fa-shield-halved text-[10px]"></i> {proxy.feature}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {proxy.locations.map(l => (
                        <span key={l} className="text-[7px] font-tech bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg text-slate-400 uppercase group-hover:border-indigo-500/30 transition-all font-black">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/5 flex items-end justify-between relative z-10">
                  <div className="font-tech uppercase">
                    <div className="flex items-end gap-1">
                      <span className="text-indigo-400 text-xs mb-1">$</span>
                      <p className="text-4xl font-display font-black text-white leading-none glowing-text tracking-tighter tabular-nums">{proxy.price.toFixed(2)}</p>
                    </div>
                    <p className="text-[8px] text-slate-600 mt-2 font-black tracking-[0.3em]">/ {proxy.unit}</p>
                  </div>
                  <button 
                    onClick={() => onBuy({ name: proxy.name, price: proxy.price })} 
                    className="w-14 h-14 bg-indigo-600 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-90 shadow-indigo-600/20 group/add"
                  >
                    <i className="fa-solid fa-plus text-xl group-hover/add:rotate-90 transition-transform"></i>
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-32 text-center glass-panel rounded-[3rem] border-dashed border-white/10 border-2">
                <i className="fa-solid fa-satellite-dish text-5xl text-slate-800 mb-6 animate-pulse opacity-20"></i>
                <p className="text-[10px] font-tech text-slate-600 uppercase tracking-[0.5em] mb-4">No active supply nodes detected in sector</p>
                <button 
                  onClick={() => { setProxyTypeFilter('All'); setProxyLocationFilter('All'); setProxySearch(''); }} 
                  className="px-8 py-3 bg-slate-900 hover:bg-white hover:text-black rounded-xl text-[9px] font-tech font-black uppercase tracking-widest transition-all border border-white/5"
                >
                  Reset Encryption Filters
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
