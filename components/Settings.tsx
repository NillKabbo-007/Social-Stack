
import React, { useState, useRef, useEffect } from 'react';
import { User, MediaItem } from '../types';
import { GLOBAL_CURRENCIES, GLOBAL_LANGUAGES, TRANSLATIONS } from '../constants';
import FileLibrary from './FileLibrary';

interface SettingsProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  mediaLibrary: MediaItem[];
  onUpdateLibrary: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
  initialTab?: 'profile' | 'files';
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, mediaLibrary, onUpdateLibrary, onDeleteMedia, initialTab = 'profile' }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'files'>(initialTab);
  
  useEffect(() => {
      setActiveTab(initialTab);
  }, [initialTab]);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      onUpdateUser({ name, email });
      setIsUpdating(false);
      alert("System profile updated. All nodes synchronized.");
    }, 1000);
  };

  const currentLang = GLOBAL_LANGUAGES.find(l => l.code === (user.language || 'en-US')) || GLOBAL_LANGUAGES[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 select-none">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Terminal Settings</h2>
            <p className="text-slate-400 font-medium">Calibrate your identity nodes and global display preferences.</p>
        </div>
        
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
            <button 
                onClick={() => setActiveTab('profile')} 
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-200'}`}
            >
                <i className="fa-solid fa-id-card"></i> Identity
            </button>
            <button 
                onClick={() => setActiveTab('files')} 
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'files' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-200'}`}
            >
                <i className="fa-solid fa-folder-open"></i> Asset Vault
            </button>
        </div>
      </div>

      {activeTab === 'files' ? (
          <div className="glass-panel p-8 rounded-[3rem] border-slate-700/50 shadow-2xl">
            <FileLibrary mediaLibrary={mediaLibrary} onUpdateLibrary={onUpdateLibrary} onDeleteMedia={onDeleteMedia} />
          </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-4 space-y-6">
          <div className="glass-panel p-10 rounded-[3rem] text-center space-y-8 border-slate-700/50 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
            <div className="relative inline-block group">
              <div className="w-36 h-36 rounded-[3rem] overflow-hidden bg-slate-800 border-4 border-slate-700 mx-auto shadow-2xl flex items-center justify-center relative transition-transform group-hover:scale-105 duration-500">
                <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/20 transition-colors"></div>
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user-astronaut text-6xl text-slate-600"></i>}
              </div>
              <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-[#020617] hover:scale-110 active:scale-95 transition-all">
                <i className="fa-solid fa-cloud-arrow-up text-sm"></i>
              </button>
            </div>
            <div>
              <h4 className="font-display font-black text-white text-3xl tracking-tight leading-none mb-2 uppercase">{user.name}</h4>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] bg-indigo-600/10 py-2 px-4 inline-block rounded-xl border border-indigo-500/20">{user.role} Master Node</p>
            </div>
            
            <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Stack Balance</p>
                    <p className="text-lg font-display font-black text-emerald-400">${user.balance.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Identity Level</p>
                    <p className="text-lg font-display font-black text-white uppercase">V{user.role === 'admin' ? '5' : '1'}</p>
                </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="glass-panel p-10 rounded-[3rem] border-slate-700/50 shadow-2xl">
            <h3 className="text-xl font-display font-black mb-12 text-white uppercase tracking-tighter flex items-center gap-4">
                <i className="fa-solid fa-sliders text-indigo-500"></i> Identity Logic Configuration
            </h3>
            <form onSubmit={handleProfileUpdate} className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Universal Key (Name)</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white font-bold shadow-inner focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Encrypted Mail (Email)</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white font-bold shadow-inner focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10 border-t border-slate-800">
                <div className="space-y-4 relative" ref={languageDropdownRef}>
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Language Node</label>
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">v3.4 Multilingual</span>
                  </div>
                  <button type="button" onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-5 text-sm text-white font-black flex justify-between items-center shadow-inner hover:bg-slate-900 transition-all group">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl transition-transform group-hover:scale-110">{currentLang?.flag}</span>
                        <div className="text-left">
                            <p className="leading-none">{currentLang?.name}</p>
                            <p className="text-[8px] text-slate-600 uppercase mt-1 tracking-widest">{currentLang?.region}</p>
                        </div>
                    </div>
                    <i className={`fa-solid fa-chevron-down text-[10px] text-slate-600 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  {isLanguageOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900 border border-slate-700 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden max-h-80 overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200 backdrop-blur-xl">
                        <div className="p-4 bg-slate-950/50 border-b border-white/5">
                            <input type="text" placeholder="Filter languages..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold text-white uppercase outline-none focus:ring-1 focus:ring-indigo-500" />
                        </div>
                        <div className="p-2">
                            {GLOBAL_LANGUAGES.map(lang => (
                                <button key={lang.code} type="button" onClick={() => {onUpdateUser({ language: lang.code }); setIsLanguageOpen(false);}} className={`w-full px-5 py-4 rounded-xl text-left text-[11px] font-black uppercase transition-all flex items-center justify-between group ${user.language === lang.code ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl">{lang.flag}</span>
                                        <span>{lang.name}</span>
                                    </div>
                                    {user.language === lang.code && <i className="fa-solid fa-circle-check text-xs"></i>}
                                </button>
                            ))}
                        </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fiat Matrix (Currency)</label>
                   </div>
                   <div className="relative group">
                       <select value={user.currency} onChange={(e) => onUpdateUser({ currency: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-5 text-sm text-white font-black appearance-none shadow-inner outline-none focus:ring-1 focus:ring-indigo-500 transition-all hover:bg-slate-900">
                            {Object.keys(GLOBAL_CURRENCIES).map(c => <option key={c} value={c}>{c} - {GLOBAL_CURRENCIES[c].name}</option>)}
                       </select>
                       <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 pointer-events-none group-hover:text-white transition-colors"></i>
                   </div>
                </div>
              </div>
              
              <div className="pt-6">
                <button type="submit" disabled={isUpdating} className="w-full py-6 bg-indigo-600 rounded-[2rem] font-display font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(99,102,241,0.2)] hover:bg-indigo-500 transition-all btn-3d active:scale-95 flex items-center justify-center gap-4">
                    {isUpdating ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-shield-check"></i>}
                    {isUpdating ? "Synchronizing Matrix..." : "Commit Profile Changes"}
                </button>
              </div>
            </form>
          </div>
          
          <div className="glass-panel p-8 rounded-[2.5rem] border-rose-500/20 bg-rose-500/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg"><i className="fa-solid fa-radiation"></i></div>
                  <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">Terminal Access</h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">Destroy active session node and flush identity caches.</p>
                  </div>
              </div>
              <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">Terminate Node</button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Settings;
