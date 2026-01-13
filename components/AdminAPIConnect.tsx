
import React, { useState } from 'react';

const AdminAPIConnect: React.FC = () => {
  const [providers, setProviders] = useState([
    { id: 1, name: 'JAP Panel', url: 'https://justanotherpanel.com/api/v2', key: '••••••••••••••', status: 'Active' },
    { id: 2, name: 'SMM Kings', url: 'https://smmking.net/api/v2', key: '••••••••••••••', status: 'Disabled' }
  ]);

  const handleSyncServices = (providerName: string) => {
    alert(`Syncing services from ${providerName}... This may take a few minutes.`);
    // Logic to import services would go here
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold">External API Connect</h2>
        <p className="text-slate-400">Sync services and automate orders by connecting external provider APIs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border-indigo-500/20 space-y-6">
          <h3 className="text-xl font-bold">Add New Provider</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Provider Name</label>
              <input type="text" placeholder="e.g. PeakSMM" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">API Base URL</label>
              <input type="text" placeholder="https://provider.com/api/v2" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">API Key</label>
              <input type="password" placeholder="Enter your secret API key" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm" />
            </div>
            <div className="flex gap-4 pt-2">
              <button className="flex-1 py-4 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-all">Test & Save</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">Configured Providers</h3>
          {providers.map(p => (
            <div key={p.id} className="glass-panel p-6 rounded-2xl border-slate-700 flex flex-col gap-4 group">
              <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-xl">
                      <i className="fa-solid fa-link"></i>
                    </div>
                    <div>
                      <h4 className="font-bold">{p.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{p.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {p.status}
                    </span>
                    <button className="text-slate-500 hover:text-white transition-colors"><i className="fa-solid fa-gear"></i></button>
                  </div>
              </div>
              <div className="border-t border-slate-700 pt-4 flex justify-end">
                <button onClick={() => handleSyncServices(p.name)} className="text-[10px] font-bold text-indigo-400 hover:text-white uppercase flex items-center gap-2">
                    <i className="fa-solid fa-cloud-arrow-down"></i> Import / Sync Services
                </button>
              </div>
            </div>
          ))}

          <div className="glass-panel p-6 rounded-2xl bg-amber-500/5 border-dashed border-amber-500/30">
            <p className="text-xs text-amber-200/70 italic">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i>
              Ensure your providers have sufficient balance to fulfill automatic orders. We recommend keeping at least $100 in each connected API wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAPIConnect;
