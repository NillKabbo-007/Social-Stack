
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ComparisonTool from './components/ComparisonTool';
import BulkPublisher from './components/BulkPublisher';
import ChatBot from './components/ChatBot';
import Billing from './components/Billing';
import Blog from './components/Blog';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import SMMPanel from './components/SMMPanel';
import RDPServices from './components/RDPServices';
import OTPServices from './components/OTPServices';
import AddFund from './components/AddFund';
// Child Panel imported integrated into LearnAndEarn
import AdminControl from './components/AdminControl';
import AdminAPIConnect from './components/AdminAPIConnect';
import Settings from './components/Settings';
import EntertainmentHub from './components/EntertainmentHub';
import DeploymentHub from './components/DeploymentHub';
import IntegrationsHub from './components/IntegrationsHub';
import TwitterDashboard from './components/TwitterDashboard';
import LinkedInDashboard from './components/LinkedInDashboard';
import CommunicationHub from './components/CommunicationHub';
import LearnAndEarn from './components/LearnAndEarn';
import Logo from './components/Logo';
import { AppRoute, User, MediaItem } from './types';
import { GLOBAL_CURRENCIES, GLOBAL_LANGUAGES, TRANSLATIONS } from './constants';

const INITIAL_MEDIA: MediaItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', name: 'tech-stack.jpg', type: 'image', date: '2026-01-10' },
  { id: '2', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400', name: 'marketing-stats.png', type: 'image', date: '2026-01-11' },
  { id: '3', url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=400', name: 'social-icons.jpg', type: 'image', date: '2026-01-11' }
];

type AppView = 'landing' | 'auth' | 'app' | 'logout';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('landing');
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('socialstack_library');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });

  useEffect(() => {
    localStorage.setItem('socialstack_library', JSON.stringify(mediaLibrary));
  }, [mediaLibrary]);

  const [pendingPurchase, setPendingPurchase] = useState<any>(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('omnihub_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('app');
    } else {
      if (view !== 'logout') {
          setView('landing');
      }
    }
    
    const savedTheme = localStorage.getItem('socialstack_theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }

    setIsAppLoading(false);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('socialstack_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('socialstack_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const handleLogin = (userData: any) => {
    const fullUser: User = {
      role: userData.email.includes('admin') ? 'admin' : 'user',
      balance: 245.80,
      currency: 'USD',
      twoFactorEnabled: false,
      language: userData.language || 'en-US',
      ...userData,
    };
    setUser(fullUser);
    localStorage.setItem('omnihub_user', JSON.stringify(fullUser));
    setView('app');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('omnihub_user');
    setCurrentRoute(AppRoute.DASHBOARD);
    setView('logout');
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('omnihub_user', JSON.stringify(updatedUser));
    }
  };

  const handleQuickBuy = (item: any) => {
    setPendingPurchase(item);
    setCurrentRoute(AppRoute.BILLING);
  };

  const handleUpdateLibrary = (item: MediaItem) => {
    setMediaLibrary(prev => [item, ...prev]);
  };

  const handleDeleteMedia = (id: string) => {
    setMediaLibrary(prev => prev.filter(m => m.id !== id));
  };

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
      </div>
    );
  }

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('auth')} />;
  }

  if (view === 'auth') {
    return <Auth onLogin={handleLogin} onBack={() => setView('landing')} />;
  }

  if (view === 'logout') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
              <div className="glass-panel p-10 rounded-[3rem] border border-slate-700/50 shadow-2xl text-center max-w-lg w-full relative z-10 animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex justify-center mb-6 icon-4d">
                      <Logo className="w-20 h-20" showText={false} />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Session Terminated</h2>
                  <p className="text-slate-400 mb-8 font-medium">Your command node has been securely disconnected.</p>
                  
                  <button 
                    onClick={() => setView('auth')}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg btn-3d mb-6"
                  >
                    Re-Initialize System
                  </button>

                  <div className="border-t border-slate-700/50 pt-6">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Stay in the Loop</p>
                      <div className="flex justify-center gap-4">
                          {['fa-twitter', 'fa-linkedin', 'fa-github'].map((icon, i) => (
                              <button key={i} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-white hover:text-black text-slate-400 transition-all icon-4d">
                                  <i className={`fa-brands ${icon}`}></i>
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
              
              <div className="mt-8 max-w-lg w-full glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur animate-in slide-in-from-bottom-8 delay-200">
                  <div className="flex items-center gap-3 mb-3">
                      <img src="https://ui-avatars.com/api/?name=Alex+M&background=f59e0b&color=fff" className="w-10 h-10 rounded-full" />
                      <div>
                          <p className="text-xs font-bold text-white">Alex M.</p>
                          <div className="text-amber-400 text-[10px]"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                      </div>
                  </div>
                  <p className="text-xs text-slate-400 italic">"I never log out because the dashboard is just too beautiful to look at. But when I do, I come right back."</p>
              </div>
              
              <div className="absolute bottom-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  <a href="#" className="hover:text-white mr-4">Privacy</a>
                  <a href="#" className="hover:text-white">Terms</a>
              </div>
          </div>
      );
  }

  if (!user && view === 'app') {
      setView('landing');
      return null;
  }

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.DASHBOARD: return <Dashboard currency={user?.currency} />;
      case AppRoute.ANALYTICS: return <ComparisonTool />;
      case AppRoute.PUBLISHER: 
        return (
          <BulkPublisher 
            mediaLibrary={mediaLibrary} 
            onUpdateLibrary={handleUpdateLibrary}
            onDeleteMedia={handleDeleteMedia}
          />
        );
      case AppRoute.FILES:
        return (
            <Settings 
                user={user!} 
                onUpdateUser={handleUpdateUser} 
                mediaLibrary={mediaLibrary}
                onUpdateLibrary={handleUpdateLibrary}
                onDeleteMedia={handleDeleteMedia}
                initialTab="files"
            />
        );
      case AppRoute.AI_INSIGHTS: return <ComparisonTool />;
      case AppRoute.BILLING: return <Billing externalItem={pendingPurchase} onClearItem={() => setPendingPurchase(null)} currency={user?.currency} />;
      case AppRoute.BLOG: return <Blog />;
      case AppRoute.SMM_PANEL: return <SMMPanel onBuy={handleQuickBuy} currency={user?.currency} />;
      case AppRoute.RDP_SERVICES: return <RDPServices onBuy={handleQuickBuy} />;
      case AppRoute.OTP_SERVICES: return <OTPServices onBuy={handleQuickBuy} />;
      case AppRoute.ADD_FUND: return <AddFund currency={user?.currency} />;
      case AppRoute.CHILD_PANEL: return <LearnAndEarn />;
      case AppRoute.ADMIN_CONTROL: return <AdminControl />;
      case AppRoute.ADMIN_API: return <AdminAPIConnect />;
      case AppRoute.SETTINGS: return (
        <Settings 
            user={user!} 
            onUpdateUser={handleUpdateUser} 
            mediaLibrary={mediaLibrary}
            onUpdateLibrary={handleUpdateLibrary}
            onDeleteMedia={handleDeleteMedia}
            initialTab="profile"
        />
      );
      case AppRoute.ENTERTAINMENT: return <EntertainmentHub />;
      case AppRoute.DEPLOYMENT: return <DeploymentHub />;
      case AppRoute.INTEGRATIONS: return <IntegrationsHub />;
      case AppRoute.PLATFORM_TWITTER: return <TwitterDashboard />;
      case AppRoute.PLATFORM_LINKEDIN: return <LinkedInDashboard />;
      case AppRoute.COMMUNICATIONS: return <CommunicationHub />;
      case AppRoute.LEARN_EARN: return <LearnAndEarn />;
      default:
        return <Dashboard currency={user?.currency} />;
    }
  };

  const userLangCode = user?.language || 'en-US';
  const t = TRANSLATIONS[userLangCode] || TRANSLATIONS['en-US'];
  const currentLang = GLOBAL_LANGUAGES.find(l => l.code === userLangCode);

  return (
    <div className="flex h-screen overflow-hidden animate-in fade-in duration-700 bg-transparent text-slate-100 font-sans selection:bg-indigo-500/30">
      <Sidebar currentRoute={currentRoute} setRoute={setCurrentRoute} onLogout={handleLogout} user={user!} />
      
      <main className="flex-1 overflow-y-auto relative no-scrollbar transition-colors duration-300">
        <header className="sticky top-0 z-20 glass-panel border-b border-white/5 px-8 py-4 flex items-center justify-between backdrop-blur-xl bg-slate-900/20">
          <div className="relative group">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-indigo-400 transition-colors"></i>
            <input 
              type="text" 
              placeholder={t.search} 
              className="bg-slate-900/50 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:bg-slate-900/80 w-64 md:w-96 shadow-inner text-white transition-all placeholder-slate-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right mr-2">
               <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
               <p className="text-[10px] text-indigo-400 leading-none mt-1 uppercase font-bold tracking-tighter">
                {user?.role === 'admin' ? t.masterAdmin : t.growthSpecialist}
               </p>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800/50 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700 transition-all hover:scale-105"
              >
                {currentLang ? <span className="text-lg">{currentLang.flag}</span> : <i className="fa-solid fa-globe"></i>}
              </button>
              {showLanguageMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 glass-panel border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-3 max-h-60 overflow-y-auto no-scrollbar bg-slate-900/90 backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-2">Select Region</p>
                    {GLOBAL_LANGUAGES.map(lang => (
                      <button 
                        key={lang.code}
                        onClick={() => { 
                          setShowLanguageMenu(false); 
                          handleUpdateUser({ language: lang.code });
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl transition-all text-xs font-bold ${user?.language === lang.code ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300'}`}
                      >
                        <span className="text-base">{lang.flag}</span> {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800/50 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700 transition-all hover:scale-105"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800/50 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700 transition-all hover:scale-105 relative">
              <i className="fa-solid fa-bell"></i>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
            </button>
            <button onClick={() => setCurrentRoute(AppRoute.SETTINGS)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800/50 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700 transition-all hover:scale-105">
              <i className="fa-solid fa-user-gear"></i>
            </button>
          </div>
        </header>

        <div className="p-8 min-h-[calc(100vh-73px)] flex flex-col justify-between">
          <div className="flex-1">
            {renderContent()}
          </div>
          <Footer />
        </div>
      </main>

      <ChatBot />

      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-500 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform z-50 border border-emerald-400/50 animate-bounce icon-4d"
        title="Contact Admin on WhatsApp"
        style={{ animationDuration: '3s' }}
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default App;
