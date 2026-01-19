
import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, Cell 
} from 'recharts';
import { getXFeed, generateTwitterThread } from '../services/geminiService';

const ANALYTICS_DATA = [
  { day: 'Mon', impressions: 4500, engagement: 320, retweets: 45, replies: 28 },
  { day: 'Tue', impressions: 3200, engagement: 210, retweets: 30, replies: 15 },
  { day: 'Wed', impressions: 5800, engagement: 540, retweets: 85, replies: 62 },
  { day: 'Thu', impressions: 4100, engagement: 390, retweets: 50, replies: 40 },
  { day: 'Fri', impressions: 6900, engagement: 680, retweets: 120, replies: 95 },
  { day: 'Sat', impressions: 3800, engagement: 410, retweets: 45, replies: 35 },
  { day: 'Sun', impressions: 4200, engagement: 450, retweets: 60, replies: 42 },
];

const TWITTER_PROFILE = {
    name: 'Social Stack',
    handle: '@socialstack_app',
    followers: '15.2K',
    following: '420',
    tweets: '1,284',
    avatar: 'https://ui-avatars.com/api/?name=Social+Stack&background=000&color=fff&bold=true'
};

const MOCK_MESSAGES = [
    { id: 1, sender: 'Alex River', text: 'Hey, love the new dashboard update!', time: '10:30 AM', avatar: 'https://ui-avatars.com/api/?name=AR&background=random' },
    { id: 2, sender: 'Growth Node', text: 'Protocol sync complete on our end.', time: '09:15 AM', avatar: 'https://ui-avatars.com/api/?name=GN&background=6366f1&color=fff' },
    { id: 3, sender: 'Sarah Chen', text: 'Can we schedule a call about the API?', time: 'Yesterday', avatar: 'https://ui-avatars.com/api/?name=SC&background=random' }
];

const TwitterDashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [scheduledTweets, setScheduledTweets] = useState<any[]>([
      { id: 1, content: 'Launching our new feature next week! 🚀 #TechNews', time: '2026-02-25T14:00', type: 'text' },
  ]);
  
  const [composerTweets, setComposerTweets] = useState<string[]>(['']); 
  const [scheduleTime, setScheduleTime] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'queue' | 'dms'>('timeline');
  const [selectedDm, setSelectedDm] = useState<any>(null);
  
  const [campaignGoals, setCampaignGoals] = useState({
      engagement: { current: 3.2, target: 5.0 },
      reach: { current: 12400, target: 25000 },
      conversion: { current: 1.8, target: 3.0 }
  });

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('Viral / Hype');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  useEffect(() => {
      const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
      setIsConnected(savedApps.includes('twitter'));
      if(savedApps.includes('twitter')) { loadFeed(); }
  }, []);

  const loadFeed = async () => {
      setLoadingFeed(true);
      const posts = await getXFeed('SaaS & Tech Marketing');
      setFeed(posts);
      setLoadingFeed(false);
  }

  const handleConnect = () => {
      const width = 600, height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const popup = window.open('', 'Twitter Auth', `width=${width},height=${height},top=${top},left=${left}`);
      if(popup) {
          popup.document.write(`
            <html><body style="background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;">
            <i class="fa-brands fa-x-twitter" style="font-size:60px;margin-bottom:20px;"></i>
            <h2>Authorizing Social Stack</h2><p style="color:#8899a6">Connecting @socialstack_app...</p>
            <div style="border:4px solid #333;border-top-color:#fff;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;"></div>
            <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </body></html>
          `);
          setTimeout(() => {
              popup.close();
              const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
              if(!savedApps.includes('twitter')) localStorage.setItem('socialstack_connected_apps', JSON.stringify([...savedApps, 'twitter']));
              setIsConnected(true);
              loadFeed();
          }, 2500);
      }
  };

  const handleGenerateThread = async () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingAi(true);
    const thread = await generateTwitterThread(aiTopic, aiTone);
    if (thread && thread.length > 0) {
      setComposerTweets(thread);
      setShowAiModal(false);
      setAiTopic('');
    } else {
      alert("Failed to generate thread. Please try again.");
    }
    setIsGeneratingAi(false);
  };

  const handleAddTweet = () => setComposerTweets(prev => [...prev, '']);
  const handleRemoveTweet = (idx: number) => setComposerTweets(prev => prev.filter((_, i) => i !== idx));
  const handleTweetChange = (idx: number, val: string) => {
    const next = [...composerTweets];
    next[idx] = val;
    setComposerTweets(next);
  };

  const handlePostThread = () => {
    if (composerTweets.some(t => !t.trim())) return;
    setIsPosting(true);
    
    setTimeout(() => {
      if (scheduleTime) {
          const newScheduled = {
              id: Date.now(),
              content: composerTweets[0],
              time: scheduleTime,
              type: composerTweets.length > 1 ? 'thread' : 'text'
          };
          setScheduledTweets(prev => [newScheduled, ...prev]);
          alert("Sequence queued in broadcast buffer for: " + scheduleTime);
      } else {
          alert("Thread successfully transmitted to the X network!");
          loadFeed();
      }
      setComposerTweets(['']);
      setScheduleTime('');
      setIsPosting(false);
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-10 animate-in fade-in duration-500">
          <div className="w-32 h-32 bg-black rounded-[2.5rem] flex items-center justify-center text-7xl text-white shadow-2xl border-4 border-white/10"><i className="fa-brands fa-x-twitter"></i></div>
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Authorize X Node</h2>
            <p className="text-slate-500 max-w-sm font-medium">Connect your X profile to unlock real-time intelligence and AI broadcasting.</p>
          </div>
          <button onClick={handleConnect} className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl flex items-center gap-4 active:scale-95"><i className="fa-solid fa-link"></i> Sync Identity</button>
      </div>
    );
  }

  return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20 select-none">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-r from-black to-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <i className="fa-brands fa-x-twitter text-9xl text-white"></i>
            </div>
            <div className="flex items-center gap-6 relative z-10">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#1d9bf0] to-emerald-400">
                        <img src={TWITTER_PROFILE.avatar} alt="Profile" className="w-full h-full rounded-full border-4 border-black object-cover" />
                    </div>
                </div>
                <div className="text-white">
                    <h2 className="text-3xl font-black flex items-center gap-2">{TWITTER_PROFILE.name}<i className="fa-solid fa-circle-check text-blue-500 text-lg"></i></h2>
                    <p className="text-slate-400 font-mono text-sm">{TWITTER_PROFILE.handle}</p>
                </div>
            </div>
            <div className="relative z-10 flex gap-3">
                 <button onClick={() => setShowAiModal(true)} className="px-6 py-4 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-[#1d9bf0]/20">
                    <i className="fa-solid fa-wand-magic-sparkles text-sm"></i> AI Synthesis
                 </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* COMPOSER & ANALYTICS COLUMN */}
              <div className="lg:col-span-4 space-y-8">
                  {/* BROADCASTER COMPOSER */}
                  <div className="glass-panel p-8 rounded-[3rem] border-white/5 bg-white/5 shadow-2xl space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1d9bf0] to-transparent opacity-50"></div>
                      <div className="flex justify-between items-center">
                        <h3 className="text-[10px] font-tech font-black text-indigo-400 uppercase tracking-[0.3em]">Broadcaster Node</h3>
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Live Network Mode</span>
                      </div>
                      
                      <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
                        {composerTweets.map((tweet, idx) => (
                          <div key={idx} className="relative animate-in slide-in-from-right-4 duration-300">
                            <textarea 
                              value={tweet}
                              onChange={(e) => handleTweetChange(idx, e.target.value)}
                              placeholder={idx === 0 ? "Identify transmission payload..." : "Append node to thread..."}
                              className="w-full bg-slate-950 border border-white/5 rounded-[1.5rem] p-6 text-sm text-white resize-none h-32 focus:ring-1 focus:ring-[#1d9bf0] transition-all shadow-inner font-medium placeholder-slate-800"
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-3">
                              <span className={`text-[9px] font-tech font-black px-2 py-1 rounded bg-black/40 ${tweet.length > 280 ? 'text-rose-500' : 'text-slate-600'}`}>{tweet.length}/280</span>
                              {composerTweets.length > 1 && (
                                <button onClick={() => handleRemoveTweet(idx)} className="text-slate-700 hover:text-rose-500 transition-colors"><i className="fa-solid fa-trash-can text-xs"></i></button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[9px] font-tech text-slate-500 uppercase tracking-[0.2em] font-black">Schedule Node (Optional)</label>
                            <i className="fa-solid fa-clock text-[#1d9bf0] text-[10px]"></i>
                        </div>
                        <input 
                            type="datetime-local" 
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black text-white uppercase outline-none focus:border-indigo-500/50 shadow-inner"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button onClick={handleAddTweet} className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/5">Add Node</button>
                        <button 
                          onClick={handlePostThread}
                          disabled={isPosting || composerTweets.some(t => t.length > 280 || t.length === 0)}
                          className="flex-1 py-4 bg-white text-black hover:bg-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-30 btn-3d"
                        >
                          {isPosting ? <i className="fa-solid fa-sync fa-spin"></i> : scheduleTime ? 'Queue Seq' : 'Broadcast Now'}
                        </button>
                      </div>
                  </div>

                  {/* CAMPAIGN GOALS */}
                  <div className="glass-panel p-8 rounded-[3rem] border-indigo-500/20 bg-indigo-600/5 space-y-8">
                      <div className="flex justify-between items-center">
                          <h3 className="text-[10px] font-tech font-black text-indigo-400 uppercase tracking-[0.3em]">Campaign Strategy</h3>
                          <i className="fa-solid fa-bullseye text-indigo-500 animate-pulse"></i>
                      </div>
                      
                      <div className="space-y-6">
                          {[
                              { label: 'Engagement Rate', val: campaignGoals.engagement.current, target: campaignGoals.engagement.target, unit: '%' },
                              { label: 'Network Reach', val: campaignGoals.reach.current, target: campaignGoals.reach.target, unit: '' },
                              { label: 'Conversion Node', val: campaignGoals.conversion.current, target: campaignGoals.conversion.target, unit: '%' }
                          ].map((goal, i) => (
                              <div key={i} className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                      <span className="text-slate-400">{goal.label}</span>
                                      <span className="text-white">{goal.val}{goal.unit} / {goal.target}{goal.unit}</span>
                                  </div>
                                  <div className="h-2 bg-slate-950 rounded-full border border-white/5 overflow-hidden">
                                      <div 
                                        className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" 
                                        style={{ width: `${Math.min(100, (goal.val / goal.target) * 100)}%` }}
                                      ></div>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all">Adjust KPIs</button>
                  </div>
              </div>

              {/* TIMELINE & MESSAGES COLUMN */}
              <div className="lg:col-span-8 space-y-8">
                  <div className="glass-panel rounded-[3.5rem] border-white/5 overflow-hidden shadow-2xl flex flex-col min-h-[700px]">
                      <div className="p-8 border-b border-white/5 bg-slate-900/40 flex flex-col md:flex-row justify-between items-center gap-6">
                          <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-white/5">
                              {[
                                { id: 'timeline', label: 'Identity Stream', icon: 'fa-timeline' },
                                { id: 'queue', label: 'Broadcast Queue', icon: 'fa-clock-rotate-left' },
                                { id: 'dms', label: 'Signal Inbox', icon: 'fa-comment-dots' }
                              ].map(tab => (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <i className={`fa-solid ${tab.icon}`}></i>
                                    {tab.label}
                                </button>
                              ))}
                          </div>
                          
                          <div className="flex items-center gap-4">
                             <div className="relative group">
                                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px]"></i>
                                <input type="text" placeholder="FILTER FEED..." className="bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-[9px] font-tech font-black text-white outline-none focus:ring-1 focus:ring-indigo-500" />
                             </div>
                             <button onClick={loadFeed} className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"><i className="fa-solid fa-rotate-right text-xs"></i></button>
                          </div>
                      </div>

                      <div className="flex-1 p-8 bg-slate-950/20 overflow-y-auto no-scrollbar scroll-smooth">
                        {loadingFeed ? (
                            <div className="py-40 text-center space-y-6 text-slate-600 opacity-20">
                                <i className="fa-solid fa-satellite fa-spin text-6xl"></i>
                                <p className="text-sm font-tech font-black uppercase tracking-[0.4em]">Synchronizing Network Nodes...</p>
                            </div>
                        ) : activeTab === 'timeline' ? (
                            <div className="grid gap-8">
                                {feed.map((post, i) => (
                                    <div key={i} className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] hover:bg-slate-900/80 transition-all group relative overflow-hidden">
                                        <div className="flex gap-6 items-start relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/5 flex-shrink-0 flex items-center justify-center text-slate-400 font-bold shadow-inner">
                                                {post.author ? post.author[0] : 'X'}
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-black text-white text-base uppercase tracking-tight">{post.author}</h4>
                                                            <i className="fa-solid fa-circle-check text-[#1d9bf0] text-xs"></i>
                                                        </div>
                                                        <p className="text-slate-500 text-[10px] font-tech uppercase tracking-widest mt-1">@{post.author?.toLowerCase().replace(/\s/g, '')} · {post.time}</p>
                                                    </div>
                                                    <i className="fa-brands fa-x-twitter text-slate-800 text-3xl opacity-20"></i>
                                                </div>
                                                <p className="text-slate-300 text-sm leading-relaxed font-medium">"{post.content}"</p>
                                                
                                                <div className="pt-6 border-t border-white/5 flex flex-wrap gap-8 items-center">
                                                    <div className="flex items-center gap-3 group/stat cursor-pointer">
                                                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover/stat:bg-rose-500 group-hover/stat:text-white transition-all shadow-inner"><i className="fa-solid fa-heart"></i></div>
                                                        <div><p className="text-[11px] font-black text-white leading-none">{post.metrics?.likes || '0'}</p><p className="text-[8px] text-slate-600 uppercase font-black tracking-widest mt-1">Hearts</p></div>
                                                    </div>
                                                    <div className="flex items-center gap-3 group/stat cursor-pointer">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover/stat:bg-indigo-500 group-hover/stat:text-white transition-all shadow-inner"><i className="fa-solid fa-chart-line"></i></div>
                                                        <div><p className="text-[11px] font-black text-white leading-none">{post.metrics?.views || '0'}</p><p className="text-[8px] text-slate-600 uppercase font-black tracking-widest mt-1">Signals</p></div>
                                                    </div>
                                                    <div className="flex items-center gap-3 group/stat cursor-pointer">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover/stat:bg-white group-hover/stat:text-black transition-all shadow-inner"><i className="fa-solid fa-retweet"></i></div>
                                                        <div><p className="text-[11px] font-black text-white leading-none">0</p><p className="text-[8px] text-slate-600 uppercase font-black tracking-widest mt-1">Echoes</p></div>
                                                    </div>
                                                    <div className="flex items-center gap-3 group/stat cursor-pointer">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover/stat:bg-white group-hover/stat:text-black transition-all shadow-inner"><i className="fa-solid fa-comment"></i></div>
                                                        <div><p className="text-[11px] font-black text-white leading-none">0</p><p className="text-[8px] text-slate-600 uppercase font-black tracking-widest mt-1">Nodes</p></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : activeTab === 'queue' ? (
                            <div className="grid gap-4">
                                {scheduledTweets.length > 0 ? scheduledTweets.map((t) => (
                                    <div key={t.id} className="p-6 bg-slate-900/60 border-2 border-indigo-500/20 rounded-3xl flex items-center justify-between group transition-all hover:bg-slate-900 shadow-xl">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 text-xl"><i className="fa-solid fa-calendar-check"></i></div>
                                            <div>
                                                <p className="text-xs font-bold text-white line-clamp-1 mb-1">"{t.content}"</p>
                                                <p className="text-[10px] font-tech text-slate-500 uppercase tracking-widest">TRANSMISSION AT: {t.time.replace('T', ' ')}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"><i className="fa-solid fa-pen-to-square text-xs"></i></button>
                                            <button onClick={() => setScheduledTweets(prev => prev.filter(st => st.id !== t.id))} className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-all"><i className="fa-solid fa-trash-can text-xs"></i></button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-40 text-slate-600 border-4 border-dashed border-white/5 rounded-[3rem]">
                                        <i className="fa-solid fa-clock-rotate-left text-6xl mb-6 opacity-10"></i>
                                        <p className="text-[11px] font-tech font-black uppercase tracking-[0.4em]">Vault Empty: No Nodes Queued</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col lg:flex-row gap-8 h-[550px]">
                                {/* DM LIST */}
                                <div className="w-full lg:w-72 bg-slate-950/40 rounded-3xl border border-white/5 p-4 space-y-2 overflow-y-auto no-scrollbar">
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 ml-2">Active Signals</p>
                                    {MOCK_MESSAGES.map(dm => (
                                        <button 
                                            key={dm.id} 
                                            onClick={() => setSelectedDm(dm)}
                                            className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${selectedDm?.id === dm.id ? 'bg-indigo-600 text-white shadow-xl' : 'hover:bg-white/5 text-slate-400'}`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex-shrink-0">
                                                <img src={dm.avatar} className="w-full h-full rounded-full object-cover" />
                                            </div>
                                            <div className="text-left min-w-0 flex-1">
                                                <p className={`text-[11px] font-black uppercase truncate ${selectedDm?.id === dm.id ? 'text-white' : 'text-slate-300'}`}>{dm.sender}</p>
                                                <p className={`text-[9px] truncate mt-0.5 ${selectedDm?.id === dm.id ? 'text-indigo-100' : 'text-slate-600 font-medium'}`}>{dm.text}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* CHAT WINDOW */}
                                <div className="flex-1 bg-slate-950/60 rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden relative">
                                    {selectedDm ? (
                                        <>
                                            <div className="p-6 border-b border-white/5 bg-slate-900/40 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800"><img src={selectedDm.avatar} className="w-full h-full rounded-full object-cover" /></div>
                                                <div>
                                                    <p className="text-[11px] font-black text-white uppercase tracking-widest">{selectedDm.sender}</p>
                                                    <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Active Signal Node</p>
                                                </div>
                                            </div>
                                            <div className="flex-1 p-8 space-y-6 overflow-y-auto no-scrollbar">
                                                <div className="flex justify-start">
                                                    <div className="max-w-[80%] p-5 bg-slate-900 border border-white/5 rounded-3xl rounded-tl-none shadow-xl">
                                                        <p className="text-xs text-slate-300 leading-relaxed font-medium">"{selectedDm.text}"</p>
                                                        <p className="text-[8px] text-slate-600 mt-2 font-tech uppercase">{selectedDm.time}</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <div className="max-w-[80%] p-5 bg-indigo-600 text-white rounded-3xl rounded-tr-none shadow-2xl">
                                                        <p className="text-xs leading-relaxed font-black uppercase tracking-tight">Identity Verified. Stand by for protocol handshake.</p>
                                                        <p className="text-[8px] text-indigo-200 mt-2 font-tech uppercase tracking-widest">Just Now</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-slate-900/80 border-t border-white/5">
                                                <div className="relative group">
                                                    <input type="text" placeholder="Transmit reply to node..." className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-6 pr-16 py-4 text-xs font-black text-white shadow-inner outline-none focus:ring-1 focus:ring-indigo-500" />
                                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"><i className="fa-solid fa-paper-plane text-xs"></i></button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-700 space-y-6 opacity-20">
                                            <i className="fa-solid fa-satellite-dish text-8xl"></i>
                                            <p className="text-[10px] font-tech font-black uppercase tracking-[0.4em]">Select Node to Initialize Uplink</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                      </div>
                  </div>
              </div>
          </div>

          {/* AI WRITER MODAL */}
          {showAiModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                <div className="bg-[#0f172a] border border-slate-700 w-full max-w-xl rounded-[3rem] p-10 space-y-8 shadow-4xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1d9bf0] to-transparent"></div>
                    
                    <button 
                        onClick={() => setShowAiModal(false)}
                        className="absolute top-6 right-6 w-10 h-10 bg-white/5 hover:bg-rose-600 rounded-full flex items-center justify-center text-white transition-all"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#1d9bf0] rounded-[1.5rem] flex items-center justify-center text-3xl text-white shadow-2xl shadow-[#1d9bf0]/20">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">AI Thread Synthesis</h3>
                            <p className="text-[10px] font-tech text-slate-500 uppercase tracking-widest">Powered by Gemini 3 Node</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.3em] ml-1">Synthesis Topic</label>
                            <textarea 
                                value={aiTopic}
                                onChange={(e) => setAiTopic(e.target.value)}
                                placeholder="What should your thread be about? (e.g. 5 React Hooks to master)"
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm text-white resize-none h-32 focus:ring-1 focus:ring-[#1d9bf0] transition-all shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.3em] ml-1">Vocal Identity (Tone)</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Viral / Hype', 'Professional', 'Educational', 'Controversial'].map(tone => (
                                    <button 
                                        key={tone}
                                        onClick={() => setAiTone(tone)}
                                        className={`py-4 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${aiTone === tone ? 'bg-[#1d9bf0]/10 border-[#1d9bf0] text-white' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                                    >
                                        {tone}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerateThread}
                        disabled={isGeneratingAi || !aiTopic.trim()}
                        className="w-full py-6 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-2xl font-display font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-[#1d9bf0]/20 flex items-center justify-center gap-3 disabled:opacity-50 btn-3d"
                    >
                        {isGeneratingAi ? (
                            <>
                                <i className="fa-solid fa-dna fa-spin"></i>
                                Sequencing Thread...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-bolt-lightning"></i>
                                Generate Thread
                            </>
                        )}
                    </button>
                </div>
            </div>
          )}
      </div>
  );
};

export default TwitterDashboard;
