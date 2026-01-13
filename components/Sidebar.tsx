
import React, { useState } from 'react';
import { AppRoute, User } from '../types';
import Logo from './Logo';
import { TRANSLATIONS } from '../constants';

interface SidebarProps {
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
  onLogout: () => void;
  user: User;
  onOpenGrowth: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRoute, setRoute, onLogout, user, onOpenGrowth }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAdmin = user.role === 'admin';
  const t = TRANSLATIONS[user.language || 'en-US'] || TRANSLATIONS['en-US'];

  const coreMenuItems = [
    { id: AppRoute.DASHBOARD, label: 'Control Deck', icon: 'fa-solid fa-house', color: 'text-blue-400' },
    { id: AppRoute.NEWS, label: 'Intelligence', icon: 'fa-solid fa-rss', color: 'text-rose-400' },
    { id: AppRoute.ANALYTICS, label: 'ROI Insights', icon: 'fa-solid fa-chart-line', color: 'text-emerald-400' },
    { id: AppRoute.PUBLISHER, label: 'Broadcaster', icon: 'fa-solid fa-paper-plane', color: 'text-indigo-400' },
    { id: AppRoute.INTEGRATIONS, label: 'App Grid', icon: 'fa-solid fa-link', color: 'text-amber-400' },
  ];

  const marketMenuItems = [
    { id: AppRoute.SMM_PANEL, label: 'SMM Store', icon: 'fa-solid fa-cart-shopping', color: 'text-violet-400' },
    { id: AppRoute.RDP_SERVICES, label: 'Cloud Nodes', icon: 'fa-solid fa-server', color: 'text-orange-400' },
    { id: AppRoute.OTP_SERVICES, label: 'OTP Gate', icon: 'fa-solid fa-shield-halved', color: 'text-cyan-400' },
  ];

  const systemMenuItems = [
    { id: AppRoute.ADD_FUND, label: 'Wallet', icon: 'fa-solid fa-wallet', color: 'text-teal-400' },
    { id: AppRoute.SETTINGS, label: 'Terminal', icon: 'fa-solid fa-terminal', color: 'text-slate-400' },
  ];

  const adminMenuItems = [
    { id: AppRoute.ADMIN_CONTROL, label: 'Root Control', icon: 'fa-solid fa-fingerprint', color: 'text-rose-500' },
    { id: AppRoute.DEPLOYMENT, label: 'Build Core', icon: 'fa-solid fa-rocket', color: 'text-indigo-500' },
  ];

  const getButtonStyle = (active: boolean) => {
    const base = `w-full flex items-center gap-4 px-5 py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 relative overflow-hidden group select-none ${isCollapsed ? 'justify-center' : ''}`;
    if (active) return `${base} bg-white/5 text-white shadow-xl border border-white/10`;
    return `${base} text-slate-500 hover:text-white hover:bg-white/5`;
  };

  return (
    <div className={`${isCollapsed ? 'w-24' : 'w-64'} h-screen flex flex-col border-r border-white/5 bg-slate-950/80 backdrop-blur-3xl font-sans relative z-50 transition-all duration-500`}>
      <div className={`p-6 border-b border-white/5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} transition-all`}>
        <div onClick={() => setRoute(AppRoute.DASHBOARD)} className="cursor-pointer active:scale-95 transition-transform">
            <Logo showText={!isCollapsed} className="w-10 h-10" />
        </div>
        {!isCollapsed && (
            <button onClick={() => setIsCollapsed(true)} className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-white transition-colors active:scale-90">
                <i className="fa-solid fa-indent text-lg"></i>
            </button>
        )}
      </div>
      
      <nav className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-1 relative">
        {isCollapsed && (
            <button onClick={() => setIsCollapsed(false)} className="w-full py-6 text-slate-600 hover:text-white transition-colors mb-4 active:scale-90">
                <i className="fa-solid fa-outdent text-xl"></i>
            </button>
        )}

        <button 
          onClick={onOpenGrowth}
          className={`w-full flex items-center gap-3 px-5 py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 hover:scale-[1.03] active:scale-95 mb-6 group ${isCollapsed ? 'justify-center' : ''}`}
        >
          <i className="fa-solid fa-wand-magic-sparkles text-xl group-hover:rotate-12 transition-transform"></i>
          {!isCollapsed && <span>Growth Engine</span>}
        </button>

        {!isCollapsed && <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] px-4 py-4">Operational</p>}
        {coreMenuItems.map((item) => (
          <button key={item.id} onClick={() => setRoute(item.id)} className={getButtonStyle(currentRoute === item.id)}>
            <i className={`${item.icon} text-xl ${currentRoute === item.id ? 'text-white' : item.color}`}></i>
            {!isCollapsed && <span className="font-black">{item.label}</span>}
            {currentRoute === item.id && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-l-full shadow-[0_0_10px_#6366f1]"></div>}
          </button>
        ))}

        <div className="h-6"></div>
        {!isCollapsed && <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] px-4 py-4">Infrastructure</p>}
        {marketMenuItems.map((item) => (
          <button key={item.id} onClick={() => setRoute(item.id)} className={getButtonStyle(currentRoute === item.id)}>
            <i className={`${item.icon} text-xl ${currentRoute === item.id ? 'text-white' : item.color}`}></i>
            {!isCollapsed && <span className="font-black">{item.label}</span>}
          </button>
        ))}

        <div className="h-6"></div>
        {!isCollapsed && <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] px-4 py-4">Identity</p>}
        {systemMenuItems.map((item) => (
          <button key={item.id} onClick={() => setRoute(item.id)} className={getButtonStyle(currentRoute === item.id)}>
            <i className={`${item.icon} text-xl ${currentRoute === item.id ? 'text-white' : item.color}`}></i>
            {!isCollapsed && <span className="font-black">{item.label}</span>}
          </button>
        ))}

        {isAdmin && (
          <>
            <div className="h-px bg-white/5 my-6 mx-3"></div>
            {adminMenuItems.map((item) => (
              <button key={item.id} onClick={() => setRoute(item.id)} className={getButtonStyle(currentRoute === item.id)}>
                <i className={`${item.icon} text-xl ${item.color}`}></i>
                {!isCollapsed && <span className="font-black">{item.label}</span>}
              </button>
            ))}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className={`flex items-center gap-4 p-4 bg-white/5 rounded-3xl group hover:bg-white/10 transition-all cursor-pointer active:scale-[0.98] ${isCollapsed ? 'justify-center p-2' : ''}`} onClick={() => setRoute(AppRoute.SETTINGS)}>
           <div className="w-12 h-12 rounded-2xl overflow-hidden bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-sm text-indigo-400 font-bold flex-shrink-0 relative shadow-inner">
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user-gear"></i>}
           </div>
           {!isCollapsed && (
               <div className="overflow-hidden flex-1">
                  <p className="text-[10px] text-white font-black uppercase tracking-tight truncate">{user.name}</p>
                  <p className="text-[9px] font-black text-emerald-500 tracking-widest">${user.balance.toFixed(2)}</p>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
