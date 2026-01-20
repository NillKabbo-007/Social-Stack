
import React from 'react';
import Logo from './Logo';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30 relative overflow-x-hidden">
      {/* Premium Wallpaper Background Layer */}
      <div className="fixed inset-0 z-0">
        {/* Base Image with high-fidelity abstract tech feel */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2560&auto=format&fit=crop")',
            filter: 'brightness(0.15) contrast(1.2)'
          }}
        ></div>
        
        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-600/10 blur-[160px] rounded-full opacity-60"></div>
        
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative z-10">
        {/* Dynamic Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-xl bg-black/20 border-b border-white/5">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Logo />
              <div className="flex items-center gap-8">
                  <div className="hidden lg:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                      <a href="#" className="hover:text-white transition-colors">Infrastructure</a>
                      <a href="#" className="hover:text-white transition-colors">AI Engine</a>
                      <a href="#" className="hover:text-white transition-colors">Pricing</a>
                  </div>
                  <button onClick={onEnter} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-display font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 btn-3d">
                      Enter Terminal
                  </button>
              </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-52 pb-24 px-8">
          <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">v3.5 Network Initialized</span>
              </div>
              
              <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter leading-[0.85] mb-10 drop-shadow-2xl">
                  The Stack That <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Scales You.</span>
              </h1>
              
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-14 font-medium leading-relaxed drop-shadow-lg">
                  Connect your social nodes, automate high-intent outreach, and analyze ROI with proprietary Gemini 3 intelligence.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button onClick={onEnter} className="w-full sm:w-auto px-14 py-6 bg-white text-black rounded-[2rem] font-display font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95">
                      Launch Command Core
                  </button>
                  <button className="w-full sm:w-auto px-14 py-6 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[2rem] font-display font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                      <i className="fa-brands fa-github text-lg"></i>
                      View Docs
                  </button>
              </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 glass-panel p-12 rounded-[3.5rem] relative overflow-hidden flex flex-col justify-between group min-h-[400px]">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 group-hover:opacity-[0.08] transition-all duration-700">
                      <i className="fa-solid fa-chart-line text-[12rem]"></i>
                  </div>
                  <div className="relative z-10">
                      <h3 className="text-4xl font-display font-black uppercase tracking-tight mb-6">Deep Insight Engine</h3>
                      <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">Real-time radar charts across Meta, TikTok, and Google. Stop guessing your ROI and start stacking your data.</p>
                  </div>
                  <div className="mt-12 flex gap-4 relative z-10">
                      <div className="px-6 py-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 font-black text-[10px] uppercase tracking-widest">Analytics v2.0</div>
                      <div className="px-6 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest">Live Sync</div>
                  </div>
              </div>
              
              <div className="md:col-span-4 glass-panel p-12 rounded-[3.5rem] flex flex-col justify-center items-center text-center space-y-8 group hover:border-indigo-500/30 transition-all">
                  <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(79,70,229,0.4)] group-hover:rotate-12 transition-transform duration-500">
                      <i className="fa-solid fa-wand-magic-sparkles text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-2">AI Advisor</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">Actionable strategy nodes generated by Gemini 3 Pro reasoning.</p>
                  </div>
              </div>

              <div className="md:col-span-4 glass-panel p-12 rounded-[3.5rem] flex flex-col justify-between group hover:bg-slate-900/40 transition-all min-h-[300px]">
                  <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl text-indigo-500 shadow-inner group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div>
                      <h4 className="text-2xl font-display font-black uppercase mb-2">Vault Security</h4>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">AES-256 Protocol Encrypted</p>
                  </div>
              </div>

              <div className="md:col-span-8 glass-panel p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between group overflow-hidden min-h-[300px]">
                  <div className="space-y-6 flex-1">
                      <h3 className="text-4xl font-display font-black uppercase tracking-tight">Infrastructure Hub</h3>
                      <p className="text-slate-400 text-base max-w-sm font-medium leading-relaxed">Premium VPS and Proxy nodes with worldwide locations at your fingertips.</p>
                  </div>
                  <div className="flex gap-6 relative mt-8 md:mt-0">
                      <div className="w-20 h-20 bg-slate-900/80 border border-white/10 rounded-3xl flex items-center justify-center text-3xl text-white group-hover:translate-y-[-10px] transition-transform duration-500 shadow-2xl"><i className="fa-brands fa-aws"></i></div>
                      <div className="w-20 h-20 bg-slate-900/80 border border-white/10 rounded-3xl flex items-center justify-center text-3xl text-indigo-400 group-hover:translate-y-[10px] transition-transform duration-500 shadow-2xl"><i className="fa-brands fa-google"></i></div>
                  </div>
              </div>
          </div>
        </section>

        {/* Footer Branding */}
        <footer className="border-t border-white/5 py-16 px-8 bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
              <Logo showText={true} />
              <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Compliance</a>
                  <a href="#" className="hover:text-white transition-colors">Security</a>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">© 2026 Social Stack Global Core</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
