
import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid, 
  BarChart, Bar, YAxis, Legend 
} from 'recharts';
import { getYoutubeAnalytics } from '../services/geminiService';

const VIDEO_VIEWS_DATA = [
    { name: 'Mon', views: 42000 },
    { name: 'Tue', views: 38000 },
    { name: 'Wed', views: 65000 },
    { name: 'Thu', views: 51000 },
    { name: 'Fri', views: 72000 },
    { name: 'Sat', views: 84000 },
    { name: 'Sun', views: 91000 },
];

const YouTubeDashboard: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'analytics' | 'videos'>('analytics');

    useEffect(() => {
        const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
        setIsConnected(savedApps.includes('youtube'));
        if (savedApps.includes('youtube')) loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const analytics = await getYoutubeAnalytics();
        setData(analytics);
        setLoading(false);
    };

    const handleConnect = () => {
        const width = 600, height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        const popup = window.open('', 'YouTube Auth', `width=${width},height=${height},top=${top},left=${left}`);
        if(popup) {
            popup.document.write(`
                <html>
                    <head>
                        <title>Google API Authorization</title>
                        <style>
                            body { background: #f9f9f9; font-family: Roboto, Arial; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                            .card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
                            .logo { color: #FF0000; font-size: 40px; margin-bottom: 20px; }
                            .loader { border: 4px solid #f3f3f3; border-top: 4px solid #FF0000; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 20px auto; }
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        </style>
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                    </head>
                    <body>
                        <div class="card">
                            <div class="logo"><i class="fa-brands fa-youtube"></i></div>
                            <h2>Sign in with Google</h2>
                            <p>Social Stack wants to access your YouTube Data API to manage uploads and analytics.</p>
                            <div class="loader"></div>
                        </div>
                    </body>
                </html>
            `);
            setTimeout(() => {
                popup.close();
                const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
                if(!savedApps.includes('youtube')) {
                    localStorage.setItem('socialstack_connected_apps', JSON.stringify([...savedApps, 'youtube']));
                }
                setIsConnected(true);
                loadData();
            }, 2500);
        }
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] space-y-10 animate-in fade-in duration-500">
                <div className="w-32 h-32 bg-[#FF0000] rounded-[2.5rem] flex items-center justify-center text-7xl text-white shadow-2xl border-4 border-white/10 animate-float">
                    <i className="fa-brands fa-youtube"></i>
                </div>
                <div className="text-center space-y-4 max-w-lg">
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">YouTube Engine</h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        Connect your channel to automate video uploads, analyze audience retention, and track your revenue growth in real-time.
                    </p>
                </div>
                <button onClick={handleConnect} className="px-10 py-5 bg-[#FF0000] text-white rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-red-900/20 flex items-center gap-4 btn-3d">
                    <i className="fa-solid fa-link"></i> Authorize Channel
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* YouTube Themed Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-r from-[#FF0000] to-[#990000] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <i className="fa-brands fa-youtube text-[12rem]"></i>
                </div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-full p-1 bg-white">
                        <img src="https://ui-avatars.com/api/?name=Social+Stack+YT&background=000&color=fff" className="w-full h-full rounded-full border-4 border-red-600 object-cover" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black flex items-center gap-2">Social Stack Global <i className="fa-solid fa-circle-check text-white text-lg"></i></h2>
                        <p className="text-red-200 font-bold uppercase text-xs tracking-widest mt-1">YouTube Partner Node</p>
                        <div className="flex gap-6 mt-4">
                            <div className="text-center">
                                <p className="text-2xl font-black">{data?.subscribers.toLocaleString() || '...'}</p>
                                <p className="text-[10px] uppercase font-black opacity-70">Subscribers</p>
                            </div>
                            <div className="w-px h-10 bg-white/20"></div>
                            <div className="text-center">
                                <p className="text-2xl font-black">{data?.views.toLocaleString() || '...'}</p>
                                <p className="text-[10px] uppercase font-black opacity-70">Total Views</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 relative z-10">
                    <button onClick={() => window.location.reload()} className="px-5 py-3 bg-white text-red-600 rounded-xl font-bold uppercase text-xs flex items-center gap-2 shadow-lg">
                        <i className="fa-solid fa-rotate"></i> Refresh API
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Detailed Analytics */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-8 rounded-3xl border-slate-700/50 h-[450px]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">View Velocity (7D)</h3>
                            <div className="flex gap-4">
                                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><div className="w-2 h-2 bg-red-600 rounded-full"></div> Impression Views</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={VIDEO_VIEWS_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'rgba(255,0,0,0.05)'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px'}} />
                                <Bar dataKey="views" fill="#FF0000" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Latest Content Nodes</h3>
                        <div className="grid gap-4">
                            {data?.recentVideos.map((vid: any) => (
                                <div key={vid.id} className="glass-panel p-4 rounded-2xl border-slate-800 hover:border-red-600/50 transition-all group flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-60 h-32 rounded-xl overflow-hidden bg-black relative flex-shrink-0">
                                        <img src={vid.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <i className="fa-solid fa-play text-white text-3xl"></i>
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">12:45</div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h4 className="text-lg font-black text-white group-hover:text-red-500 transition-colors leading-tight">{vid.title}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{vid.date} • Published via Social Stack</p>
                                        </div>
                                        <div className="flex flex-wrap gap-6 border-t border-slate-800/50 pt-4">
                                            <div className="text-center">
                                                <p className="text-white font-bold text-sm">{vid.views}</p>
                                                <p className="text-[9px] uppercase text-slate-500 font-black">Views</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white font-bold text-sm">{vid.likes}</p>
                                                <p className="text-[9px] uppercase text-slate-500 font-black">Likes</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-emerald-400 font-bold text-sm">98.2%</p>
                                                <p className="text-[9px] uppercase text-slate-500 font-black">Retention</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col gap-2 justify-center">
                                        <button className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-red-600 transition-all flex items-center justify-center"><i className="fa-solid fa-chart-line"></i></button>
                                        <button className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-red-600 transition-all flex items-center justify-center"><i className="fa-solid fa-pen"></i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Studio Controls */}
                <div className="space-y-8">
                    <div className="glass-panel p-8 rounded-[2.5rem] border-red-500/20 bg-red-950/5">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Estimated Revenue</h3>
                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-5xl font-black text-white">${data?.revenue.toLocaleString() || '...'}</span>
                            <span className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-1"><i className="fa-solid fa-arrow-up"></i> 14%</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Last 28 Days (Node: AdSense-v4)</p>
                        
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-400">RPM (Revenue Per 1k)</span>
                                <span className="text-white">$4.20</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-600 w-[65%]"></div>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-400">Playback-based CPM</span>
                                <span className="text-white">$12.50</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl border-slate-700/50">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Audience Logic</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Returning Viewers', val: '42%', color: 'bg-indigo-500' },
                                { label: 'New Viewers', val: '58%', color: 'bg-red-600' }
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase">
                                        <span className="text-slate-500">{item.label}</span>
                                        <span className="text-white">{item.val}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: item.val }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full py-4 bg-[#FF0000] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/20 hover:scale-105 transition-all flex items-center justify-center gap-3 btn-3d">
                            <i className="fa-solid fa-cloud-arrow-up"></i> Quick Upload
                        </button>
                        <button className="w-full py-4 bg-slate-800 text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center justify-center gap-3">
                            <i className="fa-solid fa-comments"></i> Manage Comments
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeDashboard;
