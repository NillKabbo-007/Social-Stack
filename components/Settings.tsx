
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

  // Profile State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  
  // Language Selector State
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      alert("Profile and Preferences updated successfully!");
    }, 1000);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setIsUpdating(true);
    setTimeout(() => {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsUpdating(false);
      alert("Password changed successfully!");
    }, 1500);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingAvatar(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ avatar: reader.result as string });
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggle2FA = () => {
    if (!user.twoFactorEnabled) {
      setShow2FA(true);
    } else {
      if (confirm("Disable 2-Factor Authentication? This will lower your account security.")) {
        onUpdateUser({ twoFactorEnabled: false });
      }
    }
  };

  const confirmEnable2FA = () => {
    onUpdateUser({ twoFactorEnabled: true });
    setShow2FA(false);
    alert("2FA Enabled Successfully!");
  };

  const t = TRANSLATIONS[user.language || 'en-US'] || TRANSLATIONS['en-US'];
  const currentLang = GLOBAL_LANGUAGES.find(l => l.code === (user.language || 'en-US')) || GLOBAL_LANGUAGES[0];
  const filteredLanguages = GLOBAL_LANGUAGES.filter(l => l.name.toLowerCase().includes(languageSearch.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h2 className="text-3xl font-extrabold text-white">Account & Assets</h2>
            <p className="text-slate-400">Manage your profile, security, and global media library.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-700">
            <button 
                onClick={() => setActiveTab('profile')} 
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
                <i className="fa-solid fa-id-badge"></i> Profile
            </button>
            <button 
                onClick={() => setActiveTab('files')} 
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'files' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
                <i className="fa-solid fa-folder-open"></i> File Library
            </button>
        </div>
      </div>

      {activeTab === 'files' ? (
          <FileLibrary mediaLibrary={mediaLibrary} onUpdateLibrary={onUpdateLibrary} onDeleteMedia={onDeleteMedia} />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-8 rounded-3xl text-center space-y-4">
            <div className="relative inline-block group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-800 border-4 border-slate-700 mx-auto shadow-2xl relative">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user text-4xl mt-6 text-slate-500"></i>}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <i className="fa-solid fa-circle-notch fa-spin text-white"></i>
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white border-2 border-[#0f172a] hover:bg-indigo-500 transition-colors shadow-lg"
              >
                <i className="fa-solid fa-camera text-[10px]"></i>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">{user.name}</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{user.role === 'admin' ? t.masterAdmin : t.growthSpecialist}</p>
            </div>
            <div className="pt-4 border-t border-slate-700/50">
               <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500 uppercase tracking-tight">Node Balance</span>
                  <span className="text-emerald-400">${user.balance.toFixed(2)}</span>
               </div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Sessions</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <i className="fa-solid fa-desktop text-indigo-400"></i>
                <div>
                  <p className="text-[10px] font-bold text-white">Windows Desktop (Current)</p>
                  <p className="text-[8px] text-slate-500 uppercase">San Francisco, USA</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30 opacity-60">
                <i className="fa-solid fa-mobile-screen text-slate-500"></i>
                <div>
                  <p className="text-[10px] font-bold text-white">iPhone 14 Pro</p>
                  <p className="text-[8px] text-slate-500 uppercase">Last active 2h ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          
          {/* PROFILE CARD */}
          <div className="glass-panel p-8 rounded-3xl border-slate-700/50">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-id-card text-indigo-500"></i> Profile Details
            </h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Display Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Email Node</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isUpdating}
                className="px-6 py-3 bg-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-500 transition-all disabled:opacity-50"
              >
                {isUpdating ? "Syncing..." : "Update Profile"}
              </button>
            </form>
          </div>

          {/* LOCALIZATION & LANGUAGE CARD */}
          <div className="glass-panel p-8 rounded-3xl border-indigo-500/20">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-earth-americas text-indigo-500"></i> Global Localization
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Custom Language Dropdown */}
                <div className="space-y-2 relative" ref={languageDropdownRef}>
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Interface Language</label>
                  <button 
                    type="button"
                    onClick={() => {
                        setIsLanguageOpen(!isLanguageOpen);
                        setLanguageSearch('');
                    }}
                    className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-indigo-500 font-bold text-white shadow-inner transition-all hover:bg-slate-750 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                        <span className="text-lg">{currentLang?.flag}</span>
                        <span>{currentLang?.name}</span>
                    </div>
                    <i className={`fa-solid fa-chevron-down text-slate-500 text-xs transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  
                  {isLanguageOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-64 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
                            <div className="relative">
                                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search language..." 
                                    value={languageSearch}
                                    onChange={(e) => setLanguageSearch(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto p-1 custom-scrollbar">
                            {filteredLanguages.length > 0 ? (
                                filteredLanguages.map(lang => (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        onClick={() => {
                                            onUpdateUser({ language: lang.code });
                                            setIsLanguageOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${user.language === lang.code ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                                    >
                                        <span className="text-base">{lang.flag}</span>
                                        {lang.name}
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-[10px] text-slate-500">No language found</div>
                            )}
                        </div>
                    </div>
                  )}
                  <p className="text-[9px] text-slate-500 ml-1 font-medium">Updates global UI text direction and locale formats.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Billing Currency</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <i className="fa-solid fa-coins text-amber-500"></i>
                    </div>
                    <select
                        value={user.currency || 'USD'}
                        onChange={(e) => onUpdateUser({ currency: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700/50 rounded-xl pl-10 pr-10 py-3 text-sm focus:ring-1 focus:ring-amber-500 appearance-none font-bold text-white shadow-inner transition-all hover:bg-slate-750 cursor-pointer"
                    >
                        {Object.entries(GLOBAL_CURRENCIES).map(([code, data]) => (
                            <option key={code} value={code}>{data.symbol} {code} - {data.name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-chevron-down text-slate-500 text-xs group-hover:text-white transition-colors"></i>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-500 ml-1 font-medium">Auto-converts dashboard metrics and pricing.</p>
                </div>
            </div>
          </div>

          {/* SECURITY CARD */}
          <div className="glass-panel p-8 rounded-3xl border-rose-500/20">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-rose-500"></i> Security Credentials
            </h3>
            
            <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-white">Two-Factor Authentication</h4>
                    <p className="text-[10px] text-slate-500">Secure your account with an authenticator app.</p>
                </div>
                <button 
                    onClick={toggle2FA}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${user.twoFactorEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                >
                    {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </button>
            </div>

            {show2FA && (
                <div className="mb-6 p-6 bg-slate-900 border border-slate-700 rounded-2xl animate-in zoom-in-95 duration-300">
                    <h4 className="text-sm font-bold text-white mb-4 text-center">Scan QR Code</h4>
                    <div className="bg-white p-2 w-40 h-40 mx-auto rounded-lg mb-4">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/SocialStack:User?secret=JBSWY3DPEHPK3PXP" alt="QR" className="w-full h-full" />
                    </div>
                    <div className="space-y-2">
                        <input type="text" placeholder="Enter 6-digit code" className="w-full bg-slate-800 border-slate-600 rounded-xl p-3 text-center tracking-widest text-lg font-bold" />
                        <button onClick={confirmEnable2FA} className="w-full py-3 bg-emerald-600 rounded-xl font-bold text-white uppercase text-xs">Verify & Enable</button>
                    </div>
                </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4 border-t border-slate-700 pt-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Current Password</label>
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-rose-500" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-rose-500" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-rose-500" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isUpdating}
                className="px-6 py-3 bg-rose-600 rounded-xl font-bold text-xs hover:bg-rose-500 transition-all disabled:opacity-50"
              >
                {isUpdating ? "Hardening Node..." : "Revoke & Reset Password"}
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
