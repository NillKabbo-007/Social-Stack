
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
import AdminControl from './components/AdminControl';
import AdminAPIConnect from './components/AdminAPIConnect';
import Settings from './components/Settings';
import EntertainmentHub from './components/EntertainmentHub';
import DeploymentHub from './components/DeploymentHub';
import IntegrationsHub from './components/IntegrationsHub';
import TwitterDashboard from './components/TwitterDashboard';
import LinkedInDashboard from './components/LinkedInDashboard';
import YouTubeDashboard from './components/YouTubeDashboard';
import CommunicationHub from './components/CommunicationHub';
import LearnAndEarn from './components/LearnAndEarn';
import NewsHub from './components/NewsHub';
import AIAdvisor from './components/AIAdvisor';
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
  const [showGrowthModal, setShowGrowthModal] = useState(false);
  
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
      if (view !== 'logout') setView('landing');
    }
    
    const savedTheme = localStorage.getItem('socialstack_theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');
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

  const toggleTheme = () => setDarkMode(prev => !prev);

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

  const handleUpdateLibrary = (item: MediaItem) => setMediaLibrary(prev => [item, ...prev]);
  const handleDeleteMedia = (id: string) => setMediaLibrary(prev => prev.filter(m => m.id !== id));

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (view === 'landing') return <LandingPage onEnter={() => setView('auth')} />;
  if (view === 'auth') return <Auth onLogin={handleLogin} onBack={() => setView('landing')} />;

  if (view === 'logout') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <div className="glass-panel p-10 rounded-[3rem] text-center max-w-lg w-full animate-in zoom-in-95 duration-500">
                  <Logo className="w-20 h-20 mx-auto mb-6" showText={false} />
                  <h2 className="text-3xl font-black text-white uppercase mb-8">Session Terminated</h2>
                  <button onClick={() => setView('auth')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase btn-3d mb-6">Re-Initialize System</button>
              </div>
          </div>
      );
  }

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.DASHBOARD: return <Dashboard currency={user?.currency} />;
      case AppRoute.NEWS: return <NewsHub />;
      case AppRoute.PUBLISHER: 
        return <BulkPublisher mediaLibrary={mediaLibrary} onUpdateLibrary={handleUpdateLibrary} onDeleteMedia={handleDeleteMedia} />;
      case AppRoute.BILLING: return <Billing externalItem={pendingPurchase} onClearItem={() => setPendingPurchase(null)} currency={user?.currency} />;
      case AppRoute.SMM_PANEL: return <SMMPanel onBuy={handleQuickBuy} currency={user?.currency} />;
      case AppRoute.RDP_SERVICES: return <RDPServices onBuy={handleQuickBuy} />;
      case AppRoute.OTP_SERVICES: return <OTPServices onBuy={handleQuickBuy} />;
      case AppRoute.ADD_FUND: return <AddFund currency={user?.currency} />;
      case AppRoute.ADMIN_CONTROL: return <AdminControl />;
      case AppRoute.ADMIN_API: return <AdminAPIConnect />;
      case AppRoute.SETTINGS: return (
        <Settings 
            user={user!} onUpdateUser={handleUpdateUser} 
            mediaLibrary={mediaLibrary} onUpdateLibrary={handleUpdateLibrary} onDeleteMedia={handleDeleteMedia}
            initialTab="profile"
        />
      );
      case AppRoute.ENTERTAINMENT: return <EntertainmentHub />;
      case AppRoute.DEPLOYMENT: return <DeploymentHub />;
      case AppRoute.INTEGRATIONS: return <IntegrationsHub />;
      case AppRoute.PLATFORM_TWITTER: return <TwitterDashboard />;
      case AppRoute.PLATFORM_LINKEDIN: return <LinkedInDashboard />;
      case AppRoute.PLATFORM_YOUTUBE: return <YouTubeDashboard />;
      case AppRoute.COMMUNICATIONS: return <CommunicationHub />;
      case AppRoute.LEARN_EARN: return <LearnAndEarn />;
      default: return <Dashboard currency={user?.currency} />;
    }
  };

  const t = TRANSLATIONS[user?.language || 'en-US'] || TRANSLATIONS['en-US'];
  const currentLang = GLOBAL_LANGUAGES.find(l => l.code === user?.language);

  return (
    <div className="flex h-screen overflow-hidden bg-transparent text-slate-100 font-sans">
      <Sidebar currentRoute={currentRoute} setRoute={setCurrentRoute} onLogout={handleLogout} user={user!} onOpenGrowth={() => setShowGrowthModal(true)} />
      
      <main className="flex-1 overflow-y-auto relative no-scrollbar">
        <header className="sticky top-0 z-20 glass-panel border-b border-white/5 px-8 py-4 flex items-center justify-between backdrop-blur-xl bg-slate-900/20">
          <div className="relative group">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input type="text" placeholder={t.search} className="bg-slate-900/50 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm w-64 md:w-96 text-white" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 mr-4 bg-slate-800/40 p-1 rounded-2xl border border-white/5 shadow-inner">
                <button onClick={() => setCurrentRoute(AppRoute.COMMUNICATIONS)} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all relative">
                    <i className="fa-solid fa-envelope"></i>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
                </button>
                <button onClick={() => setCurrentRoute(AppRoute.COMMUNICATIONS)} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                    <i className="fa-solid fa-phone"></i>
                </button>
            </div>
            
            <button onClick={() => setCurrentRoute(AppRoute.SETTINGS)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800/50 border border-white/5 text-slate-400 hover:text-white">
                {currentLang ? <span className="text-lg">{currentLang.flag}</span> : <i className="fa-solid fa-globe"></i>}
            </button>
            
            <button onClick={toggleTheme} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800/50 border border-white/5 text-slate-400 hover:text-white">
              <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            <button onClick={() => setCurrentRoute(AppRoute.SETTINGS)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800/50 border border-white/5 text-slate-400 hover:text-white overflow-hidden">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user-gear"></i>}
            </button>
          </div>
        </header>

        <div className="p-8 min-h-[calc(100vh-73px)]">
          {renderContent()}
          <Footer />
        </div>
      </main>

      {/* Growth Modal */}
      {showGrowthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-[#0f172a] border border-slate-700 w-full max-w-6xl rounded-[3rem] h-[90vh] overflow-y-auto no-scrollbar shadow-4xl relative p-10">
                  <button onClick={() => setShowGrowthModal(false)} className="fixed top-12 right-12 z-[110] w-12 h-12 bg-white/10 hover:bg-rose-600 rounded-full flex items-center justify-center text-white transition-all">
                      <i className="fa-solid fa-xmark text-xl"></i>
                  </button>
                  <AIAdvisor />
              </div>
          </div>
      )}

      <ChatBot />
    </div>
  );
};

export default App;
