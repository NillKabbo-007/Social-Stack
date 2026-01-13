
import React, { useState } from 'react';
import { GLOBAL_LANGUAGES } from '../constants';
import Logo from './Logo';

interface AuthProps {
  onLogin: (userData: any) => void;
  onBack?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [loading, setLoading] = useState(false);
  // Default set to en-US per user request
  const [selectedLang, setSelectedLang] = useState('en-US');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      onLogin({ 
          email, 
          name: isLogin ? email.split('@')[0] : fullName, 
          language: selectedLang 
      });
      setLoading(false);
    }, 1500);
  };

  const handleDirectLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      onLogin({ email: `${provider.toLowerCase()}.user@example.com`, name: `${provider} User`, language: selectedLang });
      setLoading(false);
    }, 1000);
  };

  const currentLangFlag = GLOBAL_LANGUAGES.find(l => l.code === selectedLang)?.flag || '🇺🇸';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience handled by global CSS */}

      <div className="max-w-5xl w-full relative z-10 flex flex-col md:flex-row gap-8 items-stretch perspective-1000">
        
        {onBack && (
            <button 
                onClick={onBack}
                className="absolute -top-16 left-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest glass-panel px-4 py-2 rounded-full"
            >
                <i className="fa-solid fa-arrow-left"></i> Return Home
            </button>
        )}

        {/* LEFT: Auth Card */}
        <div className="flex-1 glass-panel p-1 rounded-[2.5rem] border border-slate-700/50 shadow-2xl transition-transform duration-500">
          <div className="bg-[#0f172a]/95 backdrop-blur-xl rounded-[2.3rem] p-8 md:p-10 border-b-[6px] border-r-[6px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-full flex flex-col">
            
            {/* Header */}
            <div className="text-center mb-6 relative">
              <div className="absolute top-0 right-0">
                <div className="relative group">
                    <button className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-1.5 transition-all">
                        <span className="text-lg">{currentLangFlag}</span>
                        <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50">
                        {GLOBAL_LANGUAGES.filter(l => ['en-US', 'bn-BD', 'hi-IN', 'es-ES'].includes(l.code)).map(lang => (
                            <button 
                                key={lang.code}
                                onClick={() => setSelectedLang(lang.code)}
                                className="w-full text-left px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                            >
                                <span>{lang.flag}</span> {lang.name}
                            </button>
                        ))}
                    </div>
                </div>
              </div>

              <div className="flex justify-center mb-4 icon-4d">
                <Logo className="w-16 h-16" showText={false} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                {isLogin ? 'Welcome Back' : 'Join the Stack'}
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                {isLogin ? 'Access Command Node' : 'Initialize New Workspace'}
              </p>
            </div>

            {/* Auth Form */}
            <div className="space-y-5 flex-1">
              
              {/* Direct Logins */}
              <div className="grid grid-cols-4 gap-3">
                  {[
                      { id: 'Google', icon: 'fa-google', color: 'text-rose-500', bg: 'bg-white hover:bg-slate-200' },
                      { id: 'Apple', icon: 'fa-apple', color: 'text-white', bg: 'bg-black hover:bg-slate-800' },
                      { id: 'Github', icon: 'fa-github', color: 'text-white', bg: 'bg-[#24292e] hover:bg-black' },
                      { id: 'Microsoft', icon: 'fa-microsoft', color: 'text-[#00a4ef]', bg: 'bg-white hover:bg-slate-200' }
                  ].map(p => (
                      <button 
                        key={p.id}
                        onClick={() => handleDirectLogin(p.id)}
                        disabled={loading}
                        className={`h-12 rounded-xl flex items-center justify-center text-xl transition-all shadow-md icon-4d ${p.bg} ${p.color}`}
                        title={`Login with ${p.id}`}
                      >
                          <i className={`fa-brands ${p.icon}`}></i>
                      </button>
                  ))}
              </div>

              <div className="flex items-center gap-4 py-1">
                <div className="flex-1 h-px bg-slate-700/50"></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Or Use Email</span>
                <div className="flex-1 h-px bg-slate-700/50"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Full Name</label>
                            <input 
                                type="text" 
                                required={!isLogin}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Workspace</label>
                            <input 
                                type="text" 
                                value={workspace}
                                onChange={(e) => setWorkspace(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500"
                                placeholder="Agency Inc."
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Email Node</label>
                  <div className="relative group">
                    <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors"></i>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:bg-slate-900 transition-all shadow-inner font-medium placeholder-slate-600"
                      placeholder="admin@socialstack.io"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Secure Key</label>
                  <div className="relative group">
                    <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors"></i>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:bg-slate-900 transition-all shadow-inner font-medium placeholder-slate-600"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 btn-3d border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className={`fa-solid ${isLogin ? 'fa-right-to-bracket' : 'fa-user-plus'}`}></i>}
                  {isLogin ? 'Authenticate' : 'Deploy Account'}
                </button>
              </form>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-slate-800/50">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-slate-400 hover:text-white font-bold uppercase tracking-wide transition-colors"
              >
                {isLogin ? "New here? Create Workspace" : "Already have access? Login"}
              </button>
            </div>
            
            <div className="mt-4 flex justify-center gap-4 text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-indigo-400">Terms</a>
                <span className="text-slate-700">•</span>
                <a href="#" className="hover:text-indigo-400">Privacy</a>
                <span className="text-slate-700">•</span>
                <a href="#" className="hover:text-indigo-400">Cookies</a>
            </div>
          </div>
        </div>

        {/* RIGHT: Info / Testimonial (Desktop) */}
        <div className="hidden md:flex flex-1 flex-col justify-center space-y-6 animate-in slide-in-from-right-8 duration-700">
            <div className="glass-panel p-8 rounded-[2rem] border border-slate-700/30 bg-indigo-900/10 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-1 text-amber-400 mb-4 text-sm">
                        <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                    </div>
                    <p className="text-lg font-medium text-white italic leading-relaxed mb-6">
                        "Social Stack is the operating system for my agency. The ROI analytics helped us scale 3 clients past $1M ARR last quarter alone."
                    </p>
                    <div className="flex items-center gap-4">
                        <img src="https://ui-avatars.com/api/?name=David+K&background=10b981&color=fff" className="w-12 h-12 rounded-full border-2 border-indigo-500/50" />
                        <div>
                            <h4 className="font-bold text-white">David K.</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase">Growth Lead @ ScaleUp</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-700/30 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 text-xl"><i className="fa-solid fa-shield-halved"></i></div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Enterprise Security</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide">SOC2 Compliant • AES-256</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
