
import React, { useState, useEffect, useRef } from 'react';

interface SystemLog {
  id: string;
  timestamp: string;
  node: string;
  event: string;
  status: 'info' | 'success' | 'alert' | 'critical';
}

interface OrderNode {
  id: string;
  user: string;
  service: string;
  target: string;
  cost: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

const AdminControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'operators' | 'matrix' | 'nexus' | 'security' | 'logs'>('diagnostics');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [globalAnnouncement, setGlobalAnnouncement] = useState('Welcome to Social Stack v3.4. All nodes are optimal.');
  const [isLogStreaming, setIsLogStreaming] = useState(true);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [markup, setMarkup] = useState(25);

  const [orders, setOrders] = useState<OrderNode[]>([
    { id: 'ORD-8821', user: 'Alpha Op', service: 'IG Real Followers', target: 'social_stack_ig', cost: 12.50, status: 'processing' },
    { id: 'ORD-8822', user: 'Delta Node', service: 'TikTok Likes', target: 'viral_vids_99', cost: 4.20, status: 'completed' },
    { id: 'ORD-8823', user: 'Gamma Synth', service: 'VPS Premium', target: 'nyc-node-01', cost: 45.00, status: 'pending' }
  ]);

  // Log Simulation Engine
  useEffect(() => {
    if (!isLogStreaming) return;
    const interval = setInterval(() => {
      const nodes = ['CORE_KERNEL', 'STRIPE_GATEWAY', 'AI_ENGINE', 'META_SYNC', 'AUTH_NODE'];
      const events = ['Socket heartbeat', 'Encrypted packet received', 'Liquidity check passed', 'Token refreshed', 'Node healthy'];
      const statuses: any[] = ['info', 'success', 'info', 'alert'];
      
      const newLog: SystemLog = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
        node: nodes[Math.floor(Math.random() * nodes.length)],
        event: events[Math.floor(Math.random() * events.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };
      setLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 2500);
    return () => clearInterval(interval);
  }, [isLogStreaming]);

  const toggleMaintenance = () => {
    const confirmMsg = isMaintenanceMode ? "Re-initialize Global Stack?" : "Authorize Emergency Shutdown?";
    if (confirm(confirmMsg)) {
        setIsMaintenanceMode(!isMaintenanceMode);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 select-none pb-20">
      {/* TACTICAL HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${isMaintenanceMode ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_15px_#10b981]'} animate-pulse`}></div>
            <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Root Command Console</h2>
          </div>
          <p className="text-slate-400 font-tech text-[10px] uppercase tracking-widest">Access Level: Super-Admin • System Node: SOC-STK-01</p>
        </div>
        
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
          {[
            { id: 'diagnostics', icon: 'fa-gauge-high', label: 'Pulse' },
            { id: 'nexus', icon: 'fa-microchip', label: 'Nexus' },
            { id: 'matrix', icon: 'fa-diagram-project', label: 'Logic' },
            { id: 'operators', icon: 'fa-users-gear', label: 'Nodes' },
            { id: 'security', icon: 'fa-shield-halved', label: 'Shield' },
            { id: 'logs', icon: 'fa-terminal', label: 'Stream' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${
                activeTab === t.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              <i className={`fa-solid ${t.icon} text-sm`}></i>
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DASHBOARD DIAGNOSTICS */}
      {activeTab === 'diagnostics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: 'System Uptime', val: '99.98%', icon: 'fa-clock', color: 'text-emerald-400' },
                      { label: 'Active Sessions', val: '412', icon: 'fa-bolt', color: 'text-indigo-400' },
                      { label: 'Order Velocity', val: '24/hr', icon: 'fa-rocket', color: 'text-amber-400' }
                    ].map((s, i) => (
                        <div key={i} className="glass-panel p-8 rounded-[2.5rem] border-white/5 text-center group">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">{s.label}</p>
                            <h4 className={`text-3xl font-display font-black ${s.color} tracking-tighter mb-2`}>{s.val}</h4>
                            <i className={`fa-solid ${s.icon} text-slate-800 opacity-20 text-4xl group-hover:scale-110 transition-transform`}></i>
                        </div>
                    ))}
                </div>

                <div className="glass-panel p-8 rounded-[3rem] border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">Live Order Matrix</h3>
                        <button className="text-[10px] font-black text-indigo-400 uppercase">View All Orders</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-tech">
                            <thead className="bg-black/20 text-[9px] text-slate-500 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Identity</th>
                                    <th className="px-6 py-4">Protocol</th>
                                    <th className="px-6 py-4">Cost</th>
                                    <th className="px-6 py-4">Signal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map(o => (
                                    <tr key={o.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-slate-400 text-xs">{o.id}</td>
                                        <td className="px-6 py-4 text-white text-xs">{o.user}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">{o.service}</td>
                                        <td className="px-6 py-4 text-indigo-400 text-xs font-black">${o.cost.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${o.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{o.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel p-8 rounded-[3rem] border-white/5 bg-indigo-600/5">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Financial Yield (Q1)</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-3xl font-display font-black text-white">$142,500</p>
                            <p className="text-[9px] font-tech text-slate-500 uppercase tracking-widest mt-1">Total Throughput</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-900 rounded-2xl border border-white/5">
                                <p className="text-lg font-black text-emerald-400">$32k</p>
                                <p className="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Net Yield</p>
                            </div>
                            <div className="p-4 bg-slate-900 rounded-2xl border border-white/5">
                                <p className="text-lg font-black text-indigo-400">$12k</p>
                                <p className="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Cost Nodes</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="glass-panel p-8 rounded-[3rem] border-rose-500/20 bg-rose-500/5">
                    <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-4">Core Alert Hub</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-[10px] text-rose-300 font-medium">
                            <i className="fa-solid fa-triangle-exclamation mr-2"></i> PeakSMM API low balance: $12.40
                        </div>
                        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[10px] text-amber-300 font-medium">
                            <i className="fa-solid fa-circle-info mr-2"></i> 4 users flagged for IP-spamming.
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* NEXUS: GLOBAL CONFIG */}
      {activeTab === 'nexus' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
            <div className="glass-panel p-10 rounded-[3rem] border-white/5 space-y-10">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">System Orchestration</h3>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isMaintenanceMode ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                        {isMaintenanceMode ? 'Locked' : 'Online'}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-950/60 rounded-[2rem] border border-white/5 group transition-all">
                        <div className="flex gap-5 items-center">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${isMaintenanceMode ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-white uppercase text-sm tracking-tight">Maintenance Protocol</h4>
                                <p className="text-[10px] text-slate-500 font-tech">Restrict all non-root access nodes.</p>
                            </div>
                        </div>
                        <button onClick={toggleMaintenance} className={`w-14 h-8 rounded-full p-1 relative transition-colors ${isMaintenanceMode ? 'bg-rose-600' : 'bg-slate-800'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${isMaintenanceMode ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Global Site Manifest (Announcement)</label>
                        <textarea 
                            value={globalAnnouncement}
                            onChange={(e) => setGlobalAnnouncement(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 text-xs text-white h-32 focus:ring-1 focus:ring-indigo-500 shadow-inner resize-none font-medium"
                        />
                        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all">Broadcast Update</button>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="glass-panel p-8 rounded-[3rem] border-indigo-500/20 bg-indigo-900/5 space-y-6">
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Active API Gateway</h3>
                    <div className="space-y-4">
                        {['JAP Panel v2', 'Meta Cloud API', 'Gemini Reasoning Node', 'TikTok Business v5'].map(api => (
                            <div key={api} className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                                <span className="text-xs font-bold text-slate-300">{api}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-[9px] font-tech text-emerald-400 font-black uppercase">Active</span>
                                    <button className="text-slate-600 hover:text-white"><i className="fa-solid fa-power-off text-xs"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="glass-panel p-8 rounded-[3rem] border-white/5 flex flex-col justify-center items-center text-center space-y-6 py-12">
                    <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center text-3xl text-slate-400 border border-dashed border-slate-700 animate-pulse">
                        <i className="fa-solid fa-database"></i>
                    </div>
                    <div>
                        <h4 className="font-black text-white uppercase text-lg">Identity Vault Control</h4>
                        <p className="text-xs text-slate-500 max-w-[240px] mx-auto mt-2 leading-relaxed">Manage root database backups and identity node encryption keys.</p>
                    </div>
                    <button className="px-8 py-3 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">Backup Kernel</button>
                </div>
            </div>
        </div>
      )}

      {/* SECURITY TERMINAL */}
      {activeTab === 'security' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="glass-panel p-10 rounded-[3rem] border-rose-500/20 bg-rose-500/5">
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                    <i className="fa-solid fa-user-shield text-rose-500"></i> Identity Surveillance Matrix
                </h3>
                <div className="grid gap-4">
                    {[
                        { ip: '192.168.1.1', user: 'Unknown Node', threat: 'High', reason: 'Brute Force Attempt', time: '2m ago' },
                        { ip: '45.12.8.99', user: 'gamma_synth', threat: 'Low', reason: 'Proxy Rotation Flag', time: '14m ago' },
                        { ip: '102.14.0.12', user: 'Alpha Op', threat: 'Zero', reason: 'Verified Admin', time: 'Live' }
                    ].map((node, i) => (
                        <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-950/60 rounded-[2.5rem] border border-white/5 hover:border-rose-500/20 transition-all">
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${node.threat === 'High' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                    <i className="fa-solid fa-network-wired"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white font-tech">{node.ip}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black">{node.user} • {node.reason}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 mt-4 sm:mt-0">
                                <div className="text-right">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${node.threat === 'High' ? 'text-rose-500' : 'text-emerald-500'}`}>{node.threat} Risk</p>
                                    <p className="text-[9px] text-slate-600 uppercase font-tech">{node.time}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white transition-all"><i className="fa-solid fa-ban text-xs"></i></button>
                                    <button className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><i className="fa-solid fa-eye text-xs"></i></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* MATRIX: PRICING LOGIC */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
           <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel p-8 rounded-[3rem] border-indigo-500/20 bg-gradient-to-br from-indigo-900/10 to-transparent">
                 <h3 className="text-lg font-display font-black text-white uppercase tracking-tighter mb-8">Pricing Orchestrator</h3>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Global Markup Multiplier (%)</label>
                       <input 
                         type="number" 
                         value={markup} 
                         onChange={(e) => setMarkup(Number(e.target.value))}
                         className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-2xl font-display font-black text-indigo-400 focus:ring-1 focus:ring-indigo-500 shadow-inner" 
                       />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">"Commiting this recalibration will immediately update sell-prices across all public social nodes."</p>
                    <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all btn-3d">
                       Commit Multiplier
                    </button>
                 </div>
              </div>
           </div>
           
           <div className="lg:col-span-2">
              <div className="glass-panel rounded-[2.5rem] overflow-hidden border-white/5">
                 <div className="p-6 border-b border-white/5 bg-slate-900/40">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Active Profit Matrix</h4>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left font-tech">
                       <thead className="bg-black/20 text-[9px] text-slate-500 uppercase tracking-widest">
                          <tr>
                             <th className="px-6 py-4">Descriptor</th>
                             <th className="px-6 py-4">Base ($)</th>
                             <th className="px-6 py-4">Market ($)</th>
                             <th className="px-6 py-4">Yield ($)</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {[
                            { name: 'IG Real Followers', in: 1.2, out: 2.5 },
                            { name: 'FB Page Likes', in: 2.5, out: 4.2 },
                            { name: 'TikTok Shares', in: 0.4, out: 1.2 }
                          ].map((s, idx) => (
                             <tr key={idx} className="hover:bg-white/5 transition-colors text-xs">
                                <td className="px-6 py-4 text-white font-bold">{s.name}</td>
                                <td className="px-6 py-4 text-slate-500">${s.in.toFixed(2)}</td>
                                <td className="px-6 py-4 text-indigo-400">${s.out.toFixed(2)}</td>
                                <td className="px-6 py-4 text-emerald-400 font-black">${(s.out - s.in).toFixed(2)}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* LOGS TERMINAL */}
      {activeTab === 'logs' && (
        <div className="glass-panel rounded-[3rem] border-white/5 flex flex-col h-[600px] overflow-hidden animate-in zoom-in-95 duration-500">
           <div className="p-6 border-b border-white/5 bg-slate-900/60 flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest">Live Kernel Telemetry</h3>
                 <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${isLogStreaming ? 'bg-emerald-500 text-white shadow-[0_0_10px_#10b981]' : 'bg-slate-700 text-slate-400'}`}>
                    {isLogStreaming ? 'Polling Datastream' : 'Paused'}
                 </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setIsLogStreaming(!isLogStreaming)} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white shadow-inner">
                    <i className={`fa-solid ${isLogStreaming ? 'fa-pause' : 'fa-play'} text-xs`}></i>
                 </button>
                 <button onClick={() => setLogs([])} className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:text-white transition-all">Clear Terminal</button>
              </div>
           </div>
           
           <div className="flex-1 p-6 bg-black/40 overflow-y-auto font-mono text-[10px] space-y-2 custom-scrollbar select-text">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-4 group hover:bg-white/5 p-1 rounded border-l-2 border-transparent hover:border-indigo-500">
                  <span className="text-slate-600 font-bold shrink-0">[{log.timestamp}]</span>
                  <span className="text-indigo-400 font-black tracking-tighter uppercase shrink-0 min-w-[120px]">{log.node}</span>
                  <span className={`shrink-0 px-1.5 rounded-sm font-black uppercase text-[8px] h-fit mt-0.5 ${
                    log.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                    log.status === 'alert' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {log.status}
                  </span>
                  <span className="text-slate-300">{log.event}</span>
                  <span className="ml-auto text-slate-800 group-hover:text-slate-600">ID:{log.id}</span>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminControl;
