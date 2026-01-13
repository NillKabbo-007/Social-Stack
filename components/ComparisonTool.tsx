
import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { COMPARISON_DATA, ROI_DATA } from '../constants';
import AIAdvisor from './AIAdvisor';

const ComparisonTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'advisor'>('analytics');

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Growth & Intelligence</h2>
          <p className="text-slate-400 text-sm">Unified command for performance metrics and AI-driven strategy.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-700">
            <button 
                onClick={() => setActiveTab('analytics')} 
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
                <i className="fa-solid fa-chart-line"></i> Performance
            </button>
            <button 
                onClick={() => setActiveTab('advisor')} 
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'advisor' ? 'bg-fuchsia-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
                <i className="fa-solid fa-brain-circuit"></i> AI Advisor
            </button>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 glass-panel p-8 rounded-3xl h-[550px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <h3 className="text-xl font-bold mb-10 text-center flex items-center justify-center gap-3">
                    <i className="fa-solid fa-diagram-project text-indigo-500"></i> Multi-Network Performance Matrix
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={COMPARISON_DATA}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar name="Meta (FB/IG)" dataKey="Meta" stroke="#1877F2" fill="#1877F2" fillOpacity={0.4} />
                    <Radar name="TikTok" dataKey="TikTok" stroke="#ec4899" fill="#ec4899" fillOpacity={0.4} />
                    <Radar name="Google Ads" dataKey="Google" stroke="#4285F4" fill="#4285F4" fillOpacity={0.4} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
                    </RadarChart>
                </ResponsiveContainer>
                </div>

                <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel p-8 rounded-3xl border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Top Efficiency Node</h4>
                        <div className="px-2 py-1 bg-emerald-500 text-white text-[8px] font-black rounded uppercase">Verified</div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-2xl">
                        <i className="fa-brands fa-whatsapp text-emerald-500"></i>
                        </div>
                        <div>
                        <p className="text-2xl font-black text-white">WhatsApp</p>
                        <p className="text-xs text-emerald-400 font-bold">+600% ROI Efficiency</p>
                        </div>
                    </div>
                    <p className="mt-6 text-xs text-slate-400 leading-relaxed font-medium">
                        High-intent direct messaging through WhatsApp Business API continues to show the lowest cost per conversion across your entire stack.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl border-indigo-500/20">
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Growth Potential</h4>
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-3xl shadow-2xl">
                        <i className="fa-brands fa-tiktok text-white"></i>
                        </div>
                        <div>
                        <p className="text-2xl font-black text-white">TikTok</p>
                        <p className="text-xs text-indigo-400 font-bold">1.4M Potential Reach</p>
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500 uppercase">Velocity</span>
                        <span className="text-white">EXTREME</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[85%] animate-pulse"></div>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-8">ROAS Efficiency Curve</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ROI_DATA}>
                        <defs>
                        <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="platform" stroke="#475569" fontSize={11} axisLine={false} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={11} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="roi" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRoi)" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      ) : (
        <AIAdvisor />
      )}
    </div>
  );
};

export default ComparisonTool;
