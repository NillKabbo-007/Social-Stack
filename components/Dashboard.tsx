
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SummaryCard from './SummaryCard';
import { ROI_DATA, PLATFORMS, GLOBAL_CURRENCIES } from '../constants';
import { executeStrategicCommand, getXFeed } from '../services/geminiService';

const Dashboard: React.FC<{ currency?: string }> = ({ currency = 'USD' }) => {
  const [commandInput, setCommandInput] = useState('');
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);
  const [commandResult, setCommandResult] = useState<any>(null);
  const [commandSources, setCommandSources] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [xFeed, setXFeed] = useState<any[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  const currData = GLOBAL_CURRENCIES[currency] || GLOBAL_CURRENCIES['USD'];
  const formatPrice = (amount: number) => `${currData.symbol}${(amount * currData.rate).toLocaleString()}`;

  useEffect(() => {
    const newData = Array.from({ length: 14 }, (_, i) => ({
        date: i + 1,
        revenue: Math.floor(Math.random() * 3000) + 2000,
        spend: Math.floor(Math.random() * 1500) + 800,
    }));
    setChartData(newData);
    
    const fetchFeed = async () => {
        const feed = await getXFeed('Digital Marketing Trends');
        setXFeed(feed);
        setLoadingFeed(false);
    };
    fetchFeed();
  }, []);

  const handleCommand = async () => {
    if (!commandInput.trim()) return;
    setIsExecutingCommand(true);
    setCommandResult(null);
    setCommandSources([]);
    const { results, sources } = await executeStrategicCommand(commandInput, { ROI_DATA, PLATFORMS });
    setCommandResult(results);
    setCommandSources(sources);
    setIsExecutingCommand(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* COMMAND NODE */}
      <div className="relative overflow-hidden glass-panel rounded-[2.5rem] border-indigo-500/20">
          <div className="bg-indigo-600/5 backdrop-blur-xl p-6 md:p-8 flex flex-col gap-6">
             <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-600/20">
                        <i className="fa-solid fa-bolt-lightning"></i>
                    </div>
                    <div>
                        <h2 className="text-lg font-display font-black text-white leading-tight uppercase tracking-tight">Strategy Node</h2>
                        <p className="text-[10px] text-slate-500 font-tech uppercase tracking-widest">v3.5 Build</p>
                    </div>
                </div>
                
                <div className="flex-1 w-full">
                    <div className="relative group">
                        <input 
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            placeholder="Initialize strategic request (e.g. Optimize my TikTok spend)..."
                            className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-6 pr-16 py-4 text-xs text-white focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder-slate-600 shadow-inner"
                            onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                        />
                        <button 
                            onClick={handleCommand}
                            disabled={isExecutingCommand || !commandInput.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 shadow-lg"
                        >
                            {isExecutingCommand ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane text-xs"></i>}
                        </button>
                    </div>
                </div>
             </div>

             {commandResult && (
                <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem]">
                        <p className="text-[10px] font-black text-emerald-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                           <i className="fa-solid fa-brain-circuit"></i> AI Strategic Verdict
                        </p>
                        <p className="text-sm text-white font-bold leading-relaxed">{commandResult.suggestedAction}</p>
                    </div>
                    
                    {commandSources.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {commandSources.map((src, i) => (
                                <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-slate-800/80 border border-slate-700/50 rounded-lg text-[9px] font-bold text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2">
                                    <i className="fa-solid fa-link"></i> {src.title}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
             )}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard label="Network Spend" value={formatPrice(4820)} trend={12} icon="fa-solid fa-chart-line" color="#6366f1" />
                <SummaryCard label="Aggregated ROI" value="4.2x" trend={8.4} icon="fa-solid fa-bolt" color="#10b981" />
                <div className="glass-panel p-6 rounded-[2rem] flex flex-col justify-between border-rose-500/30 bg-rose-950/10 group cursor-pointer hover:bg-rose-900/20 transition-all h-40">
                    <div className="flex justify-between items-start">
                        <span className="text-slate-500 text-[9px] font-tech font-black uppercase tracking-widest">Active Ops</span>
                        <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg">
                            <i className="fa-solid fa-satellite-dish"></i>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-display font-black text-white leading-none">Live Studio</h4>
                        <p className="text-[8px] text-rose-400 font-tech font-bold uppercase tracking-widest mt-1">Connect Node</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-[2.5rem] border-slate-700/50 relative">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-display font-black text-white uppercase tracking-tighter">Growth Velocity</h3>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-2 text-[10px] font-tech font-bold text-slate-500 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></span> Real-time Sync
                        </span>
                    </div>
                </div>
                <div className="h-64 w-full min-h-[256px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" hide />
                            <Tooltip contentStyle={{backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '10px'}} />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorMain)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-[2.5rem] border-slate-700/50 flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-900/40 flex justify-between items-center">
                    <h3 className="text-xs font-tech font-black text-white uppercase tracking-widest">Intel Feed</h3>
                    <i className="fa-brands fa-x-twitter text-slate-600"></i>
                </div>
                <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                    {loadingFeed ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-600 space-y-4">
                            <i className="fa-solid fa-satellite fa-spin text-2xl"></i>
                            <p className="text-[10px] font-tech font-black uppercase tracking-widest">Scanning...</p>
                        </div>
                    ) : (
                        xFeed.map((post, i) => (
                            <div key={i} className="space-y-3 animate-in slide-in-from-bottom-2 duration-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                                        {post.author?.[0] || 'X'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-white leading-none">{post.author}</p>
                                        <p className="text-[8px] text-slate-500 uppercase mt-0.5">{post.time}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">"{post.content}"</p>
                                <div className="flex gap-4 text-[9px] font-tech text-slate-600 uppercase">
                                    <span className="flex items-center gap-1"><i className="fa-solid fa-heart text-rose-500/50"></i> {post.metrics.likes}</span>
                                    <span className="flex items-center gap-1"><i className="fa-solid fa-eye text-indigo-500/50"></i> {post.metrics.views}</span>
                                </div>
                                {i < xFeed.length - 1 && <div className="h-px bg-slate-800/50 w-full mt-4"></div>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
