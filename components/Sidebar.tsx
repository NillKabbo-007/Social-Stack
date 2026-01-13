
import React, { useState } from 'react';
import { AppRoute, User } from '../types';
import Logo from './Logo';
import { TRANSLATIONS } from '../constants';

interface SidebarProps {
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
  onLogout: () => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRoute, setRoute, onLogout, user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAdmin = user.role === 'admin';
  const t = TRANSLATIONS[user.language || 'en-US'] || TRANSLATIONS['en-US'];

  // Enhanced menu with dynamic labels from translations
  const userMenuItems = [
    { id: AppRoute.DASHBOARD, label: t.dashboard, icon: 'fa-chart-pie', color: 'text-blue-400' },
    { id: AppRoute.FILES, label: t.assets, icon: 'fa-file-import', color: 'text-cyan-400' },
    { id: AppRoute.ANALYTICS, label: t.growth, icon: 'fa-brain-circuit', color: 'text-fuchsia-400' },
    { id: AppRoute.COMMUNICATIONS, label: t.communications, icon: 'fa-headset', color: 'text-emerald-400' },
    { id: AppRoute.PUBLISHER, label: t.publisher, icon: 'fa-paper-plane', color: 'text-violet-400' },
    
    // Social Platforms
    { id: AppRoute.PLATFORM_META, label: 'Meta (FB & IG)', icon: 'fa-brands fa-meta', color: 'text-[#0668E1]' }, 
    { id: AppRoute.PLATFORM_TIKTOK, label: 'TikTok', icon: 'fa-brands fa-tiktok', color: 'text-[#000000] dark:text-[#ff0050]' }, 
    { id: AppRoute.PLATFORM_TWITTER, label: 'X (Twitter)', icon: 'fa-brands fa-x-twitter', color: 'text-slate-900 dark:text-white' }, 
    { id: AppRoute.PLATFORM_LINKEDIN, label: 'LinkedIn', icon: 'fa-brands fa-linkedin', color: 'text-[#0A66C2]' }, 
    { id: AppRoute.PLATFORM_YOUTUBE, label: 'YouTube', icon: 'fa-brands fa-youtube', color: 'text-[#FF0000]' }, 

    { id: AppRoute.LEARN_EARN, label: t.academy, icon: 'fa-graduation-cap', color: 'text-amber-400' },
    { id: AppRoute.INTEGRATIONS, label: t.apps, icon: 'fa-network-wired', color: 'text-pink-400' },
    { id: AppRoute.ENTERTAINMENT, label: t.entertainment, icon: 'fa-tv', color: 'text-rose-400' },
    { id: AppRoute.SMM_PANEL, label: t.smm, icon: 'fa-users-viewfinder', color: 'text-red-400' },
    { id: AppRoute.RDP_SERVICES, label: t.vps, icon: 'fa-server', color: 'text-orange-400' },
    { id: AppRoute.OTP_SERVICES, label: t.otp, icon: 'fa-comment-sms', color: 'text-cyan-400' },
    { id: AppRoute.ADD_FUND, label: t.funds, icon: 'fa-wallet', color: 'text-teal-400' },
    { id: AppRoute.SETTINGS, label: t.settings, icon: 'fa-user-gear', color: 'text-slate-400' },
  ];

  const adminMenuItems = [
    { id: AppRoute.ADMIN_CONTROL, label: t.admin, icon: 'fa-user-shield', color: 'text-slate-400' },
    { id: AppRoute.ADMIN_API, label: t.api, icon: 'fa-plug', color: 'text-gray-400' },
    { id: AppRoute.DEPLOYMENT, label: t.deploy, icon: 'fa-rocket', color: 'text-zinc-400' },
  ];

  const getButtonStyle = (active: boolean) => {
    const base = `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all duration-200 group relative overflow-hidden ${isCollapsed ? 'justify-center' : ''}`;
    
    if (active) {
      return `${base} bg-indigo-600/20 text-white border-l-4 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]`;
    }
    return `${base} text-slate-400 hover:text-white hover:bg-slate-800/50 border-l-4 border-transparent`;
  };

  const toggleSidebar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${isCollapsed ? 'w-24' : 'w-72'} h-screen flex flex-col border-r border-white/5 bg-slate-900/60 backdrop-blur-2xl font-sans relative z-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] shadow-2xl`}>
      
      {/* Floating Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg hover:bg-indigo-500 transition-all z-50 border-2 border-slate-900 group"
      >
        <i className={`fa-solid fa-chevron-${isCollapsed ? 'right' : 'left'} group-hover:scale-110 transition-transform`}></i>
      </button>

      {/* Brand Header */}
      <div className={`p-6 border-b border-white/5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-3'} transition-all duration-300 relative overflow-hidden`} onClick={() => setRoute(AppRoute.DASHBOARD)}>
        <div className="cursor-pointer hover:scale-105 transition-transform duration-300">
             <Logo showText={!isCollapsed} className={isCollapsed ? "w-10 h-10" : "w-10 h-10"} />
        </div>
      </div>
      
      <nav className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-1 relative">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-b from-indigo-500/0 via-indigo-500/5 to-indigo-500/0"></div>

        {!isCollapsed && <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 py-2 mb-1 mt-2 animate-in fade-in slide-in-from-left-2 duration-500">Main Deck</p>}
        {isCollapsed && <div className="h-4"></div>}
        
        {userMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setRoute(item.id)}
            className={getButtonStyle(currentRoute === item.id)}
            title={isCollapsed ? item.label : ''}
          >
            <i className={`fa-solid ${item.icon} ${isCollapsed ? 'text-xl' : 'w-5 text-center text-sm'} ${currentRoute === item.id ? 'text-indigo-400 scale-110' : item.color} group-hover:scale-110 transition-transform duration-300`}></i>
            {!isCollapsed && (
              <div className="flex flex-1 justify-between items-center opacity-0 animate-in fade-in slide-in-from-left-1 duration-300 fill-mode-forwards" style={{animationDelay: '100ms', opacity: 1}}>
                <span className="font-bold tracking-wide whitespace-nowrap">{item.label}</span>
                {[AppRoute.PLATFORM_META, AppRoute.PLATFORM_TIKTOK, AppRoute.PLATFORM_TWITTER, AppRoute.PLATFORM_LINKEDIN, AppRoute.PLATFORM_YOUTUBE].includes(item.id) && (
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                )}
              </div>
            )}
            {currentRoute === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none"></div>
            )}
          </button>
        ))}

        {isAdmin && (
          <>
            <div className="h-px bg-white/5 my-4 mx-3"></div>
            {!isCollapsed && <p className="text-[9px] font-black text-rose-500/80 uppercase tracking-[0.2em] px-3 py-2 mb-1">System Root</p>}
            {adminMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setRoute(item.id)}
                className={getButtonStyle(currentRoute === item.id)}
                title={isCollapsed ? item.label : ''}
              >
                <i className={`fa-solid ${item.icon} ${isCollapsed ? 'text-xl' : 'w-5 text-center text-sm'} ${item.color}`}></i>
                {!isCollapsed && <span className="font-bold tracking-wide">{item.label}</span>}
              </button>
            ))}
          </>
        )}
        
        <div className="h-20"></div>
      </nav>

      <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className={`flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-2xl shadow-inner group hover:bg-white/10 transition-colors cursor-pointer ${isCollapsed ? 'justify-center p-2' : ''}`} onClick={() => setRoute(AppRoute.SETTINGS)}>
           <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center text-sm text-white border-2 border-white/10 shadow-md group-hover:scale-105 transition-transform flex-shrink-0 relative">
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user"></i>}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
           </div>
           {!isCollapsed && (
               <div className="overflow-hidden flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate group-hover:text-white transition-colors">{user.name}</p>
                  <p className="text-sm font-black text-white">${user.balance.toFixed(2)}</p>
               </div>
           )}
           {!isCollapsed && (
               <button 
                 onClick={(e) => { e.stopPropagation(); setRoute(AppRoute.ADD_FUND); }} 
                 className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-[10px] hover:bg-emerald-400 hover:scale-110 transition-all text-black shadow-lg shadow-emerald-500/30"
               >
                  <i className="fa-solid fa-plus"></i>
               </button>
           )}
        </div>

        <button 
          onClick={onLogout}
          className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 group`}
          title="Logout"
        >
          <i className="fa-solid fa-power-off group-hover:scale-110 transition-transform"></i>
          {!isCollapsed && <span>Terminate Session</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
