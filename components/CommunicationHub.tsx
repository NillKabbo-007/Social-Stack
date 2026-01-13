
import React, { useState } from 'react';

const CommunicationHub: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'api' | 'login' | null>(null);

  const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', icon: 'fa-whatsapp', color: '#25D366' },
    { id: 'messenger', name: 'Messenger', icon: 'fa-facebook-messenger', color: '#00B2FF' },
    { id: 'instagram', name: 'Instagram DM', icon: 'fa-instagram', color: '#E1306C' },
    { id: 'gmail', name: 'Gmail', icon: 'fa-envelope', color: '#EA4335' },
    { id: 'outlook', name: 'Outlook', icon: 'fa-envelope-open-text', color: '#0078D4' },
    { id: 'telegram', name: 'Telegram', icon: 'fa-telegram', color: '#24A1DE' },
  ];

  if (!activePlatform) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 py-10 animate-in fade-in duration-500">
          <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Omni-Channel Connect</h2>
              <p className="text-slate-400 max-w-xl mx-auto font-medium">Select a communication node to initialize secure synchronization.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setActivePlatform(p.id)}
                    className="glass-panel p-8 rounded-[2.5rem] border border-slate-700/50 hover:border-indigo-500/50 transition-all group flex flex-col items-center text-center space-y-6"
                  >
                      <div className="w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 transition-transform" style={{ color: p.color }}>
                          <i className={`fa-brands ${p.icon} ${p.id.includes('mail') || p.id === 'outlook' ? 'fa-solid' : ''}`}></i>
                      </div>
                      <div>
                          <h3 className="text-xl font-black text-white uppercase tracking-tight">{p.name}</h3>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Status: Disconnected</p>
                      </div>
                      <div className="px-6 py-2 bg-indigo-600/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">Initialize Node</div>
                  </button>
              ))}
          </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 animate-in zoom-in-95 duration-500">
        <button onClick={() => {setActivePlatform(null); setAuthMode(null);}} className="text-slate-500 hover:text-white font-bold uppercase text-[10px] mb-8 flex items-center gap-2">
            <i className="fa-solid fa-arrow-left"></i> Back to Platform Grid
        </button>

        <div className="glass-panel p-12 rounded-[3rem] border-slate-700/50 text-center space-y-10">
            <div className="flex justify-center">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center text-5xl shadow-2xl" style={{ color: platforms.find(p => p.id === activePlatform)?.color }}>
                    <i className={`fa-brands ${platforms.find(p => p.id === activePlatform)?.icon} ${activePlatform.includes('mail') ? 'fa-solid' : ''}`}></i>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Authorize {platforms.find(p => p.id === activePlatform)?.name}</h3>
                <p className="text-slate-400 font-medium italic">"Select your preferred synchronization protocol."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                    onClick={() => setAuthMode('api')}
                    className={`p-8 rounded-[2rem] border-2 transition-all text-left space-y-4 ${authMode === 'api' ? 'border-indigo-600 bg-indigo-600/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 text-xl"><i className="fa-solid fa-plug"></i></div>
                    <div>
                        <h4 className="font-black text-white uppercase tracking-tight">API Integration</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">Connect via official Cloud API with support for automated AI chat replies and bulk broadcasting.</p>
                    </div>
                </button>

                <button 
                    onClick={() => setAuthMode('login')}
                    className={`p-8 rounded-[2rem] border-2 transition-all text-left space-y-4 ${authMode === 'login' ? 'border-emerald-600 bg-emerald-600/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 text-xl"><i className="fa-solid fa-right-to-bracket"></i></div>
                    <div>
                        <h4 className="font-black text-white uppercase tracking-tight">Direct Node Login</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">Sign in directly with your credentials. Fast setup for manual inbox management and quick responses.</p>
                    </div>
                </button>
            </div>

            {authMode && (
                <div className="space-y-6 pt-10 border-t border-slate-800 animate-in slide-in-from-top-4">
                    <div className="space-y-4 max-w-md mx-auto">
                        <div className="space-y-1 text-left">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{authMode === 'api' ? 'API Token / Key' : 'Email / Username'}</label>
                            <input 
                                type={authMode === 'api' ? 'password' : 'text'}
                                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm text-white focus:ring-1 focus:ring-indigo-500" 
                                placeholder={authMode === 'api' ? '••••••••••••••••' : 'admin@domain.com'}
                            />
                        </div>
                        {authMode === 'login' && (
                             <div className="space-y-1 text-left">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
                                <input 
                                    type="password"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm text-white focus:ring-1 focus:ring-indigo-500" 
                                    placeholder="••••••••"
                                />
                            </div>
                        )}
                        <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Authenticate Connection</button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default CommunicationHub;
