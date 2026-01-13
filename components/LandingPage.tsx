
import React from 'react';
import Logo from './Logo';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30">
      {/* Dynamic Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-md bg-black/10 border-b border-white/5">
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
      <section className="relative pt-40 pb-20 px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">v3.4 Production Ready</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] mb-8">
                The Stack That <br />
                <span className="text-indigo-400">Scales You.</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                Connect your social nodes, automate high-intent outreach, and analyze ROI with proprietary Gemini 3 intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={onEnter} className="w-full sm:w-auto px-12 py-5 bg-white text-black rounded-[2rem] font-display font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                    Deploy Your App
                </button>
                <button className="w-full sm:w-auto px-12 py-5 bg-slate-900 border border-slate-800 rounded-[2rem] font-display font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                    <i className="fa-brands fa-github text-lg"></i>
                    Documentation
                </button>
            </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-8 glass-panel p-10 rounded-[3rem] bento-card relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-chart-line text-9xl"></i>
                </div>
                <div>
                    <h3 className="text-3xl font-display font-black uppercase tracking-tight mb-4">Deep Insight Engine</h3>
                    <p className="text-slate-400 max-w-md">Real-time radar charts across Meta, TikTok, and Google. Stop guessing your ROI and start stacking your data.</p>
                </div>
                <div className="mt-12 flex gap-4">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 font-black text-xs uppercase tracking-widest">Analytics v2.0</div>
                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-widest">Live Sync</div>
                </div>
            </div>
            
            <div className="md:col-span-4 glass-panel p-10 rounded-[3rem] bento-card flex flex-col justify-center items-center text-center space-y-6">
                <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl shadow-2xl shadow-indigo-600/40">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <h3 className="text-2xl font-display font-black uppercase tracking-tight">AI Advisor</h3>
                <p className="text-slate-400 text-sm">Actionable strategy nodes generated by Gemini 3 Pro.</p>
            </div>

            <div className="md:col-span-4 glass-panel p-10 rounded-[3rem] bento-card flex flex-col justify-between">
                <i className="fa-solid fa-shield-halved text-4xl text-indigo-500"></i>
                <div>
                    <h4 className="text-xl font-display font-black uppercase mb-2">Vault Security</h4>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">AES-256 Protocol</p>
                </div>
            </div>

            <div className="md:col-span-8 glass-panel p-10 rounded-[3rem] bento-card flex items-center justify-between group overflow-hidden">
                <div className="space-y-4">
                    <h3 className="text-3xl font-display font-black uppercase tracking-tight">Infrastructure Hub</h3>
                    <p className="text-slate-400 max-w-sm">Premium VPS and Proxy nodes with worldwide locations at your fingertips.</p>
                </div>
                <div className="flex gap-4 relative">
                    <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center text-2xl text-white group-hover:rotate-12 transition-transform"><i className="fa-brands fa-aws"></i></div>
                    <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center text-2xl text-indigo-400 group-hover:-rotate-12 transition-transform shadow-2xl"><i className="fa-brands fa-google"></i></div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="border-t border-white/5 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <Logo showText={true} />
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Compliance</a>
                <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">© 2026 Social Stack Global Core</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
