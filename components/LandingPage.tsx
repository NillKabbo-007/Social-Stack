
import React from 'react';
import Logo from './Logo';

interface LandingPageProps {
  onEnter: () => void;
}

const REVIEWS = [
    { id: 1, name: 'Sarah J.', role: 'CMO @ TechFlow', text: "The ROI analytics are scary accurate. It predicted our Q4 slump and saved us $50k in ad spend.", avatar: 'https://ui-avatars.com/api/?name=Sarah+J&background=6366f1&color=fff' },
    { id: 2, name: 'Mike Ross', role: 'Agency Owner', text: "Managing 50+ client accounts used to take a village. Now it takes me and Social Stack.", avatar: 'https://ui-avatars.com/api/?name=Mike+R&background=10b981&color=fff' },
    { id: 3, name: 'Elena V.', role: 'Influencer', text: "The 4D content visualization helps me plan my feed aesthetic like nothing else. Game changer.", avatar: 'https://ui-avatars.com/api/?name=Elena+V&background=f43f5e&color=fff' }
];

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-200 selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Logo />
        <div className="flex gap-4">
            <button 
                onClick={onEnter}
                className="hidden md:block px-6 py-2.5 hover:text-indigo-400 font-bold text-xs uppercase tracking-widest transition-all text-slate-300"
            >
                Login
            </button>
            <button 
                onClick={onEnter}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all text-white shadow-lg shadow-indigo-600/30 btn-3d"
            >
                Register Free
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 max-w-5xl mx-auto pt-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:scale-105 transition-transform cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            v2.4.0 Live System
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9] drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            The Operating System <br />
            <span className="cinematic-shine">For Digital Growth</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Unify your social graph. Automate your outreach. <br className="hidden md:block" />
            Analyze ROI with military-grade precision across every node.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <button 
                onClick={onEnter}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95 btn-3d flex items-center justify-center gap-3"
            >
                <i className="fa-solid fa-rocket"></i>
                Initialize Console
            </button>
            <button className="px-10 py-5 bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 btn-3d flex items-center justify-center gap-3">
                <i className="fa-brands fa-github"></i>
                View Source
            </button>
        </div>

        {/* Stats / Social Proof */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/5 pt-12 w-full animate-in fade-in duration-1000 delay-500">
            {[
                { label: 'Active Nodes', val: '15k+' },
                { label: 'Ad Spend Managed', val: '$42M' },
                { label: 'API Requests', val: '1.2B' },
                { label: 'Uptime', val: '99.9%' }
            ].map((stat, i) => (
                <div key={i}>
                    <p className="text-2xl md:text-3xl font-black text-white">{stat.val}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </div>
            ))}
        </div>
      </main>

      {/* Feature Grid Preview */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { title: 'Multi-Channel Sync', icon: 'fa-share-nodes', desc: 'Control Meta, TikTok, and X from a single glass pane.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { title: 'Gemini Neural Core', icon: 'fa-brain-circuit', desc: 'AI that predicts viral trends before they happen.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { title: 'Secure Infrastructure', icon: 'fa-shield-halved', desc: 'AES-256 encrypted vaults for all your API keys.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
            ].map((feature, i) => (
                <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group icon-4d hover:-translate-y-2">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${feature.color} ${feature.bg} shadow-inner`}>
                        <i className={`fa-solid ${feature.icon}`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                </div>
            ))}
         </div>
      </section>

      {/* Customer Reviews - Wall of Love */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-800">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Wall of <span className="text-rose-500">Love</span></h2>
              <p className="text-slate-400">Trusted by modern growth teams worldwide.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REVIEWS.map(review => (
                  <div key={review.id} className="glass-panel p-6 rounded-2xl border border-slate-700/50 relative">
                      <div className="flex items-center gap-4 mb-4">
                          <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full border border-slate-600" />
                          <div>
                              <h4 className="font-bold text-white text-sm">{review.name}</h4>
                              <p className="text-[10px] text-slate-500 uppercase font-bold">{review.role}</p>
                          </div>
                      </div>
                      <p className="text-sm text-slate-300 italic leading-relaxed">"{review.text}"</p>
                      <div className="flex text-amber-400 gap-1 text-xs mt-4">
                          <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-black/40 backdrop-blur-xl mt-12">
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
              <Logo showText={true} />
              
              <div className="flex gap-6">
                  {['fa-twitter', 'fa-linkedin', 'fa-instagram', 'fa-github', 'fa-discord'].map((icon, i) => (
                      <a key={i} href="#" className="text-slate-400 hover:text-white transition-all hover:scale-125 icon-4d p-2">
                          <i className={`fa-brands ${icon} text-xl`}></i>
                      </a>
                  ))}
              </div>

              <div className="flex gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <a href="/privacy.html" className="hover:text-indigo-400">Privacy</a>
                  <a href="/terms.html" className="hover:text-indigo-400">Terms</a>
                  <a href="/cookies.html" className="hover:text-indigo-400">Cookies</a>
              </div>
          </div>
          <div className="text-center pb-6 opacity-30 text-[9px] font-mono uppercase tracking-widest">
              System Status: Operational • Region: Global-1 • © 2026 Social Stack
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
