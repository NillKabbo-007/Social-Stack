
import React, { useState } from 'react';

const AdminAPIConnect: React.FC = () => {
  const [providers, setProviders] = useState([
    { id: 1, name: 'Social Stack Core', url: 'https://core-handshake.socialstack.io/api/v2', key: '••••••••••••••', status: 'Active' },
    { id: 2, name: 'Global SMM Node', url: 'https://network-grid.socialstack.io/api/v2', key: '••••••••••••••', status: 'Disabled' }
  ]);

  const handleSyncServices = (providerName: string) => {
    alert(`Synchronizing protocol nodes from ${providerName}... This may take a few minutes.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">API Handshake Matrix</h2>
        <p className="text-slate-400">Sync services and automate provisioning by connecting external supply nodes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2.5rem] border-indigo-500/20 space-y-6">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Provision New Node</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-tech font-bold text-slate-500 uppercase tracking-widest ml-1">Provider Node Name</label>
              <input type="text" placeholder="e.g. Identity Hub 01" className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-tech font-bold text-slate-500 uppercase tracking-widest ml-1">Handshake URL</label>
              <input type="text" placeholder="https://provider.io/api/v2" className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-tech font-bold text-slate-500 uppercase tracking-widest ml-1">Auth Secret Key</label>
              <input type="password" placeholder="Enter encrypted API key" className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="flex gap-4 pt-2">
              <button className="flex-1 py-4 bg-indigo-600 rounded-2xl font-black text-[10px] text-white uppercase tracking-widest hover:bg-indigo-500 transition-all btn-3d">Verify & Lock Node</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Active Infrastructure</h3>
          {providers.map(p => (
            <div key={p.id} className="glass-panel p-6 rounded-[2rem] border-slate-800 flex flex-col gap-4 group transition-all hover:border-indigo-500/30">
              <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-xl text-indigo-400">
                      <i className="fa-solid fa-link"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm uppercase tracking-tight">{p.name}</h4>
                      <p className="text-[9px] text-slate-600 truncate max-w-[200px] font-tech">{p.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {p.status}
                    </span>
                    <button className="text-slate-600 hover:text-white transition-colors"><i className="fa-solid fa-gear"></i></button>
                  </div>
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-end">
                <button onClick={() => handleSyncServices(p.name)} className="text-[9px] font-black text-indigo-400 hover:text-white uppercase flex items-center gap-2 tracking-widest transition-all">
                    <i className="fa-solid fa-cloud-arrow-down"></i> Sync Node Data
                </button>
              </div>
            </div>
          ))}

          <div className="p-6 rounded-[2rem] bg-indigo-600/5 border border-dashed border-indigo-500/20">
            <p className="text-[11px] text-indigo-400/70 italic leading-relaxed">
              <i className="fa-solid fa-circle-info mr-2"></i>
              Ensure your provider nodes maintain sufficient liquidity for automated provisioning. 
              The system recommends a minimum threshold of $100 per active API handshake.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAPIConnect;
