
import React, { useState, useEffect } from 'react';
import { GLOBAL_INTEGRATIONS } from '../constants';

const IntegrationsHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [connectedApps, setConnectedApps] = useState<string[]>(() => {
    const saved = localStorage.getItem('socialstack_connected_apps');
    return saved ? JSON.parse(saved) : ['meta', 'tiktok', 'google_ads', 'whatsapp'];
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    localStorage.setItem('socialstack_connected_apps', JSON.stringify(connectedApps));
  }, [connectedApps]);

  // Modal State
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [bearerToken, setBearerToken] = useState(''); // Twitter specific
  const [orgId, setOrgId] = useState(''); // LinkedIn specific
  const [isConnecting, setIsConnecting] = useState(false);

  const categories = ['All', 'Social', 'Messaging', 'AI & Bot', 'Ads', 'Ecommerce', 'Streaming', 'Business'];

  const handleOpenModal = (app: any) => {
    if (connectedApps.includes(app.id)) {
        // Disconnect logic
        if(confirm(`Disconnect ${app.name}?`)) {
            setConnectedApps(prev => prev.filter(id => id !== app.id));
        }
        return;
    }
    setSelectedApp(app);
    setApiKey('');
    setApiSecret('');
    setBearerToken('');
    setOrgId('');
    setIsModalOpen(true);
  };

  const handleConnect = () => {
    if (!apiKey) {
        alert("Please enter a valid Client ID or API Key.");
        return;
    }
    if (selectedApp.id === 'linkedin' && !orgId) {
        alert("Please enter your LinkedIn Organization ID (URN).");
        return;
    }
    if (selectedApp.id === 'twitter' && !apiSecret) {
        alert("Please enter your API Secret.");
        return;
    }

    setIsConnecting(true);
    setTimeout(() => {
        setConnectedApps(prev => [...prev, selectedApp.id]);
        setIsConnecting(false);
        setIsModalOpen(false);
        setSelectedApp(null);
        alert(`Success! ${selectedApp.name} node has been linked.`);
    }, 1500);
  };

  const filteredIntegrations = GLOBAL_INTEGRATIONS.filter(app => {
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Global Integration Grid</h2>
          <p className="text-slate-400 mt-2">Connect your entire digital ecosystem. Socials, AI Agents, Ads, and CRMs.</p>
        </div>
        
        <div className="flex flex-col gap-4">
           <div className="relative">
              <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input 
                 type="text" 
                 placeholder="Search apps (e.g. Grok, Line)..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-indigo-500 w-full md:w-80"
              />
           </div>
           <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-2xl pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    activeCategory === cat 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredIntegrations.map(app => (
          <div key={app.id} className={`glass-panel p-6 rounded-3xl border transition-all duration-300 group ${connectedApps.includes(app.id) ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700/50 hover:border-indigo-500/30'}`}>
             <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform group-hover:scale-110 ${connectedApps.includes(app.id) ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                   <i className={app.icon} style={{ color: connectedApps.includes(app.id) ? app.color : '' }}></i>
                </div>
                <div className={`w-3 h-3 rounded-full ${connectedApps.includes(app.id) ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}></div>
             </div>
             
             <div className="space-y-1 mb-6">
                <h3 className="font-bold text-white text-lg">{app.name}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{app.category} Node</p>
             </div>

             <button 
               onClick={() => handleOpenModal(app)}
               className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                 connectedApps.includes(app.id)
                   ? 'bg-emerald-600/10 text-emerald-400 hover:bg-rose-600/10 hover:text-rose-400'
                   : 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white'
               }`}
             >
               {connectedApps.includes(app.id) ? (
                 <>
                   <i className="fa-solid fa-link"></i> Connected
                 </>
               ) : (
                 <>
                   <i className="fa-solid fa-plug"></i> Connect
                 </>
               )}
             </button>
          </div>
        ))}
      </div>

      {/* Connection Modal */}
      {isModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#0f172a] border border-slate-700 w-full max-w-md rounded-[2rem] p-8 space-y-6 shadow-2xl relative">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                >
                    <i className="fa-solid fa-xmark text-xl"></i>
                </button>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                        <i className={selectedApp.icon} style={{ color: selectedApp.color }}></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Connect {selectedApp.name}</h3>
                        <p className="text-xs text-slate-400">Enter your API credentials to sync.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Client ID / API Key</label>
                        <input 
                            type="text" 
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 text-white"
                            placeholder={`Enter ${selectedApp.name} Client ID`}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Client Secret</label>
                        <input 
                            type="password" 
                            value={apiSecret}
                            onChange={(e) => setApiSecret(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 text-white"
                            placeholder="••••••••••••"
                        />
                    </div>
                    
                    {selectedApp.id === 'twitter' && (
                        <div className="space-y-1 animate-in fade-in duration-300">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Bearer Token (v2 API)</label>
                            <input 
                                type="password" 
                                value={bearerToken}
                                onChange={(e) => setBearerToken(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 text-white"
                                placeholder="Essential for v2 endpoints"
                            />
                        </div>
                    )}

                    {selectedApp.id === 'linkedin' && (
                        <div className="space-y-1 animate-in fade-in duration-300">
                            <label className="text-[10px] font-bold text-indigo-400 uppercase ml-1">Organization ID (URN)</label>
                            <input 
                                type="text" 
                                value={orgId}
                                onChange={(e) => setOrgId(e.target.value)}
                                className="w-full bg-slate-900 border border-indigo-500/50 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 text-white"
                                placeholder="urn:li:organization:1234567"
                            />
                            <p className="text-[8px] text-slate-500 ml-1">Required for Company Page posting & analytics.</p>
                        </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-indigo-600" />
                        <span className="text-[10px] text-slate-400">Allow Read/Write access for Analytics & Posting</span>
                    </div>
                </div>

                <button 
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                    {isConnecting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-link"></i>}
                    {isConnecting ? 'Verifying Keys...' : 'Authorize Connection'}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsHub;
