
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { getLinkedInFeed } from '../services/geminiService';

const VISITOR_DATA = [
  { date: 'Mon', visitors: 145, page_views: 320 },
  { date: 'Tue', visitors: 230, page_views: 450 },
  { date: 'Wed', visitors: 190, page_views: 380 },
  { date: 'Thu', visitors: 280, page_views: 560 },
  { date: 'Fri', visitors: 310, page_views: 610 },
  { date: 'Sat', visitors: 120, page_views: 240 },
  { date: 'Sun', visitors: 150, page_views: 290 },
];

const DEMOGRAPHICS_DATA = [
  { name: 'Business Dev', value: 35 },
  { name: 'Engineering', value: 25 },
  { name: 'Marketing', value: 20 },
  { name: 'Founders', value: 15 },
  { name: 'HR', value: 5 },
];

const COLORS = ['#0A66C2', '#004182', '#378fe9', '#70b5f9', '#b3d7ff'];

const LinkedInDashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [postText, setPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
    setIsConnected(savedApps.includes('linkedin'));

    if (savedApps.includes('linkedin')) {
      loadFeed();
    }
  }, []);

  const loadFeed = async () => {
    setLoadingFeed(true);
    // Simulate slight delay for realism if needed, or just call service
    const posts = await getLinkedInFeed();
    setFeed(posts);
    setLoadingFeed(false);
  };

  const handleConnect = () => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open('', 'LinkedIn Auth', `width=${width},height=${height},top=${top},left=${left}`);
    if (popup) {
      popup.document.write(`
        <html>
            <head>
                <title>LinkedIn Authorization</title>
                <style>
                    body { background: #fff; color: #000; font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                    .logo { color: #0A66C2; font-size: 48px; margin-bottom: 20px; font-weight: bold; }
                    .btn { background: #0A66C2; color: white; border: none; padding: 10px 24px; border-radius: 24px; font-size: 16px; font-weight: 600; cursor: pointer; }
                    .loader { border: 3px solid #f3f3f3; border-top: 3px solid #0A66C2; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin-top: 20px; }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                </style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body>
                <div class="logo"><i class="fa-brands fa-linkedin"></i> LinkedIn</div>
                <h2 style="margin-bottom: 10px;">Auth Request</h2>
                <p style="color: #666; margin-bottom: 30px;">Social Stack is requesting access to your profile and pages.</p>
                <div class="loader"></div>
            </body>
        </html>
      `);
      setTimeout(() => {
        popup.close();
        const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
        if (!savedApps.includes('linkedin')) {
          const newApps = [...savedApps, 'linkedin'];
          localStorage.setItem('socialstack_connected_apps', JSON.stringify(newApps));
        }
        setIsConnected(true);
        loadFeed();
      }, 2000);
    }
  };

  const handlePost = () => {
    if (!postText.trim()) return;
    setIsPosting(true);
    setTimeout(() => {
      const newPost = {
        author: 'Social Stack User',
        role: 'Marketing Director',
        content: postText,
        time: 'Just now',
        metrics: '0 interactions'
      };
      setFeed([newPost, ...feed]);
      setPostText('');
      setIsPosting(false);
    }, 1500);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] space-y-8 animate-in fade-in duration-500">
        <div className="w-32 h-32 bg-[#0A66C2] rounded-[2.5rem] flex items-center justify-center text-7xl text-white shadow-2xl border-4 border-white/10">
          <i className="fa-brands fa-linkedin-in"></i>
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Connect LinkedIn</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm font-medium">
            Integrate your professional network to track page analytics, schedule B2B content, and monitor engagement trends.
          </p>
        </div>
        <button onClick={handleConnect} className="px-10 py-5 bg-[#0A66C2] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#004182] transition-all shadow-xl shadow-blue-900/20 flex items-center gap-3">
          <i className="fa-solid fa-link"></i>
          Connect Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="text-[#0A66C2]"><i className="fa-brands fa-linkedin"></i></span> Professional Hub
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Page Analytics & Content Strategy</p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-indigo-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-700 dark:text-white">Organization Sync Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Search Appearances', val: '842', trend: '+12%', icon: 'fa-magnifying-glass' },
          { label: 'Unique Visitors', val: '1.2k', trend: '+8.5%', icon: 'fa-users' },
          { label: 'New Followers', val: '145', trend: '+22%', icon: 'fa-user-plus' },
          { label: 'Post Impressions', val: '12.4k', trend: '+5%', icon: 'fa-chart-simple' }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#0A66C2]/10 rounded-xl text-[#0A66C2]">
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">{stat.trend}</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.val}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Analytics & Feed */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Chart */}
          <div className="glass-panel p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-700/50 h-96 relative overflow-hidden">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Visitor Analytics</h3>
                <div className="flex gap-2">
                   <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><span className="w-2 h-2 rounded-full bg-[#0A66C2]"></span> Page Views</span>
                   <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Unique Visitors</span>
                </div>
             </div>
             <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={VISITOR_DATA}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0A66C2" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="page_views" stroke="#0A66C2" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="visitors" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorUnique)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          {/* Feed */}
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Recent Updates</h3>
                <button onClick={loadFeed} className="text-xs font-bold text-[#0A66C2] hover:text-indigo-500"><i className="fa-solid fa-rotate-right mr-1"></i> Refresh</button>
             </div>
             
             {loadingFeed ? (
                <div className="py-12 text-center text-slate-400">
                   <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                   <p className="text-xs font-bold uppercase">Syncing Feed...</p>
                </div>
             ) : (
                <div className="grid gap-4">
                   {feed.length > 0 ? feed.map((post, idx) => (
                      <div key={idx} className="bg-white dark:bg-[#1b273d] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0A66C2]"></div>
                         <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-lg font-bold text-slate-500 flex-shrink-0">
                               {post.author?.[0] || 'U'}
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-start">
                                  <div>
                                     <h4 className="font-bold text-slate-900 dark:text-white text-sm">{post.author}</h4>
                                     <p className="text-[10px] text-slate-500">{post.role}</p>
                                     <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                        {post.time} <i className="fa-solid fa-earth-americas text-[8px]"></i>
                                     </p>
                                  </div>
                                  <i className="fa-brands fa-linkedin text-[#0A66C2] text-xl"></i>
                               </div>
                               <p className="text-xs text-slate-700 dark:text-slate-300 mt-3 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                               
                               <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-6">
                                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 group-hover:text-[#0A66C2] transition-colors cursor-pointer">
                                     <i className="fa-regular fa-thumbs-up"></i> {post.metrics}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 hover:text-indigo-400 transition-colors cursor-pointer">
                                     <i className="fa-regular fa-comment-dots"></i> Comment
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer">
                                     <i className="fa-solid fa-share-nodes"></i> Share
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer ml-auto">
                                     <i className="fa-solid fa-chart-simple"></i> View Analytics
                                  </span>
                               </div>
                            </div>
                         </div>
                      </div>
                   )) : (
                      <div className="text-center py-8 text-slate-500 text-xs">No posts found.</div>
                   )}
                </div>
             )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
           
           {/* Post Composer */}
           <div className="glass-panel p-6 rounded-[2rem] border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Start a Post</h3>
              <textarea 
                 value={postText}
                 onChange={(e) => setPostText(e.target.value)}
                 placeholder="What do you want to talk about?"
                 className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-xs font-medium text-slate-900 dark:text-white resize-none h-32 focus:ring-1 focus:ring-[#0A66C2] mb-4"
              />
              <div className="flex justify-between items-center">
                 <div className="flex gap-3 text-slate-400">
                    <button className="hover:text-[#0A66C2] transition-colors"><i className="fa-regular fa-image"></i></button>
                    <button className="hover:text-[#0A66C2] transition-colors"><i className="fa-brands fa-youtube"></i></button>
                    <button className="hover:text-[#0A66C2] transition-colors"><i className="fa-regular fa-calendar-check"></i></button>
                 </div>
                 <button 
                    onClick={handlePost}
                    disabled={isPosting || !postText.trim()}
                    className="px-5 py-2 bg-[#0A66C2] text-white rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-[#004182] transition-all disabled:opacity-50 flex items-center gap-2"
                 >
                    {isPosting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-regular fa-paper-plane"></i>}
                    Post
                 </button>
              </div>
           </div>

           {/* Demographics */}
           <div className="glass-panel p-6 rounded-[2rem] border-slate-200 dark:border-slate-700/50 h-80 flex flex-col">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Follower Demographics</h3>
              <p className="text-[10px] text-slate-500 mb-4">By Job Function</p>
              <div className="flex-1 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={DEMOGRAPHICS_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                          {DEMOGRAPHICS_DATA.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }} />
                    </PieChart>
                 </ResponsiveContainer>
                 {/* Custom Legend */}
                 <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm rounded-2xl">
                    {DEMOGRAPHICS_DATA.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></span>
                            <span className="text-[9px] text-white font-bold">{d.name} {d.value}%</span>
                        </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Quick Actions */}
           <div className="space-y-2">
              <button className="w-full py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl text-xs font-bold flex items-center justify-between px-4 transition-all">
                 <span>Boost Recent Post</span>
                 <i className="fa-solid fa-bolt text-amber-500"></i>
              </button>
              <button className="w-full py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl text-xs font-bold flex items-center justify-between px-4 transition-all">
                 <span>Invite Connections</span>
                 <i className="fa-solid fa-user-group text-emerald-500"></i>
              </button>
           </div>

        </div>
      </div>
    </div>
  );
};

export default LinkedInDashboard;
