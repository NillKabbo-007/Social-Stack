
import React, { useState, useMemo } from 'react';
import { RDP_SERVICES_DATA, PROXY_DATA } from '../constants';

const RDPServices: React.FC<{ onBuy: (item: any) => void }> = ({ onBuy }) => {
  const [activeTab, setActiveTab] = useState<'rdp' | 'proxy'>('rdp');
  const [proxyTypeFilter, setProxyTypeFilter] = useState<string>('All');
  const [proxyLocationFilter, setProxyLocationFilter] = useState<string>('All');

  const ProviderLogo = ({ icon, color, label }: { icon: string, color: string, label: string }) => (
    <div className="flex items-center gap-4 group">
      <div 
        className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-4xl shadow-2xl border-2 border-white/5 relative overflow-hidden transition-all group-hover:scale-105" 
        style={{ 
          backgroundColor: `${color}10`, 
          color: color,
          boxShadow: `0 0 30px ${color}15, inset 0 0 10px ${color}10`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <i className={`${icon.includes('fa-') ? icon : 'fa-brands ' + icon} relative z-10`}></i>
      </div>
      <div>
        <p className="text-[8px] font-tech text-slate-500 uppercase tracking-[0.2em] mb-0.5">Network Node</p>
        <p className="text-lg font-black text-white leading-tight uppercase tracking-tighter">{label}</p>
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
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter flex items-center gap-4">
            Infrastructure Matrix
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-tech text-emerald-400 align-middle">LIVE</span>
          </h2>
          <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-xl">Provision high-fidelity compute nodes and stealth network endpoints across the global graph.</p>
        </div>
        <div className="flex bg-slate-950/40 p-1.5 rounded-[1.5rem] border border-white/5 shadow-2xl backdrop-blur-3xl">
          <button 
            onClick={() => setActiveTab('rdp')} 
            className={`px-8 py-3.5 rounded-xl text-[10px] font-tech uppercase tracking-widest transition-all ${activeTab === 'rdp' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-200'}`}
          >
            Cloud VPS
          </button>
          <button 
            onClick={() => setActiveTab('proxy')} 
            className={`px-8 py-3.5 rounded-xl text-[10px] font-tech uppercase tracking-widest transition-all ${activeTab === 'proxy' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-200'}`}
          >
            Stealth Proxies
          </button>
        </div>
      </div>

      {activeTab === 'rdp' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in slide-in-from-bottom-6 duration-500">
          {RDP_SERVICES_DATA.map((rdp, i) => (
            <div key={i} className="glass-panel rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/40 transition-all shadow-2xl flex flex-col border-2 border-white/5">
              <div className="p-8 border-b border-white/5 flex justify-between items-start bg-slate-900/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16"></div>
                <ProviderLogo icon={rdp.providerIcon} color={rdp.brandColor} label={rdp.provider} />
                <div className="text-right relative z-10">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-slate-500 text-xs font-tech">$</span>
                    <p className="text-4xl font-display font-black text-white leading-none glowing-text font-tech tracking-tighter tabular-nums">{rdp.price}</p>
                  </div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase mt-2 tracking-widest font-tech">/ monthly node</p>
                </div>
              </div>
              
              <div className="p-8 space-y-6 flex-1 font-tech uppercase text-[10px] tracking-tighter">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{rdp.name}</h3>
                  <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-slate-400 font-bold">{rdp.region} Node</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col p-5 bg-slate-950/80 rounded-2xl border border-white/5 shadow-inner group/stat">
                    <span className="text-slate-600 mb-1 group-hover/stat:text-indigo-400 transition-colors">CPU CORE</span>
                    <span className="text-white text-xs font-black tracking-widest">{rdp.cpu}</span>
                  </div>
                  <div className="flex flex-col p-5 bg-slate-950/80 rounded-2xl border border-white/5 shadow-inner group/stat">
                    <span className="text-slate-600 mb-1 group-hover/stat:text-indigo-400 transition-colors">RAM SYNC</span>
                    <span className="text-white text-xs font-black tracking-widest">{rdp.ram}</span>
                  </div>
                </div>
                
                <div className="p-5 bg-slate-950/80 rounded-2xl border border-white/5 shadow-inner flex justify-between items-center group/stat">
                  <div>
                    <span className="text-slate-600 mb-1 block group-hover/stat:text-indigo-400 transition-colors">STORAGE FABRIC</span>
                    <span className="text-white text-xs font-black tracking-widest">{rdp.storage}</span>
                  </div>
                  <i className="fa-solid fa-hard-drive text-slate-800 text-xl group-hover/stat:text-indigo-900 transition-colors"></i>
                </div>
                
                <button 
                  onClick={() => onBuy({ name: `${rdp.provider} ${rdp.name}`, price: rdp.price })} 
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl transition-all btn-3d mt-2 flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-power-off"></i>
                  Initialize Instance
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-6 duration-500">
          {/* Tactical Filter Hub */}
          <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col xl:flex-row justify-between gap-10 items-end bg-gradient-to-br from-indigo-900/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="space-y-5 w-full xl:w-auto relative z-10">
              <div className="flex items-center gap-3 ml-1">
                <i className="fa-solid fa-filter text-indigo-500 text-[10px]"></i>
                <p className="text-[9px] font-tech text-indigo-400 uppercase tracking-[0.3em]">Traffic Protocol Matrix</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {uniqueProxyTypes.map(type => (
                  <button 
                    key={type} 
                    onClick={() => setProxyTypeFilter(type)} 
                    className={`px-6 py-3 rounded-xl text-[10px] font-tech uppercase font-black transition-all border ${proxyTypeFilter === type ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5 w-full xl:w-auto relative z-10">
              <div className="flex items-center gap-3 ml-1">
                <i className="fa-solid fa-earth-americas text-indigo-500 text-[10px]"></i>
                <p className="text-[9px] font-tech text-indigo-400 uppercase tracking-[0.3em]">Geo Geographic Deployment</p>
              </div>
              <div className="relative group">
                <select 
                  value={proxyLocationFilter} 
                  onChange={e => setProxyLocationFilter(e.target.value)} 
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-[11px] font-tech font-black text-white uppercase outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner appearance-none min-w-[280px] cursor-pointer hover:bg-slate-900 transition-colors"
                >
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc} className="bg-slate-900">
                      {loc === 'All' ? 'GLOBAL NETWORK GRID' : `${loc} REGIONAL CLUSTER`}
                    </option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
                  <div className="h-4 w-px bg-white/10"></div>
                  <i className="fa-solid fa-chevron-down text-[10px] text-slate-500 group-hover:text-white transition-colors"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Proxy Hub Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredProxies.length > 0 ? filteredProxies.map((proxy) => (
              <div key={proxy.id} className="glass-panel p-6 rounded-[2.5rem] flex flex-col justify-between group hover:border-emerald-500/40 transition-all shadow-xl bg-slate-950/20 relative overflow-hidden border-2 border-white/5">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-7xl group-hover:opacity-10 group-hover:scale-110 transition-all" style={{ color: proxy.brandColor }}>
                  <i className={proxy.providerIcon}></i>
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div 
                      className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all" 
                      style={{ color: proxy.brandColor }}
                    >
                      <i className={proxy.providerIcon}></i>
                    </div>
                    <span className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-[8px] font-tech font-black uppercase text-slate-400 tracking-widest">{proxy.type}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">{proxy.name}</h4>
                    <p className="text-[9px] text-slate-500 font-tech uppercase tracking-tighter flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {proxy.provider} Stealth Engine
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[9px] font-tech text-emerald-400/90 uppercase tracking-tighter">
                      <i className="fa-solid fa-circle-check text-[10px]"></i> {proxy.feature}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {proxy.locations.map(l => (
                        <span key={l} className="text-[7px] font-tech bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg text-slate-400 uppercase group-hover:border-indigo-500/20 transition-all">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="font-tech uppercase tracking-tighter">
                    <div className="flex items-end gap-1">
                      <span className="text-slate-500 text-[10px] mb-1">$</span>
                      <p className="text-3xl font-display font-black text-white leading-none glowing-text tabular-nums">{proxy.price.toFixed(2)}</p>
                    </div>
                    <p className="text-[8px] text-slate-600 mt-2 font-bold tracking-[0.2em]">/ {proxy.unit}</p>
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
                <i className="fa-solid fa-satellite-dish text-4xl text-slate-800 mb-4 animate-pulse opacity-40"></i>
                <p className="text-[10px] font-tech text-slate-600 uppercase tracking-[0.3em]">No active supply nodes in this sector</p>
                <button 
                  onClick={() => { setProxyTypeFilter('All'); setProxyLocationFilter('All'); }} 
                  className="mt-6 text-indigo-400 font-tech text-[10px] font-black uppercase underline underline-offset-[12px] hover:text-indigo-300 transition-colors"
                >
                  Recalibrate Matrix Filters
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
