
import React, { useState, useEffect } from 'react';

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
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'nexus' | 'database' | 'payments' | 'php_nodes' | 'logs'>('diagnostics');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [globalAnnouncement, setGlobalAnnouncement] = useState('Welcome to Social Stack v3.5. System Core: Nominal.');
  const [isLogStreaming, setIsLogStreaming] = useState(true);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Liquidity State
  const [platformLiquidity, setPlatformLiquidity] = useState({
    bkash: 45200.50,
    stripe: 12400.00,
    binance: 8.42, // BTC
    external_api_balance: 1420.25
  });

  const [orders] = useState<OrderNode[]>([
    { id: 'ORD-8821', user: 'Alpha Op', service: 'IG Real Followers', target: 'social_stack_ig', cost: 12.50, status: 'processing' },
    { id: 'ORD-8822', user: 'Delta Node', service: 'TikTok Likes', target: 'viral_vids_99', cost: 4.20, status: 'completed' },
    { id: 'ORD-8823', user: 'Gamma Synth', service: 'VPS Premium', target: 'nyc-node-01', cost: 45.00, status: 'pending' }
  ]);

  useEffect(() => {
    if (!isLogStreaming) return;
    const interval = setInterval(() => {
      const nodes = ['CORE_KERNEL', 'STRIPE_GATEWAY', 'PHP_8.3_NODE', 'SQLITE_PRIMARY', 'AUTH_NODE'];
      const events = ['Socket heartbeat', 'Sync protocol initiated', 'Liquidity check passed', 'Token refreshed', 'Node healthy'];
      const statuses: any[] = ['info', 'success', 'info', 'alert'];
      
      const newLog: SystemLog = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
        node: nodes[Math.floor(Math.random() * nodes.length)],
        event: events[Math.floor(Math.random() * events.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };
      setLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 3000);
    return () => clearInterval(interval);
  }, [isLogStreaming]);

  const triggerGlobalSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("GLOBAL NODE SYNC COMPLETE: All external provider services, prices, and balances have been updated.");
    }, 2000);
  };

  const downloadSqliteSchema = () => {
      alert("Preparing SQLite Schema Export (v3.5)... Check your terminal output.");
      console.log("-- SQLITE SCHEMA EXPORT INITIALIZED");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 select-none pb-20">
      {/* TACTICAL HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${isMaintenanceMode ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_15px_#10b981]'} animate-pulse`}></div>
            <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Admin Root Console</h2>
          </div>
          <p className="text-slate-400 font-tech text-[10px] uppercase tracking-widest">Master Authority Level • Cluster ID: SOC-STK-PRIMARY</p>
        </div>
        
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl overflow-x-auto max-w-full no-scrollbar">
          {[
            { id: 'diagnostics', icon: 'fa-gauge-high', label: 'Pulse' },
            { id: 'nexus', icon: 'fa-microchip', label: 'Nexus' },
            { id: 'payments', icon: 'fa-money-bill-transfer', label: 'Fiat' },
            { id: 'php_nodes', icon: 'fa-code', label: 'PHP' },
            { id: 'database', icon: 'fa-database', label: 'SQL' },
            { id: 'logs', icon: 'fa-terminal', label: 'Telemetry' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all shrink-0 ${
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
                    <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 text-center group">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Core Uptime</p>
                        <h4 className="text-3xl font-display font-black text-emerald-400 tracking-tighter mb-2">99.9%</h4>
                        <i className="fa-solid fa-clock text-slate-800 opacity-20 text-4xl"></i>
                    </div>
                    <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 text-center group">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">API Latency</p>
                        <h4 className="text-3xl font-display font-black text-indigo-400 tracking-tighter mb-2">24ms</h4>
                        <i className="fa-solid fa-bolt text-slate-800 opacity-20 text-4xl"></i>
                    </div>
                    <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 text-center group">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Total Users</p>
                        <h4 className="text-3xl font-display font-black text-amber-400 tracking-tighter mb-2">15.4k</h4>
                        <i className="fa-solid fa-users text-slate-800 opacity-20 text-4xl"></i>
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-[3rem] border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">High-Priority Orders</h3>
                        <button onClick={triggerGlobalSync} disabled={isSyncing} className="px-4 py-2 bg-indigo-600 rounded-xl text-[9px] font-black uppercase text-white hover:bg-indigo-500 transition-all flex items-center gap-2">
                           {isSyncing ? <i className="fa-solid fa-sync fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-down"></i>}
                           Sync All APIs
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-tech">
                            <thead className="bg-black/20 text-[9px] text-slate-500 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Node ID</th>
                                    <th className="px-6 py-4">Identity</th>
                                    <th className="px-6 py-4">Protocol</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map(o => (
                                    <tr key={o.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-slate-400 text-xs">{o.id}</td>
                                        <td className="px-6 py-4 text-white text-xs">{o.user}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">{o.service}</td>
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
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Liquidity Summary</h3>
                    <div className="space-y-4 font-tech">
                        <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] text-slate-500 uppercase">bKash Portal</span>
                            <span className="text-emerald-400 font-black">৳{platformLiquidity.bkash.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] text-slate-500 uppercase">Stripe Node</span>
                            <span className="text-indigo-400 font-black">${platformLiquidity.stripe.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] text-slate-500 uppercase">Binance Core</span>
                            <span className="text-amber-400 font-black">{platformLiquidity.binance} BTC</span>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-4 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-700 transition-all">Audit Ledger</button>
                </div>
            </div>
        </div>
      )}

      {/* DATABASE MATRIX */}
      {activeTab === 'database' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="glass-panel p-10 rounded-[3rem] border-white/5 space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">SQLite Matrix Node</h3>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase">Primary Storage</span>
                </div>
                <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] text-slate-500 font-tech uppercase tracking-widest">Database Node ID</span>
                        <span className="text-xs text-white font-mono">SOC-DB-LOCAL-01</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] text-slate-500 font-tech uppercase tracking-widest">Storage Status</span>
                        <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Synchronized
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-tech uppercase tracking-widest">Total Rows Indexed</span>
                        <span className="text-xs text-white font-black">124,502</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Table Hierarchy</p>
                    <div className="grid grid-cols-2 gap-3">
                        {['users', 'orders', 'transactions', 'system_settings', 'assets', 'system_logs'].map(table => (
                            <div key={table} className="px-4 py-3 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-between group">
                                <span className="text-[10px] text-slate-300 font-bold font-tech">{table}</span>
                                <i className="fa-solid fa-table-list text-slate-700 group-hover:text-indigo-400 transition-colors"></i>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-panel p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-indigo-900/10 to-transparent flex flex-col justify-between">
                <div className="space-y-6">
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">Database Maintenance</h3>
                    <p className="text-sm text-slate-400 leading-relaxed italic">"Manage and export your local node schema for high-fidelity deployment."</p>
                    
                    <div className="space-y-4 pt-4">
                        <button onClick={downloadSqliteSchema} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl flex items-center justify-center gap-4 transition-all">
                            <i className="fa-solid fa-file-export text-indigo-400"></i>
                            <span className="text-[10px] font-black uppercase tracking-widest">Download SQLite SQL File</span>
                        </button>
                        <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl flex items-center justify-center gap-4 transition-all">
                            <i className="fa-solid fa-broom text-rose-400"></i>
                            <span className="text-[10px] font-black uppercase tracking-widest">Vacuum Database Node</span>
                        </button>
                        <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl flex items-center justify-center gap-4 transition-all">
                            <i className="fa-solid fa-cloud-arrow-up text-emerald-400"></i>
                            <span className="text-[10px] font-black uppercase tracking-widest">Sync with Cloud Proxy</span>
                        </button>
                    </div>
                </div>
                <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-[2rem] mt-8">
                    <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-2">Safety Protocol</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Always export your SQLite node data before changing PHP versions to prevent environment fragmentation.</p>
                </div>
            </div>
        </div>
      )}

      {/* PHP NODE CONFIGURATION */}
      {activeTab === 'php_nodes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-500">
           <div className="glass-panel p-10 rounded-[3rem] border-white/5 space-y-8">
              <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">PHP Runtime Stack</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">Control the server-side environment nodes across your cloud infrastructure.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { ver: '5.6', status: 'Legacy', color: 'text-amber-500' },
                   { ver: '7.4', status: 'Stable', color: 'text-indigo-400' },
                   { ver: '8.1', status: 'Optimal', color: 'text-emerald-400' },
                   { ver: '8.3', status: 'Production', color: 'text-emerald-400' },
                   { ver: '8.4', status: 'Experimental', color: 'text-rose-400' },
                 ].map(php => (
                   <div key={php.ver} className="p-6 bg-slate-950/60 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                      <div>
                         <p className="text-2xl font-display font-black text-white">v{php.ver}</p>
                         <p className={`text-[8px] font-black uppercase tracking-widest ${php.color}`}>{php.status}</p>
                      </div>
                      <button className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"><i className="fa-solid fa-power-off"></i></button>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-panel p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-indigo-900/10 to-transparent flex flex-col justify-between">
              <div className="space-y-6">
                 <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">Global PHP Master Switch</h3>
                 <p className="text-sm text-slate-500 italic">"Force all Cloud Nodes to synchronize with a specific PHP environment version."</p>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Version Node</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white font-black outline-none focus:ring-1 focus:ring-indigo-500">
                        <option>PHP 8.3 (LTS Recommended)</option>
                        <option>PHP 8.1 (Backward Compatible)</option>
                        <option>PHP 7.4 (End of Life)</option>
                    </select>
                 </div>
              </div>
              <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl mt-12 transition-all btn-3d">Authorize Stack Update</button>
           </div>
        </div>
      )}

      {/* NEXUS / GLOBAL SETTINGS */}
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
                        <button onClick={() => setIsMaintenanceMode(!isMaintenanceMode)} className={`w-14 h-8 rounded-full p-1 relative transition-colors ${isMaintenanceMode ? 'bg-rose-600' : 'bg-slate-800'}`}>
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
            
            <div className="glass-panel p-10 rounded-[3rem] border-white/5 flex flex-col justify-center items-center text-center space-y-6">
                <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center text-3xl text-slate-400 border border-dashed border-slate-700">
                    <i className="fa-solid fa-database"></i>
                </div>
                <div>
                    <h4 className="font-black text-white uppercase text-lg">System Vault Control</h4>
                    <p className="text-xs text-slate-500 max-w-[240px] mx-auto mt-2 leading-relaxed">Manage root database backups, identity node encryption keys, and session logs.</p>
                </div>
                <div className="flex gap-4 w-full">
                    <button className="flex-1 px-8 py-3 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">Export Database</button>
                    <button className="flex-1 px-8 py-3 bg-rose-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all">Flush Sessions</button>
                </div>
            </div>
        </div>
      )}

      {/* TELEMETRY / LOGS */}
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
