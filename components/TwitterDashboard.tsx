
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
  
  // Composer State
  const [tweets, setTweets] = useState<string[]>(['']); // Array for threads
  const [isPosting, setIsPosting] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'queue'>('timeline');
  const [scheduleTime, setScheduleTime] = useState('');
  
  // AI Writer State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('Viral / Hype');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  useEffect(() => {
      const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
      setIsConnected(savedApps.includes('twitter'));
      
      if(savedApps.includes('twitter')) {
          loadFeed();
      }
  }, []);

  const loadFeed = async () => {
      setLoadingFeed(true);
      const posts = await getXFeed('SaaS & Tech Marketing');
      setFeed(posts);
      setLoadingFeed(false);
  }

  const handleConnect = () => {
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open('', 'Twitter Auth', `width=${width},height=${height},top=${top},left=${left}`);
      if(popup) {
          popup.document.write(`
            <html>
                <head>
                    <title>X (Twitter) Authorization</title>
                    <style>
                        body { background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                        .loader { border: 4px solid #333; border-top: 4px solid #fff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-top: 30px; }
                        .logo { font-size: 60px; margin-bottom: 20px; }
                        h2 { font-weight: 800; margin-bottom: 10px; }
                        p { color: #8899a6; }
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    </style>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                </head>
                <body>
                    <div class="logo"><i class="fa-brands fa-x-twitter"></i></div>
                    <h2>Authorizing Social Stack</h2>
                    <p>Connecting @socialstack_app securely...</p>
                    <div class="loader"></div>
                </body>
            </html>
          `);
          setTimeout(() => {
              popup.close();
              const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
              if(!savedApps.includes('twitter')) {
                  const newApps = [...savedApps, 'twitter'];
                  localStorage.setItem('socialstack_connected_apps', JSON.stringify(newApps));
              }
              setIsConnected(true);
              loadFeed();
          }, 2500);
      }
  };

  const handleDisconnect = () => {
      if(confirm('Are you sure you want to disconnect your X account? Scheduled posts will be paused.')) {
          const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
          const newApps = savedApps.filter((app: string) => app !== 'twitter');
          localStorage.setItem('socialstack_connected_apps', JSON.stringify(newApps));
          setIsConnected(false);
      }
  };

  // Composer Logic
  const updateTweet = (index: number, val: string) => {
      const newTweets = [...tweets];
      newTweets[index] = val;
      setTweets(newTweets);
  };

  const addTweetToThread = () => {
      setTweets([...tweets, '']);
  };

  const removeTweet = (index: number) => {
      if (tweets.length === 1) return;
      setTweets(tweets.filter((_, i) => i !== index));
  };

  const handleAiGenerate = async (presetTopic?: string) => {
      const topicToUse = presetTopic || aiTopic;
      if (!topicToUse) return;
      
      setIsGeneratingAi(true);
      try {
        const generatedThread = await generateTwitterThread(topicToUse, aiTone);
        if (generatedThread && generatedThread.length > 0) {
            setTweets(generatedThread);
            setShowAiModal(false);
            setAiTopic('');
        } else {
            alert('Failed to generate thread. Please try a different topic.');
        }
      } catch (err) {
        console.error(err);
        alert('An error occurred while generating the thread.');
      } finally {
        setIsGeneratingAi(false);
      }
  };

  const handlePostTweet = () => {
      if(tweets.every(t => !t.trim())) return;
      setIsPosting(true);
      
      setTimeout(() => {
          if (scheduleTime) {
              const newScheduled = {
                  id: Date.now(),
                  content: tweets.filter(t => t.trim()),
                  time: scheduleTime,
                  type: tweets.length > 1 ? 'thread' : 'text'
              };
              setScheduledTweets([newScheduled, ...scheduledTweets]);
              alert(`Post scheduled for ${new Date(scheduleTime).toLocaleString()}`);
              setActiveTab('queue');
          } else {
              const newPost = {
                  author: TWITTER_PROFILE.name,
                  handle: TWITTER_PROFILE.handle,
                  content: tweets[0], // Display first tweet in feed mock
                  time: 'Just now',
                  metrics: '0 likes',
                  verified: true
              };
              setFeed([newPost, ...feed]);
              alert(tweets.length > 1 ? 'Thread posted successfully!' : 'Tweet posted successfully!');
          }
          
          setTweets(['']);
          setScheduleTime('');
          setIsPosting(false);
      }, 1500);
  };

  if (!isConnected) {
      return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] space-y-10 animate-in fade-in duration-500">
              <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
                  <div className="w-32 h-32 bg-black rounded-[2.5rem] flex items-center justify-center text-7xl text-white shadow-2xl border border-slate-800 relative z-10">
                      <i className="fa-brands fa-x-twitter"></i>
                  </div>
              </div>
              <div className="text-center space-y-4 max-w-lg">
                  <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Connect X</h2>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed">
                      Unleash the full power of Social Stack. Schedule threads, analyze viral velocity, and engage with your audience in real-time.
                  </p>
              </div>
              <button onClick={handleConnect} className="group relative px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-4 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                      <i className="fa-solid fa-link"></i> Authorize App
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
          </div>
      )
  }

  return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
          {/* Professional Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-r from-black to-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <i className="fa-brands fa-x-twitter text-9xl text-white"></i>
            </div>
            <div className="flex items-center gap-6 relative z-10">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#1d9bf0] to-emerald-400">
                        <img src={TWITTER_PROFILE.avatar} alt="Profile" className="w-full h-full rounded-full border-4 border-black object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-black text-white text-xs font-bold px-3 py-1 rounded-full border border-slate-700 shadow-lg flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        LIVE
                    </div>
                </div>
                <div className="text-white">
                    <h2 className="text-3xl font-black flex items-center gap-2">
                        {TWITTER_PROFILE.name}
                        <i className="fa-solid fa-circle-check text-blue-500 text-lg"></i>
                    </h2>
                    <p className="text-slate-400 font-mono text-sm">{TWITTER_PROFILE.handle}</p>
                    <div className="flex gap-4 mt-3 text-sm font-bold">
                        <span><span className="text-white">{TWITTER_PROFILE.followers}</span> <span className="text-slate-500">Followers</span></span>
                        <span><span className="text-white">{TWITTER_PROFILE.following}</span> <span className="text-slate-500">Following</span></span>
                    </div>
                </div>
            </div>
            <div className="relative z-10 flex gap-3">
                 <button onClick={() => setShowAiModal(true)} className="px-5 py-3 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-xl font-bold uppercase text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#1d9bf0]/20">
                    <i className="fa-solid fa-wand-magic-sparkles"></i> AI Writer
                 </button>
                 <button onClick={handleDisconnect} className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold uppercase text-xs flex items-center gap-2 transition-all">
                    <i className="fa-solid fa-power-off"></i> Disconnect
                 </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Analytics */}
              <div className="space-y-8">
                  <div className="glass-panel p-6 rounded-3xl border-slate-700/50">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Engagement Pulse</h3>
                      <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ANALYTICS_DATA}>
                                <defs>
                                    <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1d9bf0" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#1d9bf0" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '10px' }} />
                                <Area type="monotone" dataKey="impressions" stroke="#1d9bf0" strokeWidth={3} fillOpacity={1} fill="url(#colorImp)" />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                  </div>

                  <div className="glass-panel p-6 rounded-3xl border-slate-700/50">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Audience Interest</h3>
                      <div className="h-48 relative">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie data={AUDIENCE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                      {AUDIENCE_DATA.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                      ))}
                                  </Pie>
                              </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-2xl font-black text-white">4.2M</span>
                          </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3 mt-4">
                          {AUDIENCE_DATA.map((d, i) => (
                              <div key={i} className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">{d.name}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Middle Column: Composer & Queue */}
              <div className="lg:col-span-2 space-y-8">
                  {/* Composer */}
                  <div className="glass-panel p-6 rounded-[2rem] border-slate-700/50 bg-slate-900/50 relative overflow-hidden">
                      <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Compose Thread</h3>
                            {tweets.length > 1 && (
                                <span className="bg-indigo-600/20 text-indigo-400 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-indigo-500/30">Thread Active</span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{tweets.reduce((acc, t) => acc + t.length, 0)} chars total</span>
                      </div>

                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                          {tweets.map((tweet, index) => (
                              <div key={index} className="flex gap-4 group">
                                  <div className="flex flex-col items-center pt-2">
                                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                                          <img src={TWITTER_PROFILE.avatar} alt="Me" className="w-full h-full object-cover" />
                                      </div>
                                      {index !== tweets.length - 1 && <div className="w-0.5 flex-1 bg-slate-800 my-2"></div>}
                                  </div>
                                  <div className="flex-1 relative">
                                      <textarea 
                                          value={tweet}
                                          onChange={(e) => updateTweet(index, e.target.value)}
                                          placeholder={index === 0 ? "What's happening?!" : "Add another tweet..."}
                                          className={`w-full bg-slate-800/50 border rounded-xl p-4 text-white text-sm focus:ring-1 focus:ring-[#1d9bf0] resize-none h-28 transition-all ${tweet.length > 280 ? 'border-rose-500/50' : 'border-slate-700'}`}
                                      />
                                      {index > 0 && (
                                          <button onClick={() => removeTweet(index)} className="absolute top-2 right-2 text-slate-500 hover:text-rose-500 transition-colors">
                                              <i className="fa-solid fa-xmark"></i>
                                          </button>
                                      )}
                                      <div className="flex justify-end mt-1">
                                          <span className={`text-[10px] font-bold ${tweet.length > 280 ? 'text-rose-500' : 'text-slate-600'}`}>
                                              {tweet.length}/280
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>

                      <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-800">
                          <button onClick={addTweetToThread} className="text-[#1d9bf0] text-xl hover:scale-110 transition-transform flex items-center gap-2 group">
                              <i className="fa-solid fa-circle-plus"></i>
                              <span className="text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">Add Tweet</span>
                          </button>
                          
                          <div className="flex items-center gap-4">
                              <div className="relative group/sched">
                                  <label className="absolute -top-6 left-0 text-[8px] font-black text-slate-500 uppercase opacity-0 group-focus-within/sched:opacity-100 transition-opacity">Schedule For</label>
                                  <input 
                                      type="datetime-local" 
                                      value={scheduleTime}
                                      onChange={(e) => setScheduleTime(e.target.value)}
                                      className="bg-slate-800 text-white text-xs p-2 rounded-lg border border-slate-700 focus:ring-1 focus:ring-[#1d9bf0]"
                                  />
                              </div>
                              <button 
                                  onClick={handlePostTweet}
                                  disabled={isPosting || tweets.every(t => !t.trim())}
                                  className="px-6 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-50 btn-3d"
                              >
                                  {isPosting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : scheduleTime ? <i className="fa-solid fa-clock"></i> : <i className="fa-regular fa-paper-plane"></i>}
                                  {scheduleTime ? 'Schedule' : 'Post All'}
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Feed / Queue Tabs */}
                  <div className="glass-panel p-6 rounded-[2rem] border-slate-700/50 min-h-[400px]">
                      <div className="flex gap-4 mb-6 border-b border-slate-800 pb-2">
                          <button onClick={() => setActiveTab('timeline')} className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'timeline' ? 'text-[#1d9bf0] border-b-2 border-[#1d9bf0]' : 'text-slate-500 hover:text-white'}`}>Timeline</button>
                          <button onClick={() => setActiveTab('queue')} className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'queue' ? 'text-[#1d9bf0] border-b-2 border-[#1d9bf0]' : 'text-slate-500 hover:text-white'}`}>Scheduled Queue</button>
                      </div>

                      <div className="space-y-4">
                          {activeTab === 'timeline' ? (
                              loadingFeed ? (
                                  <div className="text-center py-12 text-slate-500">
                                      <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                                      <p className="text-xs font-bold uppercase">Syncing Timeline...</p>
                                  </div>
                              ) : (
                                  feed.map((post, i) => (
                                      <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800/50 transition-colors">
                                          <div className="flex gap-3">
                                              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center text-slate-400 font-bold">
                                                  {post.author ? post.author[0] : 'X'}
                                              </div>
                                              <div className="flex-1">
                                                  <div className="flex justify-between items-start">
                                                      <div>
                                                          <h4 className="font-bold text-white text-sm">{post.author} <i className="fa-solid fa-certificate text-[#1d9bf0] text-[10px]"></i></h4>
                                                          <p className="text-slate-500 text-xs">{post.handle} · {post.time}</p>
                                                      </div>
                                                      <i className="fa-brands fa-x-twitter text-slate-600"></i>
                                                  </div>
                                                  <p className="text-slate-300 text-sm mt-2 whitespace-pre-wrap">{post.content}</p>
                                                  <div className="flex gap-6 mt-3 text-slate-500 text-xs font-bold">
                                                      <span className="hover:text-[#1d9bf0] cursor-pointer"><i className="fa-regular fa-comment"></i> 12</span>
                                                      <span className="hover:text-emerald-500 cursor-pointer"><i className="fa-solid fa-retweet"></i> 5</span>
                                                      <span className="hover:text-rose-500 cursor-pointer"><i className="fa-regular fa-heart"></i> {post.metrics}</span>
                                                      <span className="hover:text-[#1d9bf0] cursor-pointer"><i className="fa-solid fa-chart-simple"></i> 1.2k</span>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  ))
                              )
                          ) : (
                              scheduledTweets.length > 0 ? scheduledTweets.map(item => (
                                  <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center group hover:border-[#1d9bf0]/50 transition-colors">
                                      <div className="flex gap-4 items-center">
                                          <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
                                              <i className={`fa-solid ${item.type === 'thread' ? 'fa-layer-group' : 'fa-font'}`}></i>
                                          </div>
                                          <div>
                                              <p className="text-white text-sm font-bold line-clamp-1 max-w-[200px]">{item.content[0]}</p>
                                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                                                  <i className="fa-regular fa-clock"></i> {new Date(item.time).toLocaleString()}
                                              </p>
                                          </div>
                                      </div>
                                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"><i className="fa-solid fa-pen"></i></button>
                                          <button onClick={() => setScheduledTweets(prev => prev.filter(t => t.id !== item.id))} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-slate-700 flex items-center justify-center transition-colors"><i className="fa-solid fa-trash"></i></button>
                                      </div>
                                  </div>
                              )) : (
                                  <div className="text-center py-12 text-slate-500">
                                      <i className="fa-regular fa-calendar text-2xl mb-2 opacity-50"></i>
                                      <p className="text-xs font-bold uppercase">Queue is empty</p>
                                  </div>
                              )
                          )}
                      </div>
                  </div>
              </div>
          </div>

          {/* AI Writer Modal */}
          {showAiModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                  <div className="bg-[#0f172a] border border-slate-700 w-full max-w-md rounded-[2rem] p-8 space-y-6 shadow-2xl relative">
                      <button onClick={() => setShowAiModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                          <i className="fa-solid fa-xmark text-xl"></i>
                      </button>
                      
                      <div className="text-center space-y-2">
                          <div className="w-16 h-16 bg-[#1d9bf0]/10 rounded-2xl flex items-center justify-center text-[#1d9bf0] text-3xl mx-auto mb-4 icon-4d">
                              <i className="fa-solid fa-wand-magic-sparkles"></i>
                          </div>
                          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">AI Thread Writer</h3>
                          <p className="text-xs text-slate-400 font-medium">Generate viral threads optimized for engagement using Gemini 3 Pro.</p>
                      </div>

                      <div className="space-y-4">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Topic / Keywords</label>
                              <input 
                                  type="text" 
                                  value={aiTopic}
                                  onChange={(e) => setAiTopic(e.target.value)}
                                  placeholder="e.g. AI in Marketing, Web3 Trends..."
                                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm focus:ring-1 focus:ring-[#1d9bf0] text-white font-medium"
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tone & Voice</label>
                              <div className="grid grid-cols-2 gap-2">
                                {['Viral / Hype', 'Professional', 'Educational', 'Witty', 'Storytelling', 'Controversial'].map(tone => (
                                    <button 
                                        key={tone}
                                        onClick={() => setAiTone(tone)}
                                        className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${aiTone === tone ? 'bg-[#1d9bf0] border-[#1d9bf0] text-white shadow-lg' : 'bg-slate-800 border-transparent text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {tone}
                                    </button>
                                ))}
                              </div>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 ml-1">Quick Presets</p>
                            <div className="flex flex-wrap gap-2">
                                {['SaaS Growth', 'React Tips', 'Startup Life', 'AI Tools'].map(t => (
                                    <button key={t} onClick={() => setAiTopic(t)} className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">{t}</button>
                                ))}
                            </div>
                          </div>
                      </div>

                      <button 
                          onClick={() => handleAiGenerate()}
                          disabled={isGeneratingAi || !aiTopic}
                          className="w-full py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 btn-3d"
                      >
                          {isGeneratingAi ? <i className="fa-solid fa-circle-notch fa-spin text-lg"></i> : <i className="fa-solid fa-bolt text-lg text-amber-500"></i>}
                          {isGeneratingAi ? 'Synthesizing Thread...' : 'Generate Content'}
                      </button>
                      
                      <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-tighter">
                        Powered by Gemini AI • Output is editable after generation
                      </p>
                  </div>
              </div>
          )}
      </div>
  );
};

export default TwitterDashboard;
