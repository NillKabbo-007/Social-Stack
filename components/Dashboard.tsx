
import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import SummaryCard from './SummaryCard';
import { ROI_DATA, PLATFORMS, GLOBAL_CURRENCIES, GLOBAL_LANGUAGES } from '../constants';
import { executeStrategicCommand, getDailyNews, getXFeed, getLinkedInFeed } from '../services/geminiService';

const Dashboard: React.FC<{ currency?: string }> = ({ currency = 'USD' }) => {
  const COLORS = ['#1877F2', '#000000', '#4285F4', '#25D366', '#E1306C', '#FF0000'];
  
  // Live Streaming State
  const [isLive, setIsLive] = useState(false);
  const [streamKey, setStreamKey] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [selectedStreamTargets, setSelectedStreamTargets] = useState<string[]>(['meta', 'tiktok']);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDesc, setStreamDesc] = useState('');
  const [streamThumbnail, setStreamThumbnail] = useState<string | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const currData = GLOBAL_CURRENCIES[currency] || GLOBAL_CURRENCIES['USD'];
  const formatPrice = (amount: number) => {
    return `${currData.symbol}${(amount * currData.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // AI Command Hub State
  const [commandInput, setCommandInput] = useState('');
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);
  const [commandResult, setCommandResult] = useState<any>(null);
  const [commandSources, setCommandSources] = useState<any[]>([]);

  // News & Feed State
  const [activeFeedTab, setActiveFeedTab] = useState<'breaking' | 'x' | 'linkedin' | 'archive'>('x');
  const [news, setNews] = useState<any[]>([]);
  const [newsLocation, setNewsLocation] = useState('Global');
  const [newsLanguage, setNewsLanguage] = useState('English');
  const [xPosts, setXPosts] = useState<any[]>([]);
  const [xTopic, setXTopic] = useState('Marketing Trends');
  const [linkedInPosts, setLinkedInPosts] = useState<any[]>([]);
  const [newsArchive, setNewsArchive] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingX, setLoadingX] = useState(false);
  const [loadingLinkedIn, setLoadingLinkedIn] = useState(false);
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [archiveSearch, setArchiveSearch] = useState('');

  // Chart State
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [chartData, setChartData] = useState<any[]>([]);

  // Mock Data for Spend (kept for logic if needed elsewhere)
  const spend = 245; // USD

  useEffect(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const newData = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: Math.floor(Math.random() * 3000) + 2000 + (i * 50),
            spend: Math.floor(Math.random() * 1500) + 800 + (i * 20),
            roi: 0
        };
    }).map(d => ({...d, roi: parseFloat(((d.revenue - d.spend) / d.spend).toFixed(2))}));
    setChartData(newData);
  }, [timeRange]);

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
    setConnectedApps(apps);
    
    // Initial Load based on default tab
    if (activeFeedTab === 'x') loadXFeed();
    else if (activeFeedTab === 'breaking') loadNews();
  }, []);

  useEffect(() => {
    if (activeFeedTab === 'x') {
        if (xPosts.length === 0) {
            loadXFeed();
        }
    } else if (activeFeedTab === 'linkedin') {
        const apps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
        if (apps.includes('linkedin') && linkedInPosts.length === 0) {
            loadLinkedInFeed();
        }
    } else if (activeFeedTab === 'breaking') {
        if (news.length === 0) {
            loadNews();
        }
    }
  }, [activeFeedTab]);

  useEffect(() => {
      if (activeFeedTab === 'breaking') {
          loadNews();
      }
  }, [newsLocation, newsLanguage]);

  const loadNews = async () => {
    const today = new Date().toLocaleDateString();
    const cacheKey = `socialstack_news_${newsLocation}_${newsLanguage}`;
    const savedArchive = localStorage.getItem('socialstack_news_archive');
    let archive = savedArchive ? JSON.parse(savedArchive) : [];
    
    const sessionNews = sessionStorage.getItem(cacheKey);
    
    if (sessionNews) {
        setNews(JSON.parse(sessionNews));
    } else {
      setLoadingNews(true);
      const latestNews = await getDailyNews(newsLocation, newsLanguage);
      setNews(latestNews);
      sessionStorage.setItem(cacheKey, JSON.stringify(latestNews));
      setLoadingNews(false);
      
      if (latestNews.length > 0) {
        archive = [{ date: `${today} (${newsLocation})`, items: latestNews }, ...archive];
        localStorage.setItem('socialstack_news_archive', JSON.stringify(archive));
      }
    }
    setNewsArchive(archive);
  };

  const loadXFeed = async () => {
    setLoadingX(true);
    const feed = await getXFeed(xTopic);
    setXPosts(feed);
    setLoadingX(false);
  };

  const loadLinkedInFeed = async () => {
    setLoadingLinkedIn(true);
    const feed = await getLinkedInFeed();
    setLinkedInPosts(feed);
    setLoadingLinkedIn(false);
  };

  const handleCommand = async () => {
    if (!commandInput.trim()) return;
    setIsExecutingCommand(true);
    setCommandResult(null);
    const { results, sources } = await executeStrategicCommand(commandInput, { ROI_DATA, PLATFORMS });
    setCommandResult(results);
    setCommandSources(sources);
    setIsExecutingCommand(false);
  };

  const generateLiveStack = () => {
    setIsGeneratingKey(true);
    setTimeout(() => {
      setStreamKey(`ss_key_${Math.random().toString(36).substring(7).toUpperCase()}_${Date.now()}`);
      setIsGeneratingKey(false);
    }, 1500);
  };

  const handleThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          setStreamThumbnail(url);
      }
  };

  const toggleStreamTarget = (target: string) => {
      setSelectedStreamTargets(prev => 
          prev.includes(target) ? prev.filter(t => t !== target) : [...prev, target]
      );
  };

  const handleScreenshot = () => {
    const originalBodyStyle = document.body.style.cssText;
    document.body.style.cursor = 'wait';
    setTimeout(() => {
        document.body.style.cssText = originalBodyStyle;
        alert("Report Screenshot Captured! Saving as social-stack-report.png...");
    }, 1000);
  };

  const handleSocialShare = async () => {
    let shareUrl = window.location.href;
    try {
        const urlObj = new URL(shareUrl);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            shareUrl = 'https://social-stack-marketing.vercel.app/';
        }
    } catch (e) {
        shareUrl = 'https://social-stack-marketing.vercel.app/';
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Social Stack Report',
          text: 'Check out my latest performance metrics on Social Stack!',
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Share URL copied to clipboard!");
      } catch (err) {
        alert("Share URL: " + shareUrl);
      }
    }
  };

  const filteredArchive = newsArchive.filter((entry: any) => 
    entry.date.includes(archiveSearch) || 
    entry.items.some((item: any) => item.headline.toLowerCase().includes(archiveSearch.toLowerCase()))
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl">
          <p className="text-slate-400 text-xs font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <p className="text-xs text-white font-bold">
                {entry.name}: {entry.name === 'ROI' ? `${entry.value}x` : formatPrice(entry.value)}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-sans">Marketing Command Center</h2>
          <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
            Global Node Synchronization: 100%
          </p>
        </div>
        <div className="flex gap-2">
            <button onClick={handleSocialShare} className="px-4 py-2 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-xs uppercase hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 btn-3d">
                <i className="fa-solid fa-share-nodes"></i> Share Report
            </button>
            <button onClick={handleScreenshot} className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase hover:bg-slate-700 transition-all flex items-center gap-2 btn-3d">
                <i className="fa-solid fa-camera"></i> Capture
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Now 8 wide for Live Station) */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* ADVANCED LIVE STATION - EXPANDED */}
            <div className={`glass-panel p-6 rounded-[2.5rem] border-2 transition-all duration-500 shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col ${isLive ? 'border-rose-600/50 bg-rose-950/20' : 'border-indigo-500/20'}`}>
                <div className="flex items-center justify-between mb-4 relative z-20">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all shadow-lg ${isLive ? 'bg-rose-600 text-white animate-pulse' : 'bg-indigo-600 text-white'}`}>
                            <i className={`fa-solid ${isLive ? 'fa-signal-stream' : 'fa-satellite-dish'}`}></i>
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Broadcast Studio</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{isLive ? '🔴 LIVE ON-AIR' : 'Studio Configuration - Ready'}</p>
                        </div>
                    </div>
                    {isLive ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-rose-600 rounded-full text-white font-bold text-xs animate-pulse">
                            <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                        </div>
                    ) : (
                        <button onClick={() => setIsSetupOpen(!isSetupOpen)} className="text-indigo-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide border border-indigo-500/30 px-3 py-1 rounded-lg">
                            <i className="fa-solid fa-sliders mr-2"></i> Config
                        </button>
                    )}
                </div>

                {/* Main Preview / Stream Area */}
                <div className="flex-1 bg-black rounded-3xl relative overflow-hidden border border-slate-800 flex items-center justify-center group/preview">
                    {streamThumbnail ? (
                        <img src={streamThumbnail} className="w-full h-full object-cover opacity-60" />
                    ) : (
                        <div className="text-slate-600 flex flex-col items-center gap-2">
                            <i className="fa-solid fa-video-slash text-4xl"></i>
                            <span className="text-xs font-bold uppercase tracking-widest">No Signal Input</span>
                        </div>
                    )}
                    
                    {/* Setup Overlay */}
                    {isSetupOpen && !isLive && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 p-8 flex flex-col overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Broadcast Title</label>
                                        <input 
                                            type="text" 
                                            value={streamTitle}
                                            onChange={(e) => setStreamTitle(e.target.value)}
                                            placeholder="e.g. Q4 Marketing Strategy AMA" 
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
                                        <textarea 
                                            value={streamDesc}
                                            onChange={(e) => setStreamDesc(e.target.value)}
                                            placeholder="What's this stream about?" 
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 h-24 resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 flex flex-col justify-between">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Platforms</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Meta', 'TikTok', 'YT', 'X', 'Twitch'].map(p => (
                                                <button key={p} onClick={() => toggleStreamTarget(p.toLowerCase())} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border shadow-sm transition-all ${selectedStreamTargets.includes(p.toLowerCase()) ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-500 border-transparent hover:bg-slate-700'}`}>
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => thumbInputRef.current?.click()} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-white border border-slate-600 border-dashed">
                                            <i className="fa-solid fa-image mr-2"></i> Upload Thumb
                                        </button>
                                        <input type="file" ref={thumbInputRef} className="hidden" accept="image/*" onChange={handleThumbUpload} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-auto pt-6 flex justify-end gap-3">
                                <button onClick={() => setIsSetupOpen(false)} className="px-6 py-3 text-slate-400 hover:text-white text-xs font-bold uppercase">Cancel</button>
                                <button onClick={generateLiveStack} disabled={isGeneratingKey} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2">
                                    {isGeneratingKey ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-key"></i>}
                                    Provision Keys
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-4 text-xs font-bold text-slate-500">
                        <span className="flex items-center gap-2"><i className="fa-solid fa-eye"></i> 0 Viewers</span>
                        <span className="flex items-center gap-2"><i className="fa-solid fa-heart"></i> 0 Likes</span>
                        <span className="flex items-center gap-2"><i className="fa-solid fa-clock"></i> 00:00:00</span>
                    </div>
                    <button onClick={() => setIsLive(!isLive)} disabled={!streamKey && !isLive} className={`px-10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 btn-3d shadow-lg ${isLive ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:grayscale'}`}>
                        {isLive ? <><i className="fa-solid fa-stop"></i> End Stream</> : <><i className="fa-solid fa-video"></i> Go Live</>}
                    </button>
                </div>
            </div>

            {/* PERFORMANCE TRENDS CHART */}
            <div className="glass-panel p-6 rounded-[2.5rem] border-slate-200 dark:border-slate-700/50 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg">
                           <i className="fa-solid fa-chart-area"></i>
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Financial Velocity</h3>
                           <p className="text-[10px] text-slate-500 font-bold uppercase">Revenue vs Spend Analytics</p>
                        </div>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        {['7d', '30d', '90d'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range as any)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all btn-3d ${
                                    timeRange === range 
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600' 
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                name="Revenue"
                                stroke="#10b981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                                animationDuration={1000}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="spend" 
                                name="Ad Spend"
                                stroke="#6366f1" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorSpend)" 
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Right Column (Now 4 wide for Command Node) */}
        <div className="lg:col-span-4 space-y-6">
          
            {/* STRATEGIC COMMAND HUB - COMPACT */}
            <div className="glass-panel p-5 rounded-[2.5rem] border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/5 relative overflow-hidden transition-colors">
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-xl shadow-indigo-600/30">
                            <i className="fa-solid fa-brain-circuit text-white"></i>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Command Node</h3>
                            <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest mt-1">Gemini 3 Pro Active</p>
                        </div>
                    </div>

                    <div className="relative">
                        <textarea 
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleCommand())}
                            placeholder="Type strategy request..."
                            className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-indigo-500/20 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 shadow-inner transition-colors font-medium resize-none h-20"
                        />
                        <button 
                            onClick={handleCommand}
                            disabled={isExecutingCommand || !commandInput.trim()}
                            className="absolute right-2 bottom-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs transition-all shadow-lg disabled:opacity-50"
                        >
                            {isExecutingCommand ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                        </button>
                    </div>

                    {commandResult && (
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 rounded-2xl animate-in slide-in-from-top-4 duration-500 space-y-3 shadow-sm">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Tactical Pivot</p>
                            <p className="text-[10px] text-slate-700 dark:text-white leading-relaxed font-semibold">{commandResult.tacticalPivot}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <i className="fa-solid fa-location-arrow text-emerald-500"></i>
                                {commandResult.suggestedAction}
                            </p>
                        </div>
                    </div>
                    )}
                </div>
            </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4">
            <SummaryCard label="Cross-Platform Spend" value={formatPrice(spend)} trend={18} icon="fa-wallet" color="#6366f1" />
            <SummaryCard label="Aggregated ROAS" value="3.4x" trend={12.5} icon="fa-chart-simple" color="#10b981" />
          </div>

          <div className="glass-panel p-6 rounded-3xl h-72 border-slate-200 dark:border-slate-700/50 flex flex-col transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tighter text-sm">Budget Partition</h3>
            <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie data={ROI_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="spend" stroke="none">
                        {ROI_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={2} stroke={entry.spend > 1000 ? '#fff' : 'transparent'} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-xs font-black text-slate-400">TOTAL</p>
                </div>
            </div>
          </div>

        </div>
      </div>

            {/* GLOBAL INTELLIGENCE NEWS FEED - NEWS STYLE */}
            <div className="glass-panel p-0 rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1120] overflow-hidden flex flex-col h-[600px] shadow-2xl relative mt-8">
                {/* News Ticker Header */}
                <div className="bg-[#cc0000] text-white px-4 py-2 flex items-center gap-4 shadow-md z-20 relative">
                    <span className="font-black text-[10px] uppercase tracking-widest bg-white text-[#cc0000] px-2 py-0.5 rounded animate-pulse shadow-sm">Live Feed</span>
                    <div className="overflow-hidden flex-1 relative h-4">
                         <div className="absolute whitespace-nowrap animate-marquee text-xs font-bold w-full font-sans">
                            {news[0] ? `BREAKING: ${news[0].headline} — ${news[0].summary.substring(0, 60)}...` : "Global Markets Opening... Connecting to World News Stream..."}
                         </div>
                    </div>
                    <div className="text-[10px] font-mono opacity-90 hidden sm:block">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} EST</div>
                </div>

                {/* Intelligent Navigation Tabs & Filters */}
                <div className="bg-slate-100 dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-col md:flex-row gap-3 items-center justify-between z-10 shadow-sm">
                    <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 w-full md:w-auto overflow-x-auto no-scrollbar">
                        {[
                            { id: 'breaking', label: 'World News', icon: 'fa-globe', color: 'bg-red-500' },
                            { id: 'x', label: 'X Trends', icon: 'fa-x-twitter', color: 'bg-black' },
                            { id: 'linkedin', label: 'Biz Brief', icon: 'fa-linkedin', color: 'bg-blue-600' },
                            { id: 'archive', label: 'News Store', icon: 'fa-box-archive', color: 'bg-slate-500' }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveFeedTab(tab.id as any)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap flex items-center gap-2 btn-3d ${
                                    activeFeedTab === tab.id 
                                    ? `${tab.color} text-white shadow-lg` 
                                    : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                                }`}
                            >
                                <i className={`fa-brands ${tab.icon} ${tab.id === 'breaking' || tab.id === 'archive' ? 'fa-solid' : ''}`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeFeedTab === 'breaking' && (
                        <div className="flex gap-2 w-full md:w-auto">
                            <select 
                                value={newsLocation} 
                                onChange={(e) => setNewsLocation(e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-700 dark:text-white uppercase focus:ring-1 focus:ring-red-500 outline-none shadow-sm"
                            >
                                <option value="Global">Global / Worldwide</option>
                                <option value="USA">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="India">India</option>
                                <option value="Japan">Japan</option>
                                <option value="China">China</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Germany">Germany</option>
                            </select>
                            
                            <select 
                                value={newsLanguage} 
                                onChange={(e) => setNewsLanguage(e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-700 dark:text-white uppercase focus:ring-1 focus:ring-red-500 outline-none shadow-sm"
                            >
                                {GLOBAL_LANGUAGES.map(lang => (
                                    <option key={lang.code} value={lang.name}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0b1120] relative p-0">
                  {/* NEWS TAB - CNN STYLE */}
                  {activeFeedTab === 'breaking' && (
                    loadingNews ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                            <i className="fa-solid fa-satellite-dish fa-spin text-3xl text-red-500"></i>
                            <p className="text-xs font-black uppercase tracking-widest">Scanning {newsLocation} Satellites...</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {news.map((item, idx) => (
                                <div key={idx} className="p-5 hover:bg-white dark:hover:bg-[#111827] transition-colors group cursor-pointer flex gap-5 items-start">
                                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-400 text-xl font-bold border border-slate-300 dark:border-slate-700 shadow-sm">
                                        {item.source ? item.source[0] : <i className="fa-regular fa-newspaper"></i>}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-black text-[#cc0000] uppercase tracking-widest bg-red-100 dark:bg-red-900/20 px-2 py-0.5 rounded">{item.source || "Global Wire"}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1"><i className="fa-solid fa-clock"></i> {item.time || "Today"}</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#cc0000] transition-colors">{item.headline}</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">{item.summary}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="p-4 text-center">
                                <button className="text-[10px] font-bold uppercase text-slate-500 hover:text-[#cc0000] transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">Load More Headlines</button>
                            </div>
                        </div>
                    )
                  )}

                  {/* X / TWITTER TAB */}
                  {activeFeedTab === 'x' && (
                    loadingX ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                          <i className="fa-brands fa-x-twitter fa-spin text-2xl"></i>
                          <p className="text-xs font-bold uppercase tracking-widest">Connecting to X Stream...</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-200 dark:divide-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-3 bg-slate-100 dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 flex gap-2">
                            <input 
                                type="text" 
                                value={xTopic} 
                                onChange={(e) => setXTopic(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && loadXFeed()}
                                placeholder="Filter Trends (e.g. AI, Crypto)..." 
                                className="bg-white dark:bg-black border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1 text-xs w-full focus:ring-1 focus:ring-black dark:focus:ring-white text-black dark:text-white font-medium"
                            />
                            <button onClick={loadXFeed} className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-lg text-xs font-bold shadow-lg btn-3d">GO</button>
                        </div>
                        {xPosts.map((post, idx) => (
                          <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-[#161e2e] transition-colors group border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                             <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-white border border-slate-600">
                                    {post.author?.[0] || 'X'}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <div className="flex items-center gap-1 justify-between">
                                      <div className="flex items-center gap-1 truncate">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{post.author}</span>
                                        {post.verified && <i className="fa-solid fa-certificate text-[#1d9bf0] text-[12px]"></i>}
                                        <span className="text-xs text-slate-500 truncate">{post.handle} · {post.time}</span>
                                      </div>
                                      <i className="fa-solid fa-ellipsis text-slate-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"></i>
                                   </div>
                                   <p className="text-sm text-slate-800 dark:text-slate-300 mt-1 leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
                                   
                                   <div className="flex items-center justify-between mt-3 text-slate-500 text-xs max-w-md">
                                       <button className="flex items-center gap-2 hover:text-[#1d9bf0] transition-colors group/btn">
                                           <div className="p-1.5 rounded-full group-hover/btn:bg-[#1d9bf0]/10 transition-colors"><i className="fa-regular fa-comment"></i></div>
                                           <span className="font-medium">{post.metrics?.replies || '0'}</span>
                                       </button>
                                       <button className="flex items-center gap-2 hover:text-[#00ba7c] transition-colors group/btn">
                                           <div className="p-1.5 rounded-full group-hover/btn:bg-[#00ba7c]/10 transition-colors"><i className="fa-solid fa-retweet"></i></div>
                                           <span className="font-medium">{post.metrics?.retweets || '0'}</span>
                                       </button>
                                       <button className="flex items-center gap-2 hover:text-[#f91880] transition-colors group/btn">
                                           <div className="p-1.5 rounded-full group-hover/btn:bg-[#f91880]/10 transition-colors"><i className="fa-regular fa-heart"></i></div>
                                           <span className="font-medium">{post.metrics?.likes || '0'}</span>
                                       </button>
                                       <button className="flex items-center gap-2 hover:text-[#1d9bf0] transition-colors group/btn">
                                           <div className="p-1.5 rounded-full group-hover/btn:bg-[#1d9bf0]/10 transition-colors"><i className="fa-solid fa-chart-simple"></i></div>
                                           <span className="font-medium">{post.metrics?.views || '0'}</span>
                                       </button>
                                   </div>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {/* LINKEDIN TAB */}
                  {activeFeedTab === 'linkedin' && (
                    loadingLinkedIn ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                          <i className="fa-brands fa-linkedin fa-spin text-2xl text-[#0A66C2]"></i>
                          <p className="text-xs font-bold uppercase tracking-widest">Fetching Updates...</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-200 dark:divide-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {linkedInPosts.map((post, idx) => (
                          <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-[#161e2e] transition-colors">
                             <div className="flex gap-3 mb-2">
                                <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
                                <div>
                                   <p className="text-xs font-bold text-slate-900 dark:text-white">{post.author}</p>
                                   <p className="text-[10px] text-slate-500">{post.role}</p>
                                </div>
                             </div>
                             <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{post.content}</p>
                             <div className="mt-2 text-[10px] text-slate-500 font-bold"><i className="fa-solid fa-thumbs-up text-[#0A66C2]"></i> {post.metrics}</div>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {/* ARCHIVE STORE TAB */}
                  {activeFeedTab === 'archive' && (
                    <div className="h-full flex flex-col">
                        <div className="p-3 bg-slate-100 dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                            <div className="relative">
                                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search old news..." 
                                    value={archiveSearch}
                                    onChange={(e) => setArchiveSearch(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 bg-white dark:bg-black border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-slate-500 text-slate-900 dark:text-white font-medium"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {filteredArchive.length > 0 ? filteredArchive.map((entry: any, idx: number) => (
                               <div key={idx} className="relative pl-4 border-l-2 border-slate-300 dark:border-slate-700">
                                  <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600"></div>
                                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">{entry.date}</h4>
                                  <div className="space-y-3">
                                      {entry.items.map((item: any, i: number) => (
                                         <div key={i} className="p-3 bg-white dark:bg-[#161e2e] rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[9px] font-bold text-indigo-500 uppercase">{item.source}</span>
                                                <span className="text-[9px] text-slate-400">{item.impact} Impact</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{item.headline}</p>
                                         </div>
                                      ))}
                                  </div>
                               </div>
                            )) : (
                               <div className="text-center py-10 text-slate-500">
                                   <i className="fa-solid fa-box-open text-3xl mb-2 opacity-30"></i>
                                   <p className="text-xs font-bold uppercase">Archive Empty or No Match</p>
                               </div>
                            )}
                        </div>
                    </div>
                  )}
                </div>
            </div>
    </div>
  );
};

export default Dashboard;
