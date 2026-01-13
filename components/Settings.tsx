
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
      alert("System profile synced.");
    }, 1000);
  };

  const currentLang = GLOBAL_LANGUAGES.find(l => l.code === (user.language || 'en-US')) || GLOBAL_LANGUAGES[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Terminal Settings</h2>
            <p className="text-slate-400 font-medium">Calibrate your identity nodes and asset preferences.</p>
        </div>
        
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
            <button 
                onClick={() => setActiveTab('profile')} 
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-200'}`}
            >
                <i className="fa-solid fa-user-shield"></i> Profile
            </button>
            <button 
                onClick={() => setActiveTab('files')} 
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'files' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-200'}`}
            >
                <i className="fa-solid fa-box-open"></i> Assets
            </button>
        </div>
      </div>

      {activeTab === 'files' ? (
          <div className="glass-panel p-8 rounded-[3rem] border-slate-700/50 shadow-2xl">
            <FileLibrary mediaLibrary={mediaLibrary} onUpdateLibrary={onUpdateLibrary} onDeleteMedia={onDeleteMedia} />
          </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-10 rounded-[2.5rem] text-center space-y-6 border-slate-700/50 shadow-xl">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-slate-800 border-4 border-slate-700 mx-auto shadow-2xl flex items-center justify-center relative">
                <div className="absolute inset-0 bg-indigo-600/10"></div>
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user-astronaut text-5xl text-slate-500"></i>}
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-xl border-4 border-[#0f172a] hover:scale-110 transition-transform">
                <i className="fa-solid fa-camera text-sm"></i>
              </button>
            </div>
            <div>
              <h4 className="font-display font-black text-white text-2xl tracking-tight leading-none mb-2">{user.name}</h4>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest bg-indigo-600/10 py-1 rounded-full">{user.role} Authorization</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-10 rounded-[3rem] border-slate-700/50 shadow-2xl">
            <h3 className="text-xl font-display font-black mb-10 text-white uppercase tracking-tighter">Identity Core</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Display Key</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white font-bold shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white font-bold shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                <div className="space-y-2 relative" ref={languageDropdownRef}>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Region & Language</label>
                  <button type="button" onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white font-black flex justify-between items-center shadow-inner hover:bg-slate-900 transition-colors">
                    <span className="flex items-center gap-3"><span className="text-lg">{currentLang?.flag}</span> {currentLang?.name}</span>
                    <i className="fa-solid fa-chevron-down text-[10px] text-slate-600"></i>
                  </button>
                  {isLanguageOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden max-h-60 overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200">
                        {GLOBAL_LANGUAGES.map(lang => (
                            <button key={lang.code} type="button" onClick={() => {onUpdateUser({ language: lang.code }); setIsLanguageOpen(false);}} className={`w-full px-6 py-4 text-left text-[11px] font-black uppercase transition-colors flex items-center gap-3 ${user.language === lang.code ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                <span className="text-lg">{lang.flag}</span> {lang.name}
                            </button>
                        ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Currency</label>
                   <div className="relative">
                       <select value={user.currency} onChange={(e) => onUpdateUser({ currency: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white font-black appearance-none shadow-inner outline-none focus:ring-2 focus:ring-indigo-500">
                            {Object.keys(GLOBAL_CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                       <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 pointer-events-none"></i>
                   </div>
                </div>
              </div>
              <button type="submit" disabled={isUpdating} className="w-full py-5 bg-indigo-600 rounded-3xl font-display font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-900/20 hover:scale-[1.02] transition-all btn-3d">
                {isUpdating ? "Syncing..." : "Sync Identity"}
              </button>
            </form>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Settings;
