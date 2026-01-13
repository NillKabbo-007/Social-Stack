
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
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({ 
          email, 
          name: isLogin ? email.split('@')[0] : fullName, 
          language: selectedLang 
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617] relative overflow-hidden">
      {/* Sci-Tech Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-lg w-full relative z-10">
        <div className="glass-panel p-10 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="text-center mb-10">
                <Logo className="w-16 h-16 mx-auto mb-6" showText={false} />
                <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
                    {isLogin ? 'Initialize Core' : 'Deploy Identity'}
                </h2>
                <p className="text-[10px] text-slate-500 font-tech font-bold uppercase tracking-[0.3em] mt-2">Omni-Channel Terminal v3.4.0</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <div className="space-y-1">
                        <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest ml-1">Operator Name</label>
                        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 shadow-inner font-medium" placeholder="Node Operator 01" />
                    </div>
                )}
                
                <div className="space-y-1">
                    <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest ml-1">Identity Key (Email)</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 shadow-inner font-medium" placeholder="node@socialstack.io" />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest ml-1">Auth Sequence (Password)</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 shadow-inner font-medium" placeholder="••••••••" />
                </div>

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div onClick={() => setRememberMe(!rememberMe)} className={`w-10 h-5 rounded-full relative transition-colors ${rememberMe ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${rememberMe ? 'translate-x-5' : ''}`}></div>
                        </div>
                        <span className="text-[10px] font-tech text-slate-600 uppercase tracking-widest group-hover:text-slate-400">Persistent Sync</span>
                    </label>
                    <button type="button" className="text-[10px] font-tech text-indigo-400/80 uppercase tracking-widest hover:text-indigo-400 transition-colors">Emergency Reset</button>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-display font-black text-[12px] uppercase tracking-[0.2em] shadow-xl transition-all btn-3d"
                >
                    {loading ? <i className="fa-solid fa-sync fa-spin"></i> : isLogin ? 'Authenticate Terminal' : 'Launch New Node'}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-tech text-slate-600 uppercase tracking-widest hover:text-white transition-colors">
                    {isLogin ? "Generate New Node? Sign Up" : "Existing Identity? Login Direct"}
                </button>
            </div>
        </div>
        
        {onBack && (
            <button onClick={onBack} className="mt-8 w-full text-[10px] font-tech text-slate-700 uppercase tracking-widest hover:text-slate-400 flex items-center justify-center gap-2 transition-all">
                <i className="fa-solid fa-arrow-left"></i> Hub Protocol
            </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
