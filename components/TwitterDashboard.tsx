
import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell 
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

const AUDIENCE_DATA = [
  { name: 'Tech', value: 45, color: '#1d9bf0' },
  { name: 'Crypto', value: 25, color: '#00ba7c' },
  { name: 'Marketing', value: 20, color: '#f91880' },
  { name: 'News', value: 10, color: '#ffd400' },
];

const TWITTER_PROFILE = {
    name: 'Social Stack',
    handle: '@socialstack_app',
    followers: '15.2K',
    following: '420',
    tweets: '1,284',
    avatar: 'https://ui-avatars.com/api/?name=Social+Stack&background=000&color=fff&bold=true'
};

const TwitterDashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [scheduledTweets, setScheduledTweets] = useState<any[]>([
      { id: 1, content: ['Launching our new feature next week! 🚀 #TechNews'], time: '2026-02-25T14:00', type: 'text' },
      { id: 2, content: ['Thread: 5 ways to optimize your React code 🧵👇', '1. Use useMemo sparingly...'], time: '2026-02-26T09:00', type: 'thread' }
  ]);
  
  const [tweets, setTweets] = useState<string[]>(['']); 
  const [isPosting, setIsPosting] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'queue'>('timeline');
  const [scheduleTime, setScheduleTime] = useState('');
  
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

  const handleDownloadReport = () => {
      alert("Preparing high-fidelity PDF analytics report...");
      setTimeout(() => alert("Twitter_Analytics_Q1.pdf downloaded successfully."), 1500);
  };

  return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-r from-black to-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
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
                 <button onClick={handleDownloadReport} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase text-xs flex items-center gap-2 transition-all">
                    <i className="fa-solid fa-file-arrow-down"></i> Export PDF
                 </button>
                 <button onClick={() => setShowAiModal(true)} className="px-5 py-3 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-xl font-bold uppercase text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#1d9bf0]/20">
                    <i className="fa-solid fa-wand-magic-sparkles"></i> AI Writer
                 </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-8">
                  <div className="glass-panel p-6 rounded-3xl border-slate-700/50">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Engagement Pulse</h3>
                      <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ANALYTICS_DATA}>
                                <defs><linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1d9bf0" stopOpacity={0.3}/><stop offset="95%" stopColor="#1d9bf0" stopOpacity={0}/></linearGradient></defs>
                                <XAxis dataKey="day" hide /><Tooltip contentStyle={{ backgroundColor: '#000', border: 'none' }} />
                                <Area type="monotone" dataKey="impressions" stroke="#1d9bf0" strokeWidth={3} fillOpacity={1} fill="url(#colorImp)" />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                  </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                  <div className="glass-panel p-6 rounded-[2rem] border-slate-700/50 min-h-[400px]">
                      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                          <div className="flex gap-4">
                              <button onClick={() => setActiveTab('timeline')} className={`text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'timeline' ? 'text-[#1d9bf0]' : 'text-slate-500'}`}>Timeline</button>
                              <button onClick={() => setActiveTab('queue')} className={`text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'queue' ? 'text-[#1d9bf0]' : 'text-slate-500'}`}>Queue</button>
                          </div>
                          <button onClick={() => alert("Downloading CSV archive of all historical posts...")} className="text-[10px] font-black text-indigo-400 uppercase flex items-center gap-1.5"><i className="fa-solid fa-download"></i> Get Archive</button>
                      </div>

                      <div className="space-y-4">
                          {activeTab === 'timeline' ? (
                              feed.map((post, i) => (
                                  <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800/50 transition-colors group">
                                      <div className="flex gap-3">
                                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center text-slate-400 font-bold">{post.author ? post.author[0] : 'X'}</div>
                                          <div className="flex-1">
                                              <div className="flex justify-between items-start">
                                                  <div>
                                                      <h4 className="font-bold text-white text-sm">{post.author}</h4>
                                                      <p className="text-slate-500 text-xs">{post.handle} · {post.time}</p>
                                                  </div>
                                                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <button onClick={() => alert("Post snapshot saved to local storage.")} className="text-slate-500 hover:text-white"><i className="fa-solid fa-download text-xs"></i></button>
                                                      <i className="fa-brands fa-x-twitter text-slate-600"></i>
                                                  </div>
                                              </div>
                                              <p className="text-slate-300 text-sm mt-2 whitespace-pre-wrap">{post.content}</p>
                                          </div>
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div className="text-center py-12 text-slate-500"><p className="text-xs font-bold uppercase">Queue is empty</p></div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default TwitterDashboard;
