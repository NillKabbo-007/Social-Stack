
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
    const posts = await getLinkedInFeed();
    setFeed(posts);
    setLoadingFeed(false);
  };

  const handleDownloadReport = () => {
    alert("Synthesizing professional network analytics report (PDF)...");
    setTimeout(() => alert("LinkedIn_Growth_Report.pdf ready."), 1500);
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
        <div className="flex items-center gap-3">
            <button onClick={handleDownloadReport} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all flex items-center gap-2">
                <i className="fa-solid fa-file-arrow-down"></i> Export Report
            </button>
            <div className="flex items-center gap-3 bg-indigo-50 dark:bg-slate-800/50 px-4 py-2.5 rounded-xl border border-indigo-100 dark:border-slate-700 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-slate-700 dark:text-white">Organization Sync Active</span>
            </div>
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
          <div key={i} className="glass-panel p-6 rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 group hover:border-indigo-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#0A66C2]/10 rounded-xl text-[#0A66C2] transition-transform group-hover:scale-110">
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">{stat.trend}</span>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.val}</p>
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
                <div className="flex gap-4">
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
             <div className="flex justify-between items-center px-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Engagement Stream</h3>
                <div className="flex gap-3">
                    <button onClick={() => alert("Packaging page interactions into XLSX...")} className="text-[10px] font-black text-indigo-400 uppercase flex items-center gap-1.5"><i className="fa-solid fa-download"></i> Export CSV</button>
                    <button onClick={loadFeed} className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors"><i className="fa-solid fa-rotate-right mr-1"></i> Sync</button>
                </div>
             </div>
             
             {loadingFeed ? (
                <div className="py-20 text-center text-slate-400 space-y-4">
                   <i className="fa-solid fa-satellite fa-spin text-3xl text-[#0A66C2]"></i>
                   <p className="text-[10px] font-black uppercase tracking-widest">Polling Network Frequencies...</p>
                </div>
             ) : (
                <div className="grid gap-4">
                   {feed.length > 0 ? feed.map((post, idx) => (
                      <div key={idx} className="bg-white dark:bg-[#1b273d] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden group hover:border-indigo-500/20 transition-all">
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0A66C2]"></div>
                         <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-lg font-bold text-slate-500 flex-shrink-0 border border-white/5 shadow-inner">
                               {post.author?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex justify-between items-start">
                                  <div className="min-w-0">
                                     <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{post.author}</h4>
                                     <p className="text-[10px] text-slate-500 truncate">{post.role}</p>
                                     <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                                        {post.time} · <i className="fa-solid fa-earth-americas text-[8px]"></i> Public
                                     </p>
                                  </div>
                                  <div className="flex gap-2">
                                     <button onClick={() => alert("Post metadata exported.")} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                                        <i className="fa-solid fa-download text-xs"></i>
                                     </button>
                                     <i className="fa-brands fa-linkedin text-[#0A66C2] text-xl"></i>
                                  </div>
                               </div>
                               <p className="text-xs text-slate-700 dark:text-slate-300 mt-4 leading-relaxed whitespace-pre-wrap font-medium">{post.content}</p>
                               
                               <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-6">
                                  <span className="text-[10px] font-black text-slate-500 flex items-center gap-2 hover:text-[#0A66C2] transition-colors cursor-pointer uppercase tracking-widest">
                                     <i className="fa-regular fa-thumbs-up text-xs"></i> {post.metrics}
                                  </span>
                                  <span className="text-[10px] font-black text-slate-500 flex items-center gap-2 hover:text-indigo-400 transition-colors cursor-pointer uppercase tracking-widest">
                                     <i className="fa-regular fa-comment-dots text-xs"></i> Comment
                                  </span>
                                  <span className="text-[10px] font-black text-slate-500 flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer uppercase tracking-widest">
                                     <i className="fa-solid fa-share-nodes text-xs"></i> Share
                                  </span>
                                  <span className="text-[10px] font-black text-indigo-400 flex items-center gap-2 hover:text-indigo-300 transition-colors cursor-pointer ml-auto uppercase tracking-widest">
                                     <i className="fa-solid fa-chart-simple text-xs"></i> Insights
                                  </span>
                               </div>
                            </div>
                         </div>
                      </div>
                   )) : (
                      <div className="text-center py-20 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800 text-slate-500 space-y-4">
                         <i className="fa-solid fa-inbox text-4xl opacity-20"></i>
                         <p className="text-xs font-black uppercase tracking-widest">No activity detected on this node.</p>
                      </div>
                   )}
                </div>
             )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
           
           {/* Post Composer */}
           <div className="glass-panel p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-2xl">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Create Broadcast</h3>
              <textarea 
                 value={postText}
                 onChange={(e) => setPostText(e.target.value)}
                 placeholder="Share a professional milestone or insight..."
                 className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-xs font-medium text-slate-900 dark:text-white resize-none h-40 focus:ring-1 focus:ring-[#0A66C2] mb-6 transition-all shadow-inner"
              />
              <div className="flex justify-between items-center">
                 <div className="flex gap-4 text-slate-400">
                    <button className="hover:text-[#0A66C2] transition-colors hover:scale-125"><i className="fa-regular fa-image text-lg"></i></button>
                    <button className="hover:text-[#0A66C2] transition-colors hover:scale-125"><i className="fa-brands fa-youtube text-lg"></i></button>
                    <button className="hover:text-[#0A66C2] transition-colors hover:scale-125"><i className="fa-regular fa-calendar-check text-lg"></i></button>
                 </div>
                 <button 
                    onClick={handlePost}
                    disabled={isPosting || !postText.trim()}
                    className="px-6 py-3 bg-[#0A66C2] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#004182] transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
                 >
                    {isPosting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-regular fa-paper-plane"></i>}
                    Post
                 </button>
              </div>
           </div>

           {/* Demographics */}
           <div className="glass-panel p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-700/50 h-96 flex flex-col shadow-xl">
              <div className="mb-6">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Network Landscape</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Job Function Distribution</p>
              </div>
              <div className="flex-1 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={DEMOGRAPHICS_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={8} dataKey="value">
                          {DEMOGRAPHICS_DATA.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                    </PieChart>
                 </ResponsiveContainer>
                 {/* Legend Overlay */}
                 <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm rounded-[2rem]">
                    {DEMOGRAPHICS_DATA.map((d, i) => (
                        <div key={i} className="flex items-center gap-3 mb-2">
                            <span className="w-2.5 h-2.5 rounded-full shadow-lg" style={{backgroundColor: COLORS[i]}}></span>
                            <span className="text-[10px] text-white font-black uppercase tracking-widest">{d.name} {d.value}%</span>
                        </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Quick Actions */}
           <div className="space-y-3">
              <button className="w-full py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between px-6 transition-all border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95">
                 <span>Boost Performance</span>
                 <i className="fa-solid fa-bolt text-amber-500 text-lg"></i>
              </button>
              <button className="w-full py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between px-6 transition-all border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95">
                 <span>Synapse Invitation</span>
                 <i className="fa-solid fa-user-plus text-emerald-500 text-lg"></i>
              </button>
              <button onClick={handleDownloadReport} className="w-full py-4 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between px-6 transition-all border border-[#0A66C2]/20 shadow-sm active:scale-95">
                 <span>Archived Analytics</span>
                 <i className="fa-solid fa-file-pdf text-lg"></i>
              </button>
           </div>

        </div>
      </div>
    </div>
  );
};

export default LinkedInDashboard;
