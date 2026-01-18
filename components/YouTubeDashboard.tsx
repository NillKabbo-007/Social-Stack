
import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid, 
  BarChart, Bar, YAxis, Legend 
} from 'recharts';
import { getYoutubeAnalytics } from '../services/geminiService';

const VIDEO_VIEWS_DATA = [
    { name: 'Mon', views: 42000, watchTime: 1200 },
    { name: 'Tue', views: 38000, watchTime: 1100 },
    { name: 'Wed', views: 65000, watchTime: 1800 },
    { name: 'Thu', views: 51000, watchTime: 1500 },
    { name: 'Fri', views: 72000, watchTime: 2100 },
    { name: 'Sat', views: 84000, watchTime: 2500 },
    { name: 'Sun', views: 91000, watchTime: 2800 },
];

const YouTubeDashboard: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

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

    const handleDownloadReport = () => {
        alert("Generating channel growth report (PDF)...");
        setTimeout(() => alert("Channel_Growth_2026.pdf ready."), 1500);
    };

    const handleConnect = () => {
        const width = 600, height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const popup = window.open('', 'YouTube Auth', `width=${width},height=${height},top=${top},left=${left}`);
        if(popup) {
            popup.document.write(`
                <html><body style="background:#f9f9f9;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;">
                <i class="fa-brands fa-youtube" style="color:#FF0000;font-size:40px;margin-bottom:20px;"></i>
                <h2>Sign in with Google</h2><p>Authorize Social Stack to access channel metrics.</p>
                <div style="border:4px solid #f3f3f3;border-top-color:#FF0000;border-radius:50%;width:30px;height:30px;animation:spin 1s linear infinite;"></div>
                <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                </body></html>
            `);
            setTimeout(() => {
                popup.close();
                const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
                if(!savedApps.includes('youtube')) localStorage.setItem('socialstack_connected_apps', JSON.stringify([...savedApps, 'youtube']));
                setIsConnected(true);
                loadData();
            }, 2500);
        }
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] space-y-10 animate-in fade-in duration-500">
                <div className="w-32 h-32 bg-[#FF0000] rounded-[2.5rem] flex items-center justify-center text-7xl text-white shadow-2xl border-4 border-white/10"><i className="fa-brands fa-youtube"></i></div>
                <button onClick={handleConnect} className="px-10 py-5 bg-[#FF0000] text-white rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-red-900/20 flex items-center gap-4 btn-3d"><i className="fa-solid fa-link"></i> Authorize Channel</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 select-none">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-r from-[#FF0000] to-[#990000] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white">
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-full p-1 bg-white shadow-xl">
                        <img src="https://ui-avatars.com/api/?name=Social+Stack+YT&background=000&color=fff" className="w-full h-full rounded-full border-4 border-red-600 object-cover" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black flex items-center gap-2 uppercase tracking-tighter">Studio Dashboard Hub <i className="fa-solid fa-circle-check text-white text-lg"></i></h2>
                        <p className="text-red-100 font-bold uppercase text-[10px] tracking-[0.3em] mt-1 opacity-80">Global Network Node: 882.1.X.9</p>
                    </div>
                </div>
                <div className="flex gap-3 relative z-10">
                    <button onClick={handleDownloadReport} className="px-5 py-3 bg-white text-red-600 rounded-xl font-bold uppercase text-[10px] flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
                        <i className="fa-solid fa-file-pdf"></i> Download Report
                    </button>
                    <button onClick={() => loadData()} disabled={loading} className="px-5 py-3 bg-red-800 text-white rounded-xl font-bold uppercase text-[10px] flex items-center gap-2 shadow-lg hover:brightness-125 transition-all">
                        {loading ? <i className="fa-solid fa-sync fa-spin"></i> : <i className="fa-solid fa-rotate"></i>}
                        Sync Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Subscribers', val: data?.subscribers?.toLocaleString() || '15,240', trend: '+1.2%', color: 'text-white' },
                  { label: 'Total Views', val: data?.totalViews?.toLocaleString() || '1.2M', trend: '+8.5%', color: 'text-white' },
                  { label: 'Avg Retention', val: `${data?.engagementRate || '42'}%`, trend: '+2.1%', color: 'text-emerald-400' },
                  { label: 'Ad Revenue', val: `$${data?.revenue?.toLocaleString() || '2,450'}`, trend: '+12%', color: 'text-emerald-400' }
                ].map((stat, i) => (
                  <div key={i} className="glass-panel p-6 rounded-3xl border-white/5 bg-slate-900/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><i className="fa-brands fa-youtube text-4xl"></i></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h4 className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.val}</h4>
                    <span className="text-[10px] font-bold text-emerald-500 mt-2 block">{stat.trend} this month</span>
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-8 rounded-3xl border-slate-700/50 h-[450px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-red-600/5 blur-[100px] -mr-32 -mt-32"></div>
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2"><i className="fa-solid fa-chart-line text-red-500"></i> Growth Velocity</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-[10px] font-tech font-bold text-slate-500 uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-red-600"></span> Views</div>
                                <div className="flex items-center gap-2 text-[10px] font-tech font-bold text-slate-500 uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Watch Time</div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={VIDEO_VIEWS_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.1} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }} />
                                <Bar dataKey="views" fill="#FF0000" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="watchTime" fill="#6366f1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Content Performance Nodes</h3>
                            <button onClick={() => alert("Downloading metadata export (XLSX)...")} className="text-[10px] font-black text-indigo-400 uppercase flex items-center gap-2 hover:text-white transition-colors"><i className="fa-solid fa-file-excel"></i> Export Video Data</button>
                        </div>
                        <div className="grid gap-4">
                            {data?.recentVideos.map((vid: any) => (
                                <div key={vid.id} className="glass-panel p-4 rounded-[2rem] border-slate-800 hover:border-red-600/50 transition-all group flex flex-col sm:flex-row gap-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                        <i className="fa-brands fa-youtube text-8xl"></i>
                                    </div>
                                    <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden bg-black flex-shrink-0 relative">
                                        <img src={vid.thumbnail} className="w-full h-full object-cover opacity-80" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                            <button onClick={(e) => { e.stopPropagation(); alert("Syncing node assets..."); }} className="w-10 h-10 bg-white text-red-600 rounded-xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"><i className="fa-solid fa-download text-sm"></i></button>
                                        </div>
                                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-bold text-white uppercase tracking-widest">{vid.watchTime || '10:00'}</div>
                                    </div>
                                    <div className="flex-1 space-y-4 py-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-black text-white text-lg leading-tight uppercase tracking-tight group-hover:text-red-500 transition-colors">{vid.title}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{vid.views} Views • {vid.likes} Likes</p>
                                            </div>
                                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                                                {vid.retention || '88'}% Retention
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-600" style={{ width: `${vid.retention || 80}%` }}></div>
                                            </div>
                                            <span className="text-[9px] font-tech text-slate-600 uppercase">Retention Curve</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-panel p-10 rounded-[3rem] border-red-500/20 bg-red-950/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] -mr-16 -mt-16 group-hover:bg-red-600/20 transition-all duration-700"></div>
                        <h3 className="text-[11px] font-tech text-red-500 uppercase tracking-[0.4em] mb-8 font-black">Monetization Kernel</h3>
                        <div className="space-y-8 relative z-10">
                            <div>
                                <p className="text-6xl font-display font-black text-white glowing-text tracking-tighter">${data?.revenue.toLocaleString() || '...'}</p>
                                <p className="text-[10px] text-slate-600 font-tech uppercase tracking-widest mt-4">Estimated Net Earnings (30D)</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-slate-900/60 border border-white/5 rounded-2xl">
                                    <p className="text-[9px] text-slate-500 uppercase font-black mb-1">RPM Node</p>
                                    <p className="text-xl font-black text-white">$4.20</p>
                                </div>
                                <div className="p-5 bg-slate-900/60 border border-white/5 rounded-2xl">
                                    <p className="text-[9px] text-slate-500 uppercase font-black mb-1">CPM Target</p>
                                    <p className="text-xl font-black text-white">$12.5</p>
                                </div>
                            </div>
                            <button className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-[2rem] font-display font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all btn-3d active:scale-95">
                                <i className="fa-solid fa-money-bill-trend-up text-lg"></i>
                                Open Finance Hub
                            </button>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-[2.5rem] border-indigo-500/20 bg-indigo-600/5 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-tech text-indigo-400 uppercase tracking-widest font-black">AI Channel Advisor</p>
                            <i className="fa-solid fa-brain-circuit text-indigo-500 animate-pulse"></i>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Your retention rate on vertical nodes is 12% higher than industry average. Consider increasing frequency of "Technical Deep-Dives" to maximize RPM growth.</p>
                        <button className="w-full mt-6 py-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Generate Strategy Node</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeDashboard;
